from flask import Blueprint, render_template, request, jsonify, session, redirect
from app.models import db
from app.agenda_service import gerar_grade_horarios
import bcrypt
import random
from datetime import datetime, timedelta
from app.email_service import enviar_email
from app.agenda_service import horarios_livres
import pytz
from flask_dance.contrib.google import make_google_blueprint, google
from flask_dance.consumer import oauth_authorized
import os

# criamos um "Mapa de Rotas" (Bluerprint)
main_routes = Blueprint('main', __name__)

google_blueprint = make_google_blueprint(
    client_id=os.getenv('GOOGLE_CLIENT_ID'),
    client_secret=os.getenv('GOOGLE_CLIENT_SECRET'),
    scope=['https://www.googleapis.com/auth/userinfo.email',
           'https://www.googleapis.com/auth/userinfo.profile',
           'openid'],
    redirect_to='main.google_login',
    redirect_url='https://barberbook-development.up.railway.app/login/google/authorized'
)


@main_routes.route('/google/sucesso')
def google_login():
    try:
        if not google.authorized:
            return redirect('/')

        info = google.get('/oauth2/v2/userinfo')
        dados = info.json()

        email = dados['email']
        nome = dados['name']

        verifica_email = 'SELECT * FROM usuarios WHERE email = %s'
        usuario = db.obter_dados(verifica_email, (email,))

        if not usuario:
            sql_guardar_dados = """
        INSERT INTO usuarios (nome, email, senha, whatsapp)
        VALUES (%s, %s, %s, %s)
        """
            valores = (
                nome,
                email,
                'GOOGLE_AUTH',
                ''
            )
            resultado = db.executar_query(sql_guardar_dados, valores)
            session['usuario_id'] = resultado
            return redirect('/dashboard')
        else:
            session['usuario_id'] = usuario[0]['id']
            return redirect('/dashboard')

    except Exception as erro:
        return jsonify({'erro': str(erro)}), 500


@main_routes.route('/', methods=['GET', 'POST'])
def pagina_inicial():
    if request.method == 'POST':
        try:
            dados_login = request.get_json()
            dados_obrigatorios = ['email', 'senha']

            if not all(dados in dados_login for dados in dados_obrigatorios):
                return jsonify({'erro': 'Faltam dados obrigatórios'}), 400

            verifica_email = 'SELECT * FROM usuarios WHERE email = %s'
            email_nao_cadastrado = db.obter_dados(
                verifica_email, (dados_login['email'],))

            if not email_nao_cadastrado:
                return jsonify({'erro': 'Email não cadastrado!'})

            senha_bytes = dados_login['senha'].encode('utf-8')
            senha_hash_banco = email_nao_cadastrado[0]['senha']
            senha_correta = bcrypt.checkpw(
                senha_bytes, senha_hash_banco.encode('utf-8'))
            if not senha_correta:
                return jsonify({'erro': 'Senha incorreta!'}), 401
            else:
                session['usuario_id'] = email_nao_cadastrado[0]['id']
                return jsonify({'mensagem': 'Login realizado com sucesso!'}), 200

        except Exception as erro:
            return jsonify({'erro': str(erro)}), 500
    else:
        return render_template('login.html')


""" ROTA PARA CADASTRO """


@main_routes.route('/cadastro', methods=['GET', 'POST'])
def pagina_cadastro():
    if request.method == 'POST':
        try:
            dados_para_cadastro = request.get_json()
            dados_obrigatorios = ['nome', 'email', 'senha', 'whatsapp']

            if not all(dados in dados_para_cadastro for dados in dados_obrigatorios):
                return jsonify({'erro': 'Faltam campos obrigatórios'}), 400

            sql_verifica_email = 'SELECT * FROM usuarios WHERE email = %s'
            email_ja_existe = db.obter_dados(
                sql_verifica_email, (dados_para_cadastro['email'],))

            sql_verificar_whatsapp = 'SELECT * FROM usuarios WHERE whatsapp = %s'
            whatsapp_ja_existe = db.obter_dados(
                sql_verificar_whatsapp, (dados_para_cadastro['whatsapp'],))

            if email_ja_existe:
                return jsonify({'erro': 'Email já cadastrado!'}), 401

            if whatsapp_ja_existe:
                return jsonify({'erro': 'Whatsapp já cadastrado'}), 401

            senha_bytes = dados_para_cadastro['senha'].encode('utf-8')
            senha_hash = bcrypt.hashpw(senha_bytes, bcrypt.gensalt())

            sql_guardar_dados = """
            INSERT INTO usuarios (nome, email, senha, whatsapp)
            VALUES (%s, %s, %s, %s)
            """
            valores = (
                dados_para_cadastro['nome'],
                dados_para_cadastro['email'],
                senha_hash,
                dados_para_cadastro['whatsapp']
            )
            resultado = db.executar_query(sql_guardar_dados, valores)

            if resultado:
                return jsonify({'mensagem': 'Cadastro concluido com sucesso!'}), 200
            else:
                return jsonify({'erro': 'Cadastro não finalizado!'}), 500

        except Exception as erro:
            return jsonify({'erro': str(erro)}), 500
    else:
        return render_template('cadastro.html')


