from search import views
from django.urls import path

urlpatterns = [
    path('users/get/', views.usersGet),
    path('user/get/<str:_id>/', views.userGet),

    path('requests/get/', views.requestsGet),
    path('request/get/<str:_id>/', views.requestGet),
    path('request/respond/<str:_id>/', views.requestRespond),

    path('skills/get/', views.skillsGet),

    path('user/<str:_id>/review/create/', views.reviewCreate)
]