from users import views
from django.urls import path

urlpatterns = [
    path('', views.printName, name="printName"),
    path('requests/', views.getRequests, name="getRequests"),
    path('request/<str:_id>', views.getRequest, name="getRequest"),
    path('documents/', views.getDocuments, name="getDocuments")
]