""" ROTA PARA VALIDAR EMAIL PARA RECEBER O CÓDIGO DE RECUPERAÇÃO DE SENHA """


@main_routes.route('/recuperacao-de-senha', methods=['GET', 'POST'])
def pagina_recuperar_senha():
    if request.method == 'POST':
        try:
            dados_recebidos = request.get_json()

            if 'email' not in dados_recebidos:
                return jsonify({'erro': 'Precisa preencher campo de email para receber o código!'}), 400

            verifica_email = 'SELECT * FROM usuarios WHERE email = %s'
            email_nao_cadastrado = db.obter_dados(
                verifica_email, (dados_recebidos['email'],))

            if not email_nao_cadastrado:
                return jsonify({'erro': 'Email não cadastrado'})
            else:
                codigo = str(random.randint(100000, 999999))
                expiracao = datetime.now() + timedelta(minutes=10)

                salvar_codigo = 'UPDATE usuarios SET codigo_recuperacao = %s, codigo_expiracao = %s WHERE email = %s'
                resultado = db.executar_query(
                    salvar_codigo, (codigo, expiracao, dados_recebidos['email'],))

                if resultado:
                    enviado = enviar_email(dados_recebidos['email'], codigo)
                    if enviado:
                        session['email_recuperacao'] = dados_recebidos['email']
                        return jsonify({'mensagem': 'Código enviado para seu email!'}), 200
                    else:
                        return jsonify({'erro': 'Falha ao enviar email'}), 500
                else:
                    return jsonify({'erro': 'Erro ao salvar o código'}), 500
        except Exception as erro:
            return jsonify({'erro': str(erro)}), 500
    return render_template('recuperacao-de-senha.html')


""" ROTA PARA VALIDAR CÓDIGO DE RECUPERAÇÃO DE SENHA """


@main_routes.route('/validar-codigo', methods=['GET', 'POST'])
def validar_codigo():
    try:
        email = session.get('email_recuperacao')
        if not email:
            return jsonify({'erro': 'Sessão expirada, solicite o código novamente'}), 400

        codigo_recebido = request.get_json()

        if 'codigo' not in codigo_recebido:
            return jsonify({'erro': 'Precisa informar o código enviado para seu email!'}), 400

        verificar_codigo = 'SELECT codigo_recuperacao, codigo_expiracao FROM usuarios WHERE email = %s'
        resultado = db.obter_dados(verificar_codigo, (email,))

        codigo_banco_de_dados = resultado[0]['codigo_recuperacao']

        if codigo_banco_de_dados == codigo_recebido['codigo']:
            expiracao = resultado[0]['codigo_expiracao']
            if datetime.now() < expiracao:
                deleta_codigo = 'UPDATE usuarios SET codigo_recuperacao = NULL, codigo_expiracao = NULL WHERE email = %s'
                db.executar_query(deleta_codigo, (email,))
                return jsonify({'mensagem': 'Código válido!'}), 200
            else:
                return jsonify({'erro': 'Código expirado!'}), 400
        else:
            return jsonify({'erro': 'Código inválido!'}), 400
    except Exception as erro:
        return jsonify({'erro': str(erro)}), 500


""" ROTA PARA CRIAR NOVA SENHA """


