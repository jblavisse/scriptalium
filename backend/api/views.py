from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from .models import Text, Annotation
from .serializers import TextSerializer, AnnotationSerializer, MyTokenObtainPairSerializer
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from django.conf import settings

@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({'detail': 'CSRF cookie set'})

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

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception:
            return Response({"detail": "Nom d'utilisateur ou mot de passe incorrect"}, status=status.HTTP_401_UNAUTHORIZED)
        
        user = serializer.user
        token = serializer.validated_data

        response = Response({"detail": "Connexion réussie"}, status=status.HTTP_200_OK)

        response.set_cookie(
            key='access_token',
            value=token['access'],
            httponly=True,
            secure=not settings.DEBUG, 
            samesite='Lax',
            max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds(),
        )

        response.set_cookie(
            key='refresh_token',
            value=token['refresh'],
            httponly=True,
            secure=not settings.DEBUG,  
            samesite='Lax',
            max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds(),
        )

        return response

class MyTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            if response.status_code == 200:
                response.set_cookie(
                    key='access_token',
                    value=response.data['access'],
                    httponly=True,
                    secure=not settings.DEBUG,
                    samesite='Lax',
                    max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds(),
                )
        except Exception:
            return Response({"detail": "Erreur de rafraîchissement du token"}, status=status.HTTP_401_UNAUTHORIZED)
        return response

class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'username': user.username,
            'email': user.email,
        })

class LogoutView(APIView):

    def post(self, request):
        response = Response({"detail": "Déconnexion réussie"}, status=status.HTTP_200_OK)
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        return response
