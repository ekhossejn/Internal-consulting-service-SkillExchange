from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes

from .models import Request, Document
from .serializer import RequestsSerializer, DocumentsSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from authentication.serializer import CustomUserSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getRequests(request):
    requests = Request.objects.all()
    serializer = RequestsSerializer(requests, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getRequest(request, _id):
    curRequest = Request.objects.get(id=_id)
    serializer = RequestsSerializer(curRequest, many=False)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getDocuments(request):
    documents = Document.objects.all()
    serializer = DocumentsSerializer(documents, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getProfile(request):
    user = request.user
    serializer = CustomUserSerializer(user, many=False)
    return Response(serializer.data)