@main_routes.route('/criar-senha', methods=['GET', 'POST'])
def pagina_criar_senha():
    if request.method == 'POST':
        try:
            email = session.get('email_recuperacao')
            if not email:
                return jsonify({'erro': 'Sessão expirada, solicite o código novamente!'}), 400
            nova_senha = request.get_json()

            if 'senha' not in nova_senha:
                return jsonify({'erro': 'Digite sua nova senha!'}), 400
            senha_bytes = nova_senha['senha'].encode('utf-8')
            senha_hash = bcrypt.hashpw(senha_bytes, bcrypt.gensalt())

            atualiza_senha = 'UPDATE usuarios SET senha = %s WHERE email = %s'
            resultado = db.executar_query(atualiza_senha, (senha_hash, email,))

            if resultado:
                session.pop('email_recuperacao', None)
                return jsonify({'mensagem': 'Sua senha foi redefinida com sucesso!'}), 200

            else:
                return jsonify({'erro': 'Erro ao criar sua nova senha!'}), 400
        except Exception as erro:
            return jsonify({'erro': str(erro)})
    else:
        return render_template('criar-senha.html')


@main_routes.route('/dashboard')
def pagina_dashboard():
    return render_template('dashboard.html')


@main_routes.route('/agendamentos', methods=['GET', 'POST'])
def pagina_agendamentos():
    if request.method == 'POST':
        try:
            usuario_id = session.get('usuario_id')
            if not usuario_id:
                return jsonify({'erro': 'Faça login para agendar!'}), 401

            dados_agendamento = request.get_json()
            dados_obrigatorios = ['nome_cliente', 'whatsapp', 'corte_nome',
                                  'corte_descricao', 'tempo_corte', 'corte_preco', 'data_hora', 'barbeiro']

            if not all(dados in dados_agendamento for dados in dados_obrigatorios):
                return jsonify({'erro': 'Dados faltando!'}), 400

            fuso_brasilia = pytz.timezone('America/Sao_Paulo')
            agora = datetime.now(fuso_brasilia)

            data_hora = datetime.strptime(
                dados_agendamento['data_hora'], '%Y-%m-%d %H:%M:%S')
            data_hora = fuso_brasilia.localize(data_hora)

            if agora > data_hora:
                return jsonify({'erro': 'Não é possível agendar para datas/horários passados!'}), 400

            minutos = int(dados_agendamento['tempo_corte'].split(' ')[0])
            horas = minutos // 60
            minutos_restantes = minutos % 60
            tempo_formatado = f'{horas:02d}:{minutos_restantes:02d}:00'

            horario_barbeiro = 'SELECT * FROM agendamentos WHERE barbeiro = %s AND %s < DATE_ADD(data_hora, INTERVAL tempo_corte HOUR_SECOND) AND %s >= data_hora'
            resultado = db.obter_dados(
                horario_barbeiro, (dados_agendamento['barbeiro'], data_hora, data_hora,))
            if resultado:
                return jsonify({'erro': 'Horário ocupado'}), 401
            else:
                sql_agendar = """
                INSERT INTO agendamentos(usuario_id, nome_cliente, whatsapp, corte_nome, corte_descricao, tempo_corte, corte_preco, barbeiro, data_hora, observacao)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """
                valores = (
                    usuario_id,
                    dados_agendamento['nome_cliente'],
                    dados_agendamento['whatsapp'],
                    dados_agendamento['corte_nome'],
                    dados_agendamento['corte_descricao'],
                    tempo_formatado,
                    dados_agendamento['corte_preco'],
                    dados_agendamento['barbeiro'],
                    data_hora,
                    dados_agendamento.get('observacao', None)
                )
                agendar = db.executar_query(sql_agendar, valores)
                if agendar:
                    return jsonify({'mensagem': 'Agendamento realizado com sucesso!', 'id': agendar}), 200
                else:
                    return jsonify({'erro': 'Agendamento não finalizado!'}), 400

        except Exception as erro:
            return jsonify({'erro': str(erro)}), 500
    else:
        return render_template('agendamentos.html')


@main_routes.route('/consulta-horarios', methods=['GET'])
def consultar_horarios():
    try:
        barbeiro = request.args.get('barbeiro')
        data_str = request.args.get('data')
        duracao = request.args.get('duracao')
        # Converte string para datetime
        data = datetime.strptime(data_str, '%Y-%m-%d')

        livres = horarios_livres(barbeiro, data, duracao)
        if not livres:
            return jsonify({'erro': 'Barbearia fechada neste dia!'})
        else:
            return jsonify({'horarios': livres}), 200

    except Exception as erro:
        return jsonify({'erro': str(erro)})


@main_routes.route('/footer')
def pagina_footer():
    return render_template('footer.html')
