from django.shortcuts import render
from users.models import User, Request
from users.serializer import UserSerializer, RequestsSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUsers(request):
    user = User.objects.all()
    serializer = UserSerializer(user, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getRequests(request):
    requests = Request.objects.all()
    serializer = RequestsSerializer(requests, many=True)
    return Response(serializer.data)