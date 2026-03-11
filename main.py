import os
from app import create_app  # Importa o gerente

app = create_app() # O gerente prepara o prédio

if __name__ == '__main__':
    # Liga o interruptor na porta que o Railway mandar
    app.run(debug=True, port=os.getenv("PORT", default=5000))





