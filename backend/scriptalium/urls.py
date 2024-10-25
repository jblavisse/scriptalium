from django.contrib import admin
from django.urls import path
from api.views import (
    get_csrf_token,
    create_text,
    add_annotation,
    MyTokenObtainPairView,
    MyTokenRefreshView,
    UserView,
    LogoutView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', MyTokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/user/', UserView.as_view(), name='user'),
    path('api/auth/logout/', LogoutView.as_view(), name='logout'),
    path('api/texts/', create_text, name='create_text'),
    path('api/texts/add-annotation/', add_annotation, name='add_annotation'),
    path('api/get-csrf-token/', get_csrf_token, name='get_csrf_token'),
]
