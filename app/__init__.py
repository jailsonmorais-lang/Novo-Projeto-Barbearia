from flask import Flask
import os

def create_app():
    # Aqui o Flask entende que deve olhar para dentro da pasta 'app'
    app = Flask(__name__,
                instance_relative_config=True,
                template_folder='templates',
                static_folder='static',
                )
    app.secret_key = os.getenv('SECRET_KEY')
    
    # Importa as rotas (Isso evita erros de importação circular)
    from .routes import main_routes

    app.register_blueprint(main_routes)

    from app.models import db

    db.conectar()


    return app