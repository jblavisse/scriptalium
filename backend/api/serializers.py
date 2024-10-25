from rest_framework import serializers
from .models import Text, Annotation

class TextSerializer(serializers.ModelSerializer):
    class Meta:
        model = Text
        fields = ['id', 'content', 'annotations']

class AnnotationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Annotation
        fields = ['id', 'title', 'description', 'start_index', 'end_index', 'text', 'created_at']
