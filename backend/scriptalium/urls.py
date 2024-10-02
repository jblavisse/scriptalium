from django.urls import path
from api.views import get_csrf_token,create_text,add_annotation

urlpatterns = [
    path('api/texts/', create_text, name='create_text'),
    path('api/texts/add-annotation/', add_annotation, name='add_annotation'),
    path('api/get-csrf-token/', get_csrf_token, name='get_csrf_token'),
]
