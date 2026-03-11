from flask import Flask

def create_app():
    # Aqui o Flask entende que deev olhar para dentro da pasta 'app'
    app = Flask(__name__,
                template_folder='templates',
                static_folder='static'
                )
    
    # Importa as rotas (Isso evita erros de importação circular)
    from .routes import main_routes
    app.register_blueprint(main_routes)



    return app