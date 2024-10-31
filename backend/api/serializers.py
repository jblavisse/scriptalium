from rest_framework import serializers
from .models import Text, Annotation , Project

class TextSerializer(serializers.ModelSerializer):
    class Meta:
        model = Text
        fields = ['id', 'content', 'annotations']

class AnnotationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Annotation
        fields = ['id', 'title', 'description', 'start_index', 'end_index', 'text', 'created_at']

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'user', 'title', 'description', 'editor_content', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']