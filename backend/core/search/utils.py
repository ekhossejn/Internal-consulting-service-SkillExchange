from django.template.loader import render_to_string
from django.conf import settings
from django.core.mail import EmailMessage

def send_email(send_from, request_obj):
    author = request_obj.author
    email_subject = "You have 1 new respond: User " + send_from.name + " wants to help you!"
    message = render_to_string(
        'respond.html',
        {
            'user': send_from,
            'author': author,
            'domain': '185.207.1.140',
            'id': request_obj.id,
            'email': send_from.email
        }
    )
    email_message = EmailMessage(email_subject, message, settings.EMAIL_HOST_USER, [author.email])
    email_message.send()