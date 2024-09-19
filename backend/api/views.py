import json
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import TextSelection

@csrf_exempt
def save_selection(request):
    if request.method == 'POST':
        try:
            # Parse le corps de la requête en JSON
            data = json.loads(request.body)
            
            # Récupère le texte sélectionné
            selected_text = data.get('selectedText')
            
            # Vérifie si le texte est fourni
            if not selected_text:
                return JsonResponse({'error': 'No text selected'}, status=400)
            
            # Sauvegarde la sélection dans la base de données
            TextSelection.objects.create(text=selected_text)

            return JsonResponse({'status': 'success'})
        
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
        except Exception as e:
            # Gère les autres exceptions
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=400)
