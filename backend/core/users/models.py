from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator


import os
from uuid import uuid4

def path_and_rename(instance, filename):
    upload_to = 'documents'
    ext = filename.split('.')[-1]
    if instance.pk:
        filename = '{}.{}'.format(instance.pk, ext)
    else:
        filename = '{}.{}'.format(uuid4().hex, ext)
    return os.path.join(upload_to, filename)

class Document(models.Model):
    owner = models.ForeignKey('authentication.CustomUser', on_delete=models.CASCADE)
    image = models.ImageField(upload_to=path_and_rename)
    def __str__(self):
        return (str)(self.owner)

class Company(models.Model):
    domain = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=5000)
    def __str__(self):
        return self.name

class Request(models.Model):
    author = models.ForeignKey('authentication.CustomUser', on_delete=models.CASCADE)
    name = models.CharField(max_length=20)
    requiredSkills = models.ManyToManyField('Skill', related_name='requests', blank=True)
    text = models.CharField(max_length=500)
    createdAt = models.DateTimeField(auto_now_add=True)
    isActive = models.BooleanField(default=True)
    respondedUsers = models.ManyToManyField('authentication.CustomUser', related_name='responded_requests', blank=True)
    def __str__(self):
        return self.name

class Skill(models.Model):
    name = models.CharField(max_length=100, unique=True)
    def __str__(self):
        return self.name

class Review(models.Model):
    reviewer = models.ForeignKey('authentication.CustomUser', on_delete=models.CASCADE, related_name='created_reviews')
    reviewee = models.ForeignKey('authentication.CustomUser', on_delete=models.CASCADE, related_name='gotten_reviews')
    text =  models.CharField(max_length=500, blank=True)
    rating = models.IntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(5)
        ]
    )
    def __str__(self):
        return self.text
