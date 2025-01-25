from users import views
from django.urls import path

urlpatterns = [
    path('', views.PrintName, name="printName")
]