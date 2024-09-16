from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def hello_world(request):
    data = {
        "message": "Hello,World !",
        "items": ["Article 1", "Article 2", "Article 3"]
    }
    return Response(data)
