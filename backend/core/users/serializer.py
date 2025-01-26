from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Request, Document

class RequestsSerializer(serializers.ModelSerializer):
    class Meta:
        model=Request
        fields='__all__'

class DocumentsSerializer(serializers.ModelSerializer):
    class Meta:
        model=Document
        fields='__all__'