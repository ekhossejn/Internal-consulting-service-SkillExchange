from rest_framework import serializers
from .models import Request, Document, Review

class RequestsSerializer(serializers.ModelSerializer):
    class Meta:
        model=Request
        fields='__all__'
        read_only_fields = ['author']

class DocumentsSerializer(serializers.ModelSerializer):
    class Meta:
        model=Document
        fields='__all__'

class ReviewsSerializer(serializers.ModelSerializer):
    class Meta:
        model=Review
        fields='__all__'