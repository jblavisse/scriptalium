from django.urls import path
from api.views import (
    get_csrf_token,
    create_text,
    add_annotation,
    ProjectListCreateView,
    ProjectRetrieveUpdateDestroyView,
    ProjectViewSet
)

urlpatterns = [
    path('api/texts/', create_text, name='create_text'),
    path('api/texts/add-annotation/', add_annotation, name='add_annotation'),
    path('api/get-csrf-token/', get_csrf_token, name='get_csrf_token'),
    path('projects/', ProjectViewSet.as_view({'get': 'list', 'post': 'create'}), name='project-list-create'),
    path('projects/<int:pk>/', ProjectViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='project-detail'),
]