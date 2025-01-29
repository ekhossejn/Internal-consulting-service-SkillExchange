from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Document(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField(null=True, blank=True)
    pass

class Company(models.Model):
    pass

class Request(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=20, null=False, blank=False)
    requiredSkills = models.ManyToManyField('Skill', related_name='requests', blank=True)
    text = models.CharField(max_length=500, null=False, blank=False)
    createdAt = models.TimeField(auto_now_add=True)
    isActive = models.BooleanField(default=True)
    respondedUsers = models.ManyToManyField(User, related_name='requests', blank=True)

    def __str__(self):
        return self.name

class Skill(models.Model):
    pass

class Review(models.Model):
    pass