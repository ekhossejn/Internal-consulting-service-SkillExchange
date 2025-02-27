from rest_framework import serializers
from .models import Request, Document, Review, Skill

class SkillsSerializer(serializers.ModelSerializer):
    class Meta:
        model=Skill
        fields=['name']

class RequestsSerializer(serializers.ModelSerializer):
    requiredSkills = SkillsSerializer(many=True)
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
