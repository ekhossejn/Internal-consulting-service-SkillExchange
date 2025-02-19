from search import views
from django.urls import path

urlpatterns = [
    path('users/get/', views.usersGet),
    path('user/get/<str:_id>/', views.userGet),

    path('requests/get/', views.requestsGet),
    path('request/get/<str:_id>/', views.requestGet),
]