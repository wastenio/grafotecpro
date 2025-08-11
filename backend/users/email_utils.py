from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
import logging

logger = logging.getLogger(__name__)

def send_email(subject, to_email, template_name, context):
    """
    Envia um email com conteúdo HTML e texto simples como fallback.
    Usa templates do Django para renderização.
    """

    text_content = render_to_string(f'{template_name}.txt', context)
    html_content = render_to_string(f'{template_name}.html', context)

    email = EmailMultiAlternatives(subject, text_content, None, [to_email])
    email.attach_alternative(html_content, "text/html")
    try:
        email.send()
        logger.info(f"E-mail enviado para {to_email} com o assunto '{subject}'")
    except Exception as e:
        logger.error(f"Erro ao enviar email para {to_email}: {e}")
