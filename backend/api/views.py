from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Text, Annotation
from .serializers import TextSerializer, AnnotationSerializer
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse

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
