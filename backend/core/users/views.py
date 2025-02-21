from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes

from authentication.models import CustomUser  
from .models import Request, Document, Review
from .serializer import RequestsSerializer, DocumentsSerializer, ReviewsSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from authentication.serializer import CustomUserSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def imageGet(request):
    try:
        gotten_request = CustomUser.objects.get(id=request.user.id)
    except Request.DoesNotExist:
        return Response({"detail": "Пользователь с таким id не существует."}, status=status.HTTP_404_NOT_FOUND)
    if not gotten_request.image:
        return Response({"detail" : "У пользователя нет аватарки"}, status=status.HTTP_404_NOT_FOUND)
    return Response(gotten_request.image.url)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def requestCreate(request):
    data = request.data
    serializer = RequestsSerializer(data=data)
    if serializer.is_valid():
        serializer.save(author = request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def requestGet(request, _id):
    try:
        gotten_request = Request.objects.get(id = _id)
    except Request.DoesNotExist:
        return Response({"detail": "Запрос с таким id не существует."}, status=status.HTTP_404_NOT_FOUND)
    if request.user.id != gotten_request.author.id:
        return Response({"detail": "У вас нет доступа для просмотра этого запроса"}, status=status.HTTP_403_FORBIDDEN)
    serializer = RequestsSerializer(gotten_request, many=False)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def requestActiveGet(request, _id):
    try:
        gotten_request = Request.objects.get(id = _id)
    except Request.DoesNotExist:
        return Response({"detail": "Запрос с таким id не существует."}, status=status.HTTP_404_NOT_FOUND)
    if request.user.id != gotten_request.author.id:
        return Response({"detail": "У вас нет доступа для просмотра этого запроса"}, status=status.HTTP_403_FORBIDDEN)
    return Response(gotten_request.isActive)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def requestActiveChange(request, _id):
    try:
        gotten_request = Request.objects.get(id = _id)
    except Request.DoesNotExist:
        return Response({"detail": "Запрос с таким id не существует."}, status=status.HTTP_404_NOT_FOUND)
    if request.user.id != gotten_request.author.id:
        return Response({"detail": "У вас нет доступа для просмотра этого запроса"}, status=status.HTTP_403_FORBIDDEN)
    if gotten_request.isActive:
        serializer = RequestsSerializer(gotten_request, data={'isActive': False}, partial=True)
    else: 
        serializer = RequestsSerializer(gotten_request, data={'isActive': True}, partial=True)
    serializer.is_valid()
    serializer.save()
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def requestEmailsGet(request, _id):
    try:
        gotten_request = Request.objects.get(id=_id)
    except Request.DoesNotExist:
        return Response({"detail": "Запрос с таким id не существует."}, status=status.HTTP_404_NOT_FOUND)
    if request.user.id != gotten_request.author.id:
        return Response({"detail": "У вас нет доступа для просмотра этого запроса"}, status=status.HTTP_403_FORBIDDEN)
    responded_users = gotten_request.respondedUsers
    emails = []
    for user in responded_users.all():
        try: 
            gotten_user = CustomUser.objects.get(id=user.id)
            emails.append(gotten_user.email)
        except Request.DoesNotExist: 
            continue
    return Response(emails)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def requestsGet(request):
    requests = Request.objects.filter(author = request.user)
    serializer = RequestsSerializer(requests, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profileGet(request):
    user = request.user
    serializer = CustomUserSerializer(user, many=False)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def documentsGet(request):
    documents = Document.objects.filter(owner=request.user)
    serializer = DocumentsSerializer(documents, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def reviewsGet(request):
    reviews = Review.objects.filter(reviewee=request.user)
    serializer = ReviewsSerializer(reviews, many=True)
    return Response(serializer.data)
