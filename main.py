import os
from app import create_app  # Importa o gerente
from app.models import db

app = create_app() # O gerente prepara o prédio

try:
    db.conectar()
    print("✅ Sucesso: O motor da Ferrari ligou!")
except Exception as e:
    print(f"❌ Erro: A fiação deu curto-circuito: {e}")



if __name__ == '__main__':
    # Liga o interruptor na porta que o Railway mandar
    app.run(debug=True, port=os.getenv("PORT", default=5000))



