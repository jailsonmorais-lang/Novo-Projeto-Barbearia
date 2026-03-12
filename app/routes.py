from flask import Blueprint, render_template

#criamos um "Mapa de Rotas" (Bluerprint)
main_routes = Blueprint('main', __name__)

@main_routes.route('/')
def pagina_inicial():
    # Agora ele vai buscar o index.html dentro da pasta templetas automaticamente
    return render_template('index.html')

@main_routes.route('/login')
def pagina_login():
    return render_template('login.html')


@main_routes.route('/cadastro')
def pagina_cadastro():
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