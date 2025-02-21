from django.db import models
from authentication.models import CustomUser
# Create your models here.

class Document(models.Model):
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    image = models.ImageField(null=True, blank=True)
    def __str__(self):
        return (str)(self.owner)

class Company(models.Model):
    domain = models.CharField(max_length=255)
    name = models.CharField(max_length=20)
    description = models.CharField(max_length=200)
    def __str__(self):
        return self.name

class Request(models.Model):
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    name = models.CharField(max_length=20)
    requiredSkills = models.ManyToManyField('Skill', related_name='requests', blank=True)
    text = models.CharField(max_length=500)
    createdAt = models.TimeField(auto_now_add=True)
    isActive = models.BooleanField(default=True)
    respondedUsers = models.ManyToManyField(CustomUser, related_name='requests', blank=True)
    def __str__(self):
        return self.name

class Skill(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.name

class Review(models.Model):
    reviewer = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='reviews_as_reviewer')
    reviewee = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='reviews_as_reviewee')
    text =  models.CharField(max_length=500)
    rating = models.IntegerField()
    def __str__(self):
        return self.text