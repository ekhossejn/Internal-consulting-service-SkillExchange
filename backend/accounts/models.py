from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class AccountManage(BaseUserManager):
    def create_user(self, email):
        if not email:
            raise ValueError('Email is required')
        email = self.normalize_email(email)
        user = self.model(email=email)
        return user

class Account(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)

    objects = AccountManage()

    USERNAME_FIELD = 'email'

    def __str__(self):
        return self.email
