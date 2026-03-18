import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os


def enviar_email(destinatario, codigo):
    try:
        import ssl
        contexto = ssl.create_default_context()

        with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=contexto) as servidor:
            servidor.login(os.getenv('EMAIL_REMETENTE'),
                           os.getenv('EMAIL_SENHA'))

            mensagem = MIMEMultipart()
            mensagem['From'] = os.getenv('EMAIL_REMETENTE')
            mensagem['TO'] = destinatario
            mensagem['Subject'] = 'Recuperação de senha aplicatico Barbershop'

            corpo = f'''Olá!

            Recebemos uma solicitação de recuperação de senha para sua conta na Barbearia Morais.

            Seu código de verificação é:

            🔐 {codigo}

            Este código é válido por 10 minutos. Após esse prazo, será necessário solicitar um novo código.

            Se você não solicitou a recuperação de senha, ignore este email. Sua conta permanece segura.

            Atenciosamente,
            Equipe Barbearia Morais'''

            mensagem.attach(MIMEText(corpo, 'plain'))

            servidor.sendmail(os.getenv('EMAIL_REMETENTE'),
                              destinatario, mensagem.as_string())
            return True

    except Exception as erro:
        print(f'Erro ao enviar email: {erro}')
        return False
