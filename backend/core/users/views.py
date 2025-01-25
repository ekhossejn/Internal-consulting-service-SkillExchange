from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .users import users

@api_view(['GET'])
def printName(request):
    return Response("hello kate")

@api_view(['GET'])
def getUsers(request):
    return Response(users)