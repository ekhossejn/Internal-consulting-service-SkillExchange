from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes

from .models import Request, Document
from .serializer import RequestsSerializer, DocumentsSerializer, UserSerializer, UserSerializerWithToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status

from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_decode,urlsafe_base64_encode
from .utils import TokenGenerator, generate_token
from django.utils.encoding import force_bytes,force_text,DjangoUnicodeDecodeError
from django.core.mail import EmailMessage
from django.conf import settings
from django.views.generic import View

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getRequests(request):
    requests = Request.objects.all()
    serializer = RequestsSerializer(requests, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getRequest(request, _id):
    curRequest = Request.objects.get(id=_id)
    serializer = RequestsSerializer(curRequest, many=False)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createRequest(request):
    data = request.data
    serializer = RequestsSerializer(data=data)
    if serializer.is_valid():
        serializer.save(author = request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getDocuments(request):
    documents = Document.objects.all()
    serializer = DocumentsSerializer(documents, many=True)
    return Response(serializer.data)

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        serializer = UserSerializerWithToken(self.user).data
        for key, value in serializer.items():
            data[key] = value
        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

@api_view(['POST'])
def register(request):
    data = request.data 
    try:
        user = User.objects.create(first_name=data['fname'], last_name=data['lname'], 
                                   username=data['email'], email=data['email'],
                                   password=make_password(data['password']), is_active = False)
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
        email_message = EmailMessage(email_subject, message, settings.EMAIL_HOST_USER, [data['email']])
        email_message.send()

        serialize = UserSerializerWithToken(user, many=False)
        return Response(serialize.data)
    except Exception as e:
        print(e)
        message = {'details': "User already exists."}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

class verifyAccountView(View):
    def get(self, request, uidb64, token):
        try:
            uid = force_text(urlsafe_base64_decode(uidb64))
            user = User.objects.get(id = uid)
        except Exception as e:
            user = None
        if user and generate_token.check_token(user, token):
            user.is_active = True
            user.save()
            return render(request, "verification_ok.html")
        return render(request, "verification_fail.html")