from flask import Blueprint, render_template, request, jsonify
from app.models import db
import bcrypt

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
            email_nao_cadastrado = db.obter_dados(verifica_email, (dados_login['email'],))

            if not email_nao_cadastrado:
                return jsonify({'erro': 'Email não cadastrado!'})
            
            senha_bytes = dados_login['senha'].encode('utf-8')
            senha_hash_banco = email_nao_cadastrado[0]['senha']
            senha_correta = bcrypt.checkpw(senha_bytes, senha_hash_banco.encode('utf-8'))
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
            email_ja_existe = db.obter_dados(sql_verifica_email, (dados_para_cadastro['email'],))

            sql_verificar_whatsapp = 'SELECT * FROM usuarios WHERE whatsapp = %s'
            whatsapp_ja_existe = db.obter_dados(sql_verificar_whatsapp, (dados_para_cadastro['whatsapp'],))

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


@main_routes.route('/criar-senha')
def pagina_criar_senha():
    return render_template('criar-senha.html')


@main_routes.route('/dashboard')
def pagina_dashboard():
    return render_template('dashboard.html')


@main_routes.route('/recuperacao-de-senha')
def pagina_recuperar_senha():
    return render_template('recuperacao-de-senha.html')


@main_routes.route('/footer')
def pagina_footer():
    return render_template('footer.html')


@main_routes.route('/agendamentos')
def pagina_agendamentos():
    return render_template('agendamentos.html')
