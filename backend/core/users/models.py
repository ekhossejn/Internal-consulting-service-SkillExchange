from django.db import models
from authorization.models import CustomUser

class Document(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField(null=True, blank=True)
    pass

class Company(models.Model):
    domain = models.CharField(null=False, blank=False)
    name = models.CharField(max_length=20, null=False, blank=False)
    description = models.CharField(max_length=200, null=False, blank=True)

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
    name = models.CharField(max_length=100, null=False, blank=False)

class Review(models.Model):
    reviewer = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    reviewee = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    text =  models.CharField(max_length=500, null=False, blank=False)
    rating = models.IntegerField(null=False, default=0)