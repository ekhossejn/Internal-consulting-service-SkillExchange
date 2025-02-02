from rest_framework import serializers
from .models import Request, Document

class RequestsSerializer(serializers.ModelSerializer):
    class Meta:
        model=Request
        fields='__all__'
        read_only_fields = ['author']

class DocumentsSerializer(serializers.ModelSerializer):
    class Meta:
        model=Document
        fields='__all__'
