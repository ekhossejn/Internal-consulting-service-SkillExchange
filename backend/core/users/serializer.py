from rest_framework import serializers
from .models import Request, Document, Review, Skill
from authentication.models import CustomUser

class SkillsSerializer(serializers.ModelSerializer):
    class Meta:
        model=Skill
        fields=['name']

class RequestsSerializer(serializers.ModelSerializer):
    requiredSkills = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Skill.objects.all(),
        required=False
    )


    class Meta:
        model=Request
        fields='__all__'
        read_only_fields = ['author']

class CustomUserSerializer(serializers.ModelSerializer):
    skills = SkillsSerializer(many=True)
    documents = serializers.SerializerMethodField()
    reviews = serializers.SerializerMethodField()

    class Meta:
        model=CustomUser
        fields=['id', 'email', 'company', 'image', 'name', 'rating_sum', 'rating_count', 'documents', 'skills', 'reviews', 'is_active', 'is_staff']
    
    def validate_email(self, value):
        domain = value.split('@')[1]
        bad_domains = {'rambler.ru', 'yandex.ru'}
        if domain in bad_domains:
            raise serializers.ValidationError(
                _("%(value)s is not a corporative email") % {'value': value}
            )
    
    def get_documents(self, obj):
        documents = Document.objects.filter(owner=obj)
        return DocumentsSerializer(documents, many=True).data
    
    def get_reviews(self, obj):
        reviews = Review.objects.filter(reviewee=obj)
        return ReviewsSerializer(reviews, many=True).data

class RequestsShortInfoSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    class Meta:
        model=Request
        fields=['id', 'image', 'name', 'text', 'isActive']
    
    def get_image(self, obj):
        user = CustomUser.objects.get(id = obj.author.id)
        return CustomUserSerializer(user, many=False).data['image']

class DocumentsSerializer(serializers.ModelSerializer):
    class Meta:
        model=Document
        fields='__all__'

class ReviewsSerializer(serializers.ModelSerializer):
    class Meta:
        model=Review
        fields='__all__'
