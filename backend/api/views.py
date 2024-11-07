from rest_framework import viewsets, permissions, generics, status
from rest_framework.decorators import api_view
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Text, Annotation, Project
from .serializers import TextSerializer, AnnotationSerializer, ProjectSerializer, MyTokenObtainPairSerializer , UserSerializer
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from django.conf import settings
from django.contrib.auth.models import User
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated
from django.middleware.csrf import get_token

@api_view(['GET'])
@ensure_csrf_cookie
def get_csrf_token(request):
    csrf_token = get_token(request)
    return Response({"csrfToken": csrf_token})

@api_view(['POST'])
def create_text(request):
    serializer = TextSerializer(data=request.data)
    if serializer.is_valid():
        text = serializer.save()
        return Response({'textId': text.id}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def add_annotation(request):
    data = request.data
    selected_text = data.get('selectedText')
    start_index = data.get('start_index')
    end_index = data.get('end_index')

    if not selected_text or start_index is None or end_index is None:
        return Response({'error': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)

    text = Text.objects.create(content=selected_text)
    annotation_data = {
        'title': data.get('title'),
        'description': data.get('description'),
        'start_index': start_index,
        'end_index': end_index,
        'text': text.id,
    }

    annotation_serializer = AnnotationSerializer(data=annotation_data)
    
    if annotation_serializer.is_valid():
        annotation_serializer.save()
        return Response({'message': 'Annotation added', 'textId': text.id}, status=status.HTTP_201_CREATED)
    return Response(annotation_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = [] 

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return Project.objects.filter(user=user).order_by('-created_at')
        return Project.objects.none()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception:
            return Response({"detail": "Nom d'utilisateur ou mot de passe incorrect"}, status=status.HTTP_401_UNAUTHORIZED)

        token = serializer.validated_data

        response = Response({"detail": "Connexion réussie"}, status=status.HTTP_200_OK)

        # Définir les cookies JWT
        response.set_cookie(
            key=settings.SIMPLE_JWT['AUTH_COOKIE'],
            value=token['access'],
            httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
            secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
            samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
            max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds(),
        )

        response.set_cookie(
            key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
            value=token['refresh'],
            httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
            secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
            samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
            max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds(),
        )

        return response

class MyTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            if response.status_code == 200:
                response.set_cookie(
                    key=settings.SIMPLE_JWT['AUTH_COOKIE'],
                    value=response.data['access'],
                    httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                    secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                    samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
                    max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds(),
                )
        except Exception:
            return Response({"detail": "Erreur de rafraîchissement du token"}, status=status.HTTP_401_UNAUTHORIZED)
        return response

class UserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class LogoutView(APIView):

    def post(self, request):
        response = Response({"detail": "Déconnexion réussie"}, status=status.HTTP_200_OK)
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        return response

class UserProjectListView(generics.ListAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        return Project.objects.filter(user__id=user_id).order_by('-created_at')
