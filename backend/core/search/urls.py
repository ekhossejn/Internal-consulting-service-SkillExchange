from search import views
from django.urls import path

urlpatterns = [
    path('skills/get/', views.skills_get),

    path('requests/get/', views.requests_get),
    path('request/get/<str:_id>/', views.request_get),
    path('request/respond/<str:_id>/', views.request_respond),

    path('users/get/', views.users_get),
    path('user/get/<str:_id>/', views.user_get),
    path('user/<str:_id>/review/create/', views.review_create)
]