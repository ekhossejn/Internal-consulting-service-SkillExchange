from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Request

class RequestsSerializer(serializers.ModelSerializer):
    class Meta:
        model=Request
        fields='__all__'