from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Request, Document
from rest_framework_simplejwt.tokens import RefreshToken

class RequestsSerializer(serializers.ModelSerializer):
    class Meta:
        model=Request
        fields='__all__'

class DocumentsSerializer(serializers.ModelSerializer):
    class Meta:
        model=Document
        fields='__all__'

class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    _id = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model=User
        fields=['id', '_id', 'username', 'email', 'name', 'isAdmin']

    def get_name(self, obj):
        first_name = obj.first_name
        last_name = obj.last_name
        name = first_name + ' ' + last_name
        if name == ' ':
            name = 'Set your name'
        return name
    
    def get__id(self, obj):
        return obj.id
    
    def get_isAdmin(self, obj):
        return obj.is_staff


class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model=User
        fields=['id', '_id', 'username', 'email', 'name', 'isAdmin', 'token']
    
    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)
    