from django.shortcuts import render
from users.models import Request
from authentication.models import CustomUser
from users.serializer import RequestsSerializer
from users.serializer import ReviewsSerializer
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

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def reviewCreate(request, _id):
    try: 
        reviewee_obj = CustomUser.objects.get(id = _id) 
    except CustomUser.DoesNotExist:
        return Response({"detail": "Пользователь с таким id не существует."}, status=status.HTTP_400_BAD_REQUEST)
    if request.user.id == reviewee_obj.id:
        return Response({"detail": "Пользователь с таким id не доступен так как он не может оставлять отзыв сам себе."}, status=status.HTTP_400_BAD_REQUEST)
    review_info = request.data
    review_info['reviewer'] = request.user.id
    review_info['reviewee'] = reviewee_obj.id
    review_serializer = ReviewsSerializer(data=review_info)
    if review_serializer.is_valid():
        review_serializer.save()

        _rating_sum = reviewee_obj.rating_sum + int(review_info['rating'])
        _rating_count = reviewee_obj.rating_count + 1

        reviewee_serializer = CustomUserSerializer(reviewee_obj, data = { 'rating_sum':_rating_sum, 'rating_count':_rating_count}, partial=True)
        reviewee_serializer.is_valid()
        reviewee_serializer.save()
        return Response(review_serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(review_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
