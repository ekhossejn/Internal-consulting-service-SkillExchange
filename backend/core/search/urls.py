from search import views
from django.urls import path

urlpatterns = [
    path('skills/get/', views.skills_get),

    path('requests/get/', views.requests_get),
    path('requests/get/<str:_id>/', views.request_get),
    path('requests/get/<str:_id>/respond/', views.request_respond),

    path('users/get/', views.users_get),
    path('users/get/<str:_id>/', views.user_get),
    path('users/get/<str:_id>/review/create/', views.review_create)
]