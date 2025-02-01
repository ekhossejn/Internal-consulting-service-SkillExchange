from users import views
from django.urls import path

urlpatterns = [
    path('requests/', views.getRequests, name="getRequests"),
    path('request/<str:_id>', views.getRequest, name="getRequest"),
    path('create/request/', views.createRequest, name="createRequest"),
    path('documents/', views.getDocuments, name="getDocuments"),
    path('', views.getProfile, name="getProfile"),
]