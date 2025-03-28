from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes

from authentication.models import CustomUser  
from .models import Request, Skill, Document
from .serializer import RequestsShortInfoSerializer, RequestsSerializer, CompanySerializer, UpdateCustomUserSerializer, UpdatedCustomUserSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
import os
import core.settings
from .checkers import check_is_image

from .serializer import CustomUserSerializer
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_get(request):
    serializer = CustomUserSerializer(request.user)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def profile_update(request):
    image = request.FILES.get('image')
    if not image:
        return Response({"detail": "Файл не был загружен!"}, status=status.HTTP_400_BAD_REQUEST)
    if not check_is_image(image):
        return Response({"detail": "Файл не является корректным изображением!"}, status=status.HTTP_400_BAD_REQUEST)
    
    request.data['image'] = image
    user_serializer = UpdateCustomUserSerializer(request.user, data=request.data, partial=True)
    if user_serializer.is_valid():
        user_serializer.save()
        updated_user_serializer = UpdatedCustomUserSerializer(request.user)
        return Response(updated_user_serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def document_upload(request):
    image = request.FILES.get('image')
    if not image:
        return Response({"detail": "Файл не был загружен!"}, status=status.HTTP_400_BAD_REQUEST)
    if not check_is_image(image):
        return Response({"detail": "Файл не является корректным изображением!"}, status=status.HTTP_400_BAD_REQUEST)
     
    document_obj = Document.objects.create(owner=request.user, image=image)
    return Response({"image": document_obj.image.url, "id": document_obj.id}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def document_delete(request, _id):
    try:
        document_obj = Document.objects.get(id=_id)
    except Document.DoesNotExist:
        return Response({"detail": "Документ с таким id не существует."}, status=status.HTTP_404_NOT_FOUND)
    
    if request.user.id != document_obj.owner.id:
        return Response({"detail": "У вас нет доступа для удаления этого запроса"}, status=status.HTTP_403_FORBIDDEN)
    
    url = os.path.join(core.settings.STATIC_URL, "images", str(document_obj.image))
    if os.path.exists(url):
       os.remove(url)
    document_obj.delete()
    return Response({"detail": "Запрос успешно удален"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def company_get(request):
    company = CompanySerializer(request.user.company, many=False)
    return Response(company.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def image_get(request):
    return Response(request.user.image.url)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def email_get(request):
    return Response(request.user.email)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def request_create(request):
    skills_ids = request.data.pop('requiredSkills', [])
    serializer = RequestsSerializer(data=request.data)

    if serializer.is_valid():
        skills = Skill.objects.filter(id__in=skills_ids)
        if len(skills) != len(skills_ids):
            return Response({"detail": "Некоторые указанные навыки не найдены."}, status=status.HTTP_400_BAD_REQUEST)
        request_obj = serializer.save(author=request.user, requiredSkills=skills)
        request_serializer = RequestsShortInfoSerializer(request_obj)
        return Response(request_serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def request_get(request, _id):
    try:
        request_obj = Request.objects.get(id=_id)
    except Request.DoesNotExist:
        return Response({"detail": "Запрос с таким id не существует."}, status=status.HTTP_404_NOT_FOUND)
    if request.user.id != request_obj.author.id:
        return Response({"detail": "У вас нет доступа для просмотра этого запроса"}, status=status.HTTP_403_FORBIDDEN)
    serializer = RequestsSerializer(request_obj)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def request_delete(request, _id):
    try:
        request_obj = Request.objects.get(id=_id)
    except Request.DoesNotExist:
        return Response({"detail": "Запрос с таким id не существует."}, status=status.HTTP_404_NOT_FOUND)
    if request.user.id != request_obj.author.id:
        return Response({"detail": "У вас нет доступа для удаления этого запроса"}, status=status.HTTP_403_FORBIDDEN)
    request_obj.delete()
    return Response({"detail": "Запрос успешно удален"})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def request_active_change(request, _id):
    try:
        request_obj = Request.objects.get(id=_id)
    except Request.DoesNotExist:
        return Response({"detail": "Запрос с таким id не существует."}, status=status.HTTP_404_NOT_FOUND)
    
    if request.user.id != request_obj.author.id:
        return Response({"detail": "У вас нет доступа для просмотра этого запроса"}, status=status.HTTP_403_FORBIDDEN)
    
    request_serializer = RequestsSerializer(request_obj, data={'isActive': not request_obj.isActive}, partial=True)
    if request_serializer.is_valid():
        request_serializer.save()
    return Response({'isActive': request_serializer.data['isActive']}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def requests_get(request):
    requests = Request.objects.filter(author=request.user).select_related('author')
    serializer = RequestsShortInfoSerializer(requests, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

