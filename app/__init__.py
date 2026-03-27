from flask import Flask
from werkzeug.middleware.proxy_fix import ProxyFix
import os


def create_app():
    if os.getenv('FLASK_ENV') != 'production':
        os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
        os.environ['OAUTHLIB_RELAX_TOKEN_SCOPE'] = '1'
    
    # Aqui o Flask entende que deve olhar para dentro da pasta 'app'
    app = Flask(__name__,
                instance_relative_config=True,
                template_folder='templates',
                static_folder='static',
                )
    app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)
    app.secret_key = os.getenv('SECRET_KEY')
    
    # Importa as rotas (Isso evita erros de importação circular)
    from .routes import main_routes
    app.register_blueprint(main_routes)

    from app.routes import google_blueprint
    app.register_blueprint(google_blueprint, url_prefix='/login')


    from app.models import db

    db.conectar()


    return app