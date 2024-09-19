from django.contrib import admin
from django.urls import path
from api.views import save_selection

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/save-selection/', save_selection, name='save_selection'),
]
