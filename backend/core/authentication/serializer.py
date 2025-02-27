from rest_framework import serializers
from .models import CustomUser
from users.models import Skill
from django.utils.translation import gettext_lazy as _

class CustomUserSerializer(serializers.ModelSerializer):
    skills = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Skill.objects.all(),
        required=False
    )

    class Meta:
        model=CustomUser
        fields=['id', 'email', 'company', 'image', 'name', 'rating_sum', 'rating_count', 'skills', 'is_active', 'is_staff']
    
    def validate_email(self, value):
        domain = value.split('@')[1]
        bad_domains = {'rambler.ru', 'yandex.ru'}
        if domain in bad_domains:
            raise serializers.ValidationError(
                _("%(value)s is not a corporative email") % {'value': value}
            )

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        return token

    def validate(self, attrs):
        try:
            email = CustomUser.objects.get(email=attrs['email']).email
        except CustomUser.DoesNotExist:
            email = None

        if email:
            attrs['email'] = email

        return super().validate(attrs)