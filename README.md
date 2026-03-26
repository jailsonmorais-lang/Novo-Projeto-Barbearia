# 💈 BarberBook

> Sistema completo de agendamento online para barbearias — desenvolvido com Python, Flask e MySQL.

[![Deploy on Railway](https://img.shields.io/badge/Deploy-Railway-6B3FA0?style=for-the-badge&logo=railway)](https://novo-projeto-barbearia-development.up.railway.app/)
[![Python](https://img.shields.io/badge/Python-3.x-3776AB?style=for-the-badge&logo=python)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.1-000000?style=for-the-badge&logo=flask)](https://flask.palletsprojects.com)
[![MySQL](https://img.shields.io/badge/MySQL-9.6-4479A1?style=for-the-badge&logo=mysql)](https://mysql.com)

---

## 🌐 Demo ao Vivo

🔗 **[https://novo-projeto-barbearia-development.up.railway.app/](https://novo-projeto-barbearia-development.up.railway.app/)**

---

## 📋 Sobre o Projeto

O **BarberBook** é um sistema web completo que resolve um problema real de barbearias: a desorganização nos agendamentos. Com ele, clientes conseguem marcar horários online de forma simples, e os barbeiros têm controle total da agenda — sem conflitos de horário, sem ligações desnecessárias.

O sistema foi desenvolvido do zero, com foco em regras de negócio reais e experiência do usuário.

---

## ✨ Funcionalidades

### 👤 Autenticação
- Cadastro com validação completa (nome, e-mail, senha, WhatsApp)
- Login seguro com senha criptografada via **bcrypt**
- Recuperação de senha com **código de verificação por e-mail** (expiração de 10 minutos)

### 📅 Agendamento Inteligente
- Catálogo de serviços com imagem, preço, descrição e tempo de duração
- Escolha de barbeiro e data/horário
- **Algoritmo de conflito de horários**: horários ocupados são bloqueados automaticamente com base na duração do serviço
- Validação inteligente de sobreposição parcial — ex: um corte de 45 min às 08h00 bloqueia também horários que colidiriam com um agendamento às 08h30

### 🔒 Regras de Negócio
- Cancelamento de agendamento com validação de **antecedência mínima de 2 horas**
- Confirmação do agendamento com card detalhado (serviço, barbeiro, data, horário e preço)

### 📊 Dashboard do Barbeiro *(em desenvolvimento)*
- Visualização de agendamentos do dia, semana e mês
- Faturamento por período
- Ranking de barbeiros por número de atendimentos

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia |
|--------|-----------|
| Back-end | Python 3, Flask 3.1 |
| Banco de Dados | MySQL (mysql-connector-python) |
| Autenticação | bcrypt, Flask Sessions |
| E-mail | Resend API |
| Deploy | Railway + Gunicorn |
| Variáveis de Ambiente | python-dotenv |

---

## 🏗️ Arquitetura

O projeto utiliza o padrão **Application Factory** do Flask, garantindo organização, escalabilidade e facilidade de manutenção.

```
BarberBook/
├── main.py               # Ponto de entrada da aplicação
├── app/
│   ├── __init__.py       # create_app() — Application Factory
│   ├── models/           # Modelos e conexão com banco de dados
│   ├── routes/           # Rotas e controllers
│   └── templates/        # Templates HTML (Jinja2)
├── requirements.txt
├── Procfile
└── railway.json
```

---

## ⚙️ Como Rodar Localmente

### Pré-requisitos
- Python 3.x
- MySQL rodando localmente
- Conta no [Resend](https://resend.com) para envio de e-mails

### Instalação

```bash
# Clone o repositório
git clone https://github.com/jailsonmorais-lang/Novo-Projeto-Barbearia.git
cd Novo-Projeto-Barbearia

# Instale as dependências
pip install -r requirements.txt

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais

# Rode o servidor
python main.py
```

Acesse em: `http://localhost:5000`

---

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
DB_HOST=seu_host
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_DATABASE=nome_do_banco
DB_PORT=3306

RESEND_API_KEY=sua_chave_resend
EMAIL_REMETENTE=seu@email.com

SECRET_KEY=sua_chave_secreta
```

> ⚠️ **Nunca commite o arquivo `.env` com dados reais.** Ele já está no `.gitignore`.

---

## 🚀 Deploy

O projeto está configurado para deploy automático no **Railway**:

```json
{
  "build": { "builder": "NIXPACKS" },
  "deploy": { "startCommand": "gunicorn main:app" }
}
```

---

## 👨‍💻 Autor

**Jailson Morais**
Desenvolvedor Full Stack em formação | Entorno de Brasília, DF

[![GitHub](https://img.shields.io/badge/GitHub-jailsonmorais--lang-181717?style=flat&logo=github)](https://github.com/jailsonmorais-lang)

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
