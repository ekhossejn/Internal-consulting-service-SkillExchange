from django.shortcuts import render
from users.models import Request
from authentication.models import CustomUser
from users.serializer import RequestsSerializer
from authentication.serializer import CustomUserSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUsers(request):
    user = CustomUser.objects.all()
    serializer = CustomUserSerializer(user, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getRequests(request):
    requests = Request.objects.all()
    serializer = RequestsSerializer(requests, many=True)
    return Response(serializer.data)