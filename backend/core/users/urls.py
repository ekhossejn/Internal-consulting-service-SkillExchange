from users import views
from django.urls import path

urlpatterns = [
    path('requests/', views.getRequests, name="getRequests"),
    path('request/<str:_id>', views.getRequest, name="getRequest"),
    path('documents/', views.getDocuments, name="getDocuments"),
    path('login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('', views.getProfile, name="getProfile"),
    path('users/', views.getUsers, name="getUsers")
]