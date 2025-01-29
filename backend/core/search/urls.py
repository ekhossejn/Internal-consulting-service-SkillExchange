from search import views
from django.urls import path

urlpatterns = [
    path('users/', views.getUsers, name="getUsers"),
    path('requests/', views.getRequests, name="getRequests"),
]