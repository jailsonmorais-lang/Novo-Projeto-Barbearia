""" import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart """
import resend
import os


def enviar_email(destinatario, codigo):
    try:
        resend.api_key = os.getenv('RESEND_API_KEY')

        resend.Emails.send({
            'from': 'onboarding@resend.dev',
            'to': destinatario,
            'subject': 'Recuperação de senha aplicatico Barbershop',
            'text': f'''Olá!

            Recebemos uma solicitação de recuperação de senha para sua conta na Barbearia Morais.

            Seu código de verificação é:

            🔐 {codigo}

            Este código é válido por 10 minutos. Após esse prazo, será necessário solicitar um novo código.

            Se você não solicitou a recuperação de senha, ignore este email. Sua conta permanece segura.

            Atenciosamente,
            Equipe Barbearia Morais'''

        })
        return True

    except Exception as erro:
        print(f'Erro ao enviar email: {erro}')
        return False
