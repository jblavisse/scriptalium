from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.conf import settings

class Text(models.Model):
    content = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Text {self.id}"


class Annotation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    text = models.ForeignKey(Text, on_delete=models.CASCADE, related_name="annotations")
    title = models.CharField(max_length=255)
    description = models.TextField()
    start_index = models.IntegerField()
    end_index = models.IntegerField()
    selected_text = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.title

class Project(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="projects",
        null=True,   
        blank=True        
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    editor_content = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True) 

    def __str__(self):
        return self.title