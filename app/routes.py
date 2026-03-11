from flask import Blueprint, render_template

#criamos um "Mapa de Rotas" (Bluerprint)
main_routes = Blueprint('main', __name__)

@main_routes.route('/')
def index():
    # Agora ele vai buscar o index.html dentro da pasta templetas automaticamente
    return render_template('index.html')