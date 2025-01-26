from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .models import Request
from .serializer import RequestsSerializer

@api_view(['GET'])
def printName(request):
    return Response("hello kate")

@api_view(['GET'])
def getRequests(request):
    requests = Request.objects.all()
    serializer = RequestsSerializer(requests, many=True)
    return Response(serializer.data)