from django.shortcuts import render
from users.models import Request
from authentication.models import CustomUser
from users.serializer import RequestsSerializer
from authentication.serializer import CustomUserSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def usersGet(request):
    user = CustomUser.objects.all().exclude(id = request.user.id)
    serializer = CustomUserSerializer(user, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def userGet(request, _id):
    try: 
        user = CustomUser.objects.get(id = _id) 
    except CustomUser.DoesNotExist:
        return Response({"detail": "Пользователь с таким id не существует."}, status=status.HTTP_404_NOT_FOUND)
    if request.user.id == user.id:
        return Response({"detail": "Пользователь с таким id не доступен так как он не может просматривать сам себя."}, status=status.HTTP_404_NOT_FOUND)
    serializer = CustomUserSerializer(user, many=False)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def requestsGet(request):
    requests = Request.objects.exclude(author = request.user)
    serializer = RequestsSerializer(requests, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def requestGet(request, _id):
    try:
        gotten_request = Request.objects.get(id = _id)
    except Request.DoesNotExist:
        return Response({"detail": "Запрос с таким id не существует."}, status=status.HTTP_404_NOT_FOUND)
    if request.user.id == gotten_request.author.id:
        return Response({"detail": "Запрос с таким id не доступен так как его просматривает владелец."}, status=status.HTTP_404_NOT_FOUND)
    serializer = RequestsSerializer(gotten_request, many=False)
    return Response(serializer.data)
