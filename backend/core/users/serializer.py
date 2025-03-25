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
    rating =  serializers.SerializerMethodField()

    class Meta:
        model=CustomUser
        fields=['id', 'image', 'name', 'rating', 'email', 'skills', 'documents', 'reviews']
    
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

    def get_rating(self, obj):
        if obj.rating_count == 0:
            return 0
        return obj.rating_sum // obj.rating_count

class UpdateCustomUserSerializer(serializers.ModelSerializer):
    skills = serializers.PrimaryKeyRelatedField(queryset=Skill.objects.all(), many=True)
    documents = serializers.SerializerMethodField()

    class Meta:
        model=CustomUser
        fields=['image', 'name', 'skills', 'documents']
    
    def update(self, instance, validated_data):
        validated_data.pop('email', None)
        validated_data.pop('rating', None)
        validated_data.pop('reviews', None)

        super().update(instance, validated_data)
        return instance
    
    def get_documents(self, obj):
        documents = Document.objects.filter(owner=obj)
        return DocumentsSerializer(documents, many=True).data
    
class RequestsSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    emails = serializers.SerializerMethodField()
    requiredSkills = SkillsSerializer(many=True, required=False)

    class Meta:
        model=Request
        fields=['id', 'image', 'isActive', 'emails', 'name', 'createdAt', 'requiredSkills', 'text']

    def get_image(self, obj):
        user = CustomUser.objects.get(id = obj.author.id)
        return CustomUserSerializer(user, many=False).data['image']

    def get_emails(self, obj):
        responded_users = obj.respondedUsers
        emails = []
        for user in responded_users.all():
            try: 
                gotten_user = CustomUser.objects.get(id = user.id)
                emails.append(gotten_user.email)
            except Request.DoesNotExist: 
                continue
        return emails

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
