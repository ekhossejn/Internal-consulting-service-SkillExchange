from rest_framework import serializers
from .models import Request, Document, Review, Skill, Company
from authentication.models import CustomUser

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model=Company
        fields='__all__'

class SkillsSerializer(serializers.ModelSerializer):
    class Meta:
        model=Skill
        fields='__all__'

class CustomUserSerializer(serializers.ModelSerializer):
    skills = SkillsSerializer(many=True)
    documents = serializers.SerializerMethodField()
    reviews = serializers.SerializerMethodField()
    rating = serializers.SerializerMethodField()

    class Meta:
        model=CustomUser
        fields=['id', 'image', 'name', 'rating', 'email', 'skills', 'documents', 'reviews']
    
    def get_documents(self, obj):
        documents = obj.document_set.all()
        return DocumentsSerializer(documents, many=True).data
    
    def get_reviews(self, obj):
        reviews = obj.gotten_reviews.all()
        return ReviewsSerializer(reviews, many=True).data
    
    def get_rating(self, obj):
        return round(obj.rating, 2)

class CustomUserShortInfoSerializer(serializers.ModelSerializer):
    rating = serializers.SerializerMethodField()

    class Meta:
        model=CustomUser
        fields=['id', 'image', 'name', 'rating', 'email']
    
    def get_rating(self, obj):
        return round(obj.rating, 2)
    
class UpdateRatingCustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model=CustomUser
        fields=['id', 'rating', 'rating_sum', 'rating_count']

class UpdateCustomUserSerializer(serializers.ModelSerializer):
    skills = serializers.PrimaryKeyRelatedField(queryset=Skill.objects.all(), many=True)
    class Meta:
        model=CustomUser
        fields=['name', 'image', 'skills',]
    
class RequestsSerializer(serializers.ModelSerializer):
    authorImage = serializers.ImageField(source='author.image')
    emails = serializers.SerializerMethodField()
    requiredSkills = SkillsSerializer(many=True, required=False)

    class Meta:
        model=Request
        fields=['id', 'authorImage', 'isActive', 'emails', 'name', 'createdAt', 'requiredSkills', 'text']

    def get_emails(self, obj):
        return obj.respondedUsers.values_list('email', flat=True)

class RequestsShortInfoSerializer(serializers.ModelSerializer):
    authorImage = serializers.ImageField(source='author.image')
    authorRating = serializers.SerializerMethodField()
    class Meta:
        model=Request
        fields=['id', 'authorImage', 'authorRating', 'name', 'text', 'createdAt', 'isActive']

    def get_authorRating(self, obj):
        return round(obj.author.rating, 2)

class DocumentsSerializer(serializers.ModelSerializer):
    class Meta:
        model=Document
        fields='__all__'

class ReviewsSerializer(serializers.ModelSerializer):
    reviewer_name = serializers.CharField(source='reviewer.name', read_only=True)
    class Meta:
        model=Review
        fields=['rating', 'createdAt', 'reviewer_name', 'reviewer', 'reviewee', 'text']
