from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .models import Request, Document
from .serializer import RequestsSerializer, DocumentsSerializer

@api_view(['GET'])
def printName(request):
    return Response("hello kate")

@api_view(['GET'])
def getRequests(request):
    requests = Request.objects.all()
    serializer = RequestsSerializer(requests, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getRequest(request, _id):
    curRequest = Request.objects.get(id=_id)
    serializer = RequestsSerializer(curRequest, many=False)
    return Response(serializer.data)

@api_view(['GET'])
def getDocuments(request):
    documents = Document.objects.all()
    serializer = DocumentsSerializer(documents, many=True)
    return Response(serializer.data)