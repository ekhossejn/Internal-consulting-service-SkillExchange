from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes

from authentication.models import CustomUser  
from .models import Request, Skill, Document
from .serializer import RequestsShortInfoSerializer, RequestsSerializer, CompanySerializer, UpdateCustomUserSerializer, DocumentsSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .serializer import CustomUserSerializer
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profileGet(request):
    user = request.user
    serializer = CustomUserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def profileUpdate(request):
    user = request.user
    if request.FILES.get('image'):
        request.data['image'] = request.FILES.get('image')
    else:
        request.data['image'] = user.image
    serializer = UpdateCustomUserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        serializer = CustomUserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def documentUpload(request):
    image = request.FILES.get('image')
    if not image:
        return Response({"detail": "Файл не был загружен!"}, status=status.HTTP_400_BAD_REQUEST)
    document = Document.objects.create(owner=request.user, image=image)
    return Response(
        {
            "id": document.id,
            "owner": document.owner.id,
            "image": document.image.url,
            "detail": "Документ успешно загружен"
        },
        status=status.HTTP_201_CREATED
    )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def documentDelete(request, _id):
    try:
        document_obj = Document.objects.get(id = _id)
    except Document.DoesNotExist:
        return Response({"detail": "Документ с таким id не существует."}, status=status.HTTP_404_NOT_FOUND)
    if request.user.id != document_obj.owner.id:
        return Response({"detail": "У вас нет доступа для удаления этого запроса"}, status=status.HTTP_403_FORBIDDEN)
    document_obj.delete()
    return Response({"detail": "Запрос успешно удален"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def companyGet(request):
    try:
        user_obj = CustomUser.objects.get(id=request.user.id)
    except Request.DoesNotExist:
        return Response({"detail": "Пользователь с таким id не существует."}, status=status.HTTP_404_NOT_FOUND)
    if not user_obj.company:
        return Response({"detail" : "Пользователь не относится ни к какой организации"}, status=status.HTTP_404_NOT_FOUND)
    company = CompanySerializer(user_obj.company, many=False)
    return Response(company.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def imageGet(request):
    try:
        user_obj = CustomUser.objects.get(id=request.user.id)
    except Request.DoesNotExist:
        return Response({"detail": "Пользователь с таким id не существует."}, status=status.HTTP_404_NOT_FOUND)
    if not user_obj.image:
        return Response({"detail" : "У пользователя нет аватарки"}, status=status.HTTP_404_NOT_FOUND)
    return Response(user_obj.image.url)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def emailGet(request):
    try:
        user_obj = CustomUser.objects.get(id=request.user.id)
    except Request.DoesNotExist:
        return Response({"detail": "Пользователь с таким id не существует."}, status=status.HTTP_404_NOT_FOUND)
    return Response(user_obj.email)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def requestCreate(request):
    data = request.data
    skills_ids = data['requiredSkills']
    data.pop('requiredSkills', None)
    serializer = RequestsSerializer(data=data)
    if serializer.is_valid():
        request = serializer.save(author = request.user)
        for skill_id in skills_ids:
            skill = Skill.objects.get(id=skill_id)
            request.requiredSkills.add(skill)
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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def requestDelete(request, _id):
    try:
        gotten_request = Request.objects.get(id = _id)
    except Request.DoesNotExist:
        return Response({"detail": "Запрос с таким id не существует."}, status=status.HTTP_404_NOT_FOUND)
    if request.user.id != gotten_request.author.id:
        return Response({"detail": "У вас нет доступа для удаления этого запроса"}, status=status.HTTP_403_FORBIDDEN)
    gotten_request.delete()
    return Response({"detail": "Запрос успешно удален"})

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
    serializer = RequestsShortInfoSerializer(requests, many=True)
    return Response(serializer.data)

