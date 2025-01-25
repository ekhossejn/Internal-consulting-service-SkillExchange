from users import views
from django.urls import path

urlpatterns = [
    path('', views.printName, name="printName"),
    path('users/', views.getUsers, name="getUsers")
]