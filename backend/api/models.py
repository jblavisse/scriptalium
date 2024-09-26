from django.db import models
from django.contrib.auth.models import User

class Comment(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()  # Contenu du commentaire
    created_at = models.DateTimeField(auto_now_add=True)
    thread_id = models.CharField(max_length=100, null=True, blank=True)
    quote = models.TextField(null=True, blank=True)  # Ajout de l'extrait sélectionné

    def __str__(self):
        return f"{self.author}: {self.content}"