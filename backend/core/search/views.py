from django.shortcuts import render
from users.models import Request, Review, Skill
from users.serializer import RequestsShortInfoSerializer,RequestsSerializer, ReviewsSerializer, SkillsSerializer, UpdateRatingCustomUserSerializer
from authentication.models import CustomUser
from users.serializer import CustomUserSerializer, CustomUserShortInfoSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .utils import send_email
import asyncio

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def users_get(request):
    filter_skills = request.data.get('filter_skills', None)
    filter_rating = request.data.get('filter_rating', None)

    users = CustomUser.objects.exclude(id=request.user.id).filter(company__id=request.user.company.id)

    if filter_skills != None: 
        if isinstance(filter_skills, list):
            users = users.filter(skills__id__in=filter_skills).distinct()
        else:
            return Response({"error": "filter_skills must be a list."}, status=status.HTTP_400_BAD_REQUEST)
        
    if filter_rating != None and filter_rating > 0: 
        try:
            filter_rating = float(filter_rating)
            users = users.filter(rating__gte=filter_rating)
        except:
            return Response({"error": "filter_rating must be a number."}, status=status.HTTP_400_BAD_REQUEST)
    serializer = CustomUserShortInfoSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_get(request, _id):
    try: 
        user_obj = CustomUser.objects.get(id=_id) 
    except CustomUser.DoesNotExist:
        return Response({"detail": "Пользователь с таким id не существует."}, status=status.HTTP_404_NOT_FOUND)
    if request.user.id == user_obj.id:
        return Response({"detail": "Пользователь с таким id не доступен, так как он не может просматривать сам себя."}, status=status.HTTP_403_FORBIDDEN)
    if request.user.company.id != user_obj.company.id:
        return Response({"detail": "Пользователь с таким id не доступен, так как его корпоративная почта принадлежит другой организации."}, status=status.HTTP_403_FORBIDDEN)
    serializer = CustomUserSerializer(user_obj)
    return Response(serializer.data)

@api_view(['POST'])
def requests_get(request):
    filter_skills = request.data.get('filter_skills', None)
    filter_rating = request.data.get('filter_rating', None)

    requests = Request.objects.filter(isActive=True).exclude(author=request.user).select_related('author').filter(author__company__id=request.user.company.id)
    if filter_skills != None: 
        if isinstance(filter_skills, list):
            requests = requests.filter(requiredSkills__id__in=filter_skills).distinct()
        else:
            return Response({"error": "filter_skills must be a list."}, status=status.HTTP_400_BAD_REQUEST)
    if filter_rating != None and filter_rating > 0: 
        try:
            filter_rating = float(filter_rating)
            requests = requests.filter(author__rating__gte=filter_rating)
        except:
            return Response({"error": "filter_rating must be a number."}, status=status.HTTP_400_BAD_REQUEST)
    serializer = RequestsShortInfoSerializer(requests, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def request_get(request, _id):
    try:
        request_obj = Request.objects.get(id=_id)
    except Request.DoesNotExist:
        return Response({"detail": "Запрос с таким id не существует."}, status=status.HTTP_404_NOT_FOUND)
    if request.user.id == request_obj.author.id:
        return Response({"detail": "Запрос с таким id не доступен так как его просматривает владелец."}, status=status.HTTP_403_FORBIDDEN)
    if request.user.company.id != request_obj.author.company.id:
        return Response({"detail": "Запрос с таким id не доступен так как почта его автора принадлежит другой организации."}, status=status.HTTP_403_FORBIDDEN)
    if request_obj.isActive == False:
        return Response({"detail": "Запрос скрыт."}, status=status.HTTP_403_FORBIDDEN)
    serializer = RequestsSerializer(request_obj)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def request_respond(request, _id):
    try:
        request_obj = Request.objects.get(id=_id)
    except Request.DoesNotExist:
        return Response({"detail": "Запрос с таким id не существует."}, status=status.HTTP_404_NOT_FOUND)
    if request.user.id == request_obj.author.id:
        return Response({"detail": "Запрос с таким id не доступен так как его просматривает владелец."}, status=status.HTTP_403_FORBIDDEN)
    if request.user.company.id != request_obj.author.company.id:
        return Response({"detail": "Запрос с таким id не доступен так как почта его автора принадлежит другой организации."}, status=status.HTTP_403_FORBIDDEN)
    if not request_obj.isActive:
        return Response({"detail": "Запрос скрыт."}, status=status.HTTP_403_FORBIDDEN)
    
    if not request_obj.respondedUsers.filter(id=request.user.id).exists():
        request_obj.respondedUsers.add(request.user)
        send_email(request.user, request_obj)
    request_serializer = RequestsSerializer(request_obj)
    return Response(request_serializer.data, status=status.HTTP_200_OK)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def review_create(request, _id):
    try: 
        reviewee_obj = CustomUser.objects.get(id = _id) 
    except CustomUser.DoesNotExist:
        return Response({"detail": "Пользователь с таким id не существует."}, status=status.HTTP_400_BAD_REQUEST)
    if request.user.id == reviewee_obj.id:
        return Response({"detail": "Пользователь с таким id не доступен так как он не может оставлять отзыв сам себе."}, status=status.HTTP_403_FORBIDDEN)
    if request.user.company.id != reviewee_obj.company.id:
        return Response({"detail": "Почта пользователя с таким id принадлежит другой организации."}, status=status.HTTP_403_FORBIDDEN)
    review_info = request.data
    review_info['reviewer'] = request.user.id
    review_info['reviewee'] = reviewee_obj.id
    review_serializer = ReviewsSerializer(data=review_info)
    if review_serializer.is_valid():
        review_serializer.save()

        _rating_sum = reviewee_obj.rating_sum + int(review_info['rating'])
        _rating_count = reviewee_obj.rating_count + 1
        _rating = _rating_sum / _rating_count

        reviewee_serializer = UpdateRatingCustomUserSerializer(reviewee_obj, data = { 'rating': _rating, 'rating_sum':_rating_sum, 'rating_count':_rating_count}, partial=True)
        if reviewee_serializer.is_valid():
            reviewee_serializer.save()
            return Response(review_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(reviewee_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(review_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def skills_get(request):
    skills = Skill.objects.all()
    serializer = SkillsSerializer(skills, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
