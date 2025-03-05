from rest_framework.response import Response

from rest_framework.decorators import api_view
from django.shortcuts import render

from django.contrib.auth.hashers import make_password

from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from .utils import generate_token
from django.utils.encoding import force_bytes, force_text
from django.core.mail import EmailMessage
from django.conf import settings
from django.views.generic import View

from .serializer import CustomUserBaseInfoSerializer, CustomTokenObtainPairSerializer
from .models import CustomUser

from users.models import Company

from rest_framework import status

def validate_password(password):
    if len(password) < 8:
        return "Password must be at least 8 characters long."
    if not any(char.isdigit() for char in password):
        return "Password must contain at least one digit."
    if not any(char.isalpha() for char in password):
        return "Password must contain at least one letter."
    return None

@api_view(['POST'])
def register(request):
    if 'password' not in request.data:
        return Response({'details': 'password is required'}, status=status.HTTP_400_BAD_REQUEST)
    validate_password_error = validate_password(request.data['password'])
    if validate_password_error:
        return Response({'details': validate_password_error}, status=status.HTTP_400_BAD_REQUEST)
    
    request.data['password'] = make_password(request.data['password'])
    try:
        serializer = CustomUserBaseInfoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email_domain = request.data['email'].split('@')[1]
        try:
            company = Company.objects.get(domain=email_domain)
        except Company.DoesNotExist:
            message = {'details': 'User\'s email is not associated with any registered company'}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)   
        user = serializer.save(company=company)
        
        email_subject = "Verify your email"
        message = render_to_string(
            'verification.html',
            {
                'user': user,
                'domain': '127.0.0.1:8000',
                'uid': urlsafe_base64_encode(force_bytes(user.id)),
                'token': generate_token.make_token(user)
            }
        )
        email_message = EmailMessage(email_subject, message, settings.EMAIL_HOST_USER, [request.data['email']])
        email_message.send()

        serialize = CustomUserBaseInfoSerializer(user, many=False)
        return Response(serialize.data)
    except Exception as e:
        message = {'details': e.args[0]}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

class verifyAccountView(View):
    def get(self, request, uidb64, token):
        try:
            uid = force_text(urlsafe_base64_decode(uidb64))
            user = CustomUser.objects.get(id = uid)
        except Exception:
            user = None
        if user and generate_token.check_token(user, token):
            user.is_active = True
            user.save()
            return render(request, "verification_ok.html")
        return render(request, "verification_fail.html")

from rest_framework_simplejwt.views import TokenObtainPairView
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer