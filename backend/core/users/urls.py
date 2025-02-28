from users import views
from django.urls import path

urlpatterns = [
    path('image/get/', views.imageGet),

    path('request/<str:_id>/active/change/', views.requestActiveChange),
    path('request/create/', views.requestCreate),
    path('request/get/<str:_id>/', views.requestGet),
    path('request/<str:_id>/emails/get/', views.requestEmailsGet),
    path('requests/get/', views.requestsGet),
    path('', views.profileGet),
]