# api/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import CommentViewSet

router = DefaultRouter()
router.register(r'comments', CommentViewSet, basename='comment')

urlpatterns = [
    path('', include(router.urls)),  # Route de l'API pour les commentaires
]
