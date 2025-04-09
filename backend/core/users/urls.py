from users import views
from django.urls import path

urlpatterns = [
    path('get/', views.profile_get),

    path('update/', views.profile_update),
    path('document/upload/', views.document_upload),
    path('document/get/<str:_id>/delete/', views.document_delete),

    path('company/get/', views.company_get),
    path('image/get/', views.image_get),
    path('email/get/', views.email_get),

    path('requests/get/', views.requests_get),
    path('requests/create/', views.request_create),
    path('requests/get/<str:_id>/', views.request_get),
    path('requests/get/<str:_id>/delete/', views.request_delete),
    path('requests/get/<str:_id>/active_change/', views.request_active_change),
]