from users import views
from django.urls import path

urlpatterns = [
    path('request/create/', views.requestCreate),
    path('request/get/<str:_id>/', views.requestGet),
    path('requests/get/', views.requestsGet),

    path('documents/get/', views.documentsGet),

    path('', views.profileGet),
]