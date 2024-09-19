from django.db import models

class TextSelection(models.Model):
    text = models.TextField()  # Texte sélectionné
    created_at = models.DateTimeField(auto_now_add=True)

