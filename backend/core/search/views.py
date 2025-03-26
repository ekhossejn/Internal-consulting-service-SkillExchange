from django.shortcuts import render
from users.models import Request, Review, Skill
from users.serializer import RequestsShortInfoSerializer,RequestsSerializer, ReviewsSerializer, SkillsSerializer, UpdateRatingCustomUserSerializer
from authentication.models import CustomUser
from users.serializer import CustomUserSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import EmailMessage
from django.conf import settings
from django.template.loader import render_to_string
from django.db.models import F, Case, When, Value, FloatField
from django.db.models.functions import Cast

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def usersGet(request):
    filter_skills = request.data.get('filter_skills', None)
    filter_rating = request.data.get('filter_rating', None)

    users = CustomUser.objects.all().exclude(id = request.user.id)

    if filter_skills: 
        if isinstance(filter_skills, list):
            users = users.filter(skills__id__in=filter_skills).distinct()
        else:
            return Response({"error": "filter_skills must be a list."}, status=status.HTTP_400_BAD_REQUEST)
        
    if filter_rating: 
        if isinstance(filter_rating, float):
            users = users.annotate(
                average_rating=Case(
                When(rating_count=0, then=Value(0.0)),
                default=Cast(F('rating_sum'), FloatField()) / F('rating_count'),
                output_field=FloatField())
            ).filter(average_rating__gte=filter_rating).distinct()
        else:
            return Response({"error": "filter_rating must be a float."}, status=status.HTTP_400_BAD_REQUEST)

    serializer = CustomUserSerializer(users, many=True)
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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def requestsGet(request):
    filter_skills = request.data.get('filter_skills', None)
    filter_rating = request.data.get('filter_rating', None)

    requests = Request.objects.filter(isActive = True).exclude(author = request.user)

    if filter_skills: 
        if isinstance(filter_skills, list):
            requests = requests.filter(requiredSkills__id__in=filter_skills).distinct()
        else:
            return Response({"error": "filter_skills must be a list."}, status=status.HTTP_400_BAD_REQUEST)
        
    if filter_rating: 
        if isinstance(filter_rating, float):
            requests = requests.annotate(
                average_rating=Case(
                When(author__rating_count=0, then=Value(0.0)),
                default=Cast(F('author__rating_sum'), FloatField()) / F('author__rating_count'),
                output_field=FloatField())
            ).filter(average_rating__gte=filter_rating).distinct()
        else:
            return Response({"error": "filter_rating must be a float."}, status=status.HTTP_400_BAD_REQUEST)
    
    serializer = RequestsShortInfoSerializer(requests, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def requestGet(request, _id):
    try:
        gotten_request = Request.objects.filter(isActive=True).get(id = _id)
    except Request.DoesNotExist:
        return Response({"detail": "Запрос с таким id не существует."}, status=status.HTTP_404_NOT_FOUND)
    if request.user.id == gotten_request.author.id:
        return Response({"detail": "Запрос с таким id не доступен так как его просматривает владелец."}, status=status.HTTP_404_NOT_FOUND)
    serializer = RequestsSerializer(gotten_request, many=False)
    return Response(serializer.data)


def send_email(responded_user, gotten_request):
    author = gotten_request.author
    email_subject = "SkillExchange 1 new respond: User " + responded_user.name + " wants to help you!"
    message = render_to_string(
        'respond.html',
        {
            'user': responded_user,
            'author': author,
            'domain': 'localhost:3000',
            'id': gotten_request.id,
            'email': responded_user.email
        }
    )
    email_message = EmailMessage(email_subject, message, settings.EMAIL_HOST_USER, [author.email])
    email_message.send()

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def requestRespond(request, _id):
    try:
        gotten_request = Request.objects.filter(isActive=True).get(id = _id)
    except Request.DoesNotExist:
        return Response({"detail": "Запрос с таким id не существует."}, status=status.HTTP_404_NOT_FOUND)
    if request.user.id == gotten_request.author.id:
        return Response({"detail": "Запрос с таким id не доступен так как его просматривает владелец."}, status=status.HTTP_404_NOT_FOUND)
    respondedUsers = gotten_request.respondedUsers
    user = CustomUser.objects.get(id=request.user.id)
    if user not in respondedUsers.all():
        respondedUsers.add(CustomUser.objects.get(id=request.user.id))
        send_email(request.user, gotten_request)
    serializer = RequestsSerializer(gotten_request, data={'respondedUsers': respondedUsers}, partial=True)
    serializer.is_valid()
    serializer.save()
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
def skillsGet(request):
    skills = Skill.objects.all()
    serializer = SkillsSerializer(skills, many=True)
    return Response(serializer.data)
