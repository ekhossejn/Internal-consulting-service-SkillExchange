from django.contrib import admin
from django.urls import path
from authentication import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    path('register/', views.register, name="register"),
    path('verify/<uidb64>/<token>/', views.verifyAccountView.as_view(), name="verify"),
    path('token/', views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]