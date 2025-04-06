from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('api/', include('authentication.urls')),
    path('api/profile/', include('users.urls')),
    path('api/search/', include('search.urls'))
]
