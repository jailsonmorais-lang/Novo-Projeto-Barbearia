from flask import Blueprint, render_template, request, jsonify, session
from app.models import db
import bcrypt
import random
from datetime import datetime, timedelta
from app.email_service import enviar_email


# criamos um "Mapa de Rotas" (Bluerprint)
main_routes = Blueprint('main', __name__)


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
                return jsonify({'mensagem': 'Login realizado com sucesso!'}), 200

        except Exception as erro:
            return jsonify({'erro': str(erro)}), 500
    else:
        return render_template('login.html')


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


@main_routes.route('/footer')
def pagina_footer():
    return render_template('footer.html')


@main_routes.route('/agendamentos')
def pagina_agendamentos():
    return render_template('agendamentos.html')
