from users import views
from django.urls import path

urlpatterns = [
    path('', views.profile_get),

    path('update/', views.profile_update),
    path('document/upload/', views.document_upload),
    path('document/<str:_id>/delete/', views.document_delete),

    path('company/get/', views.company_get),
    path('image/get/', views.image_get),
    path('email/get/', views.email_get),

    path('requests/get/', views.requests_get),
    path('request/create/', views.request_create),
    path('request/get/<str:_id>/', views.request_get),
    path('request/delete/<str:_id>/', views.request_delete),
    path('request/<str:_id>/active/change/', views.request_active_change),
]