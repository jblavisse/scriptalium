from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import (
    RegisterView,
    get_csrf_token,
    create_text,
    add_annotation,
    ProjectViewSet,
    MyTokenObtainPairView,
    MyTokenRefreshView,
    UserView,
    LogoutView,
    UserProjectListView,
)

router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/auth/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', MyTokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/user/', UserView.as_view(), name='user'),
    path('api/auth/logout/', LogoutView.as_view(), name='logout'),
    path('api/texts/', create_text, name='create_text'),
    path('api/texts/add-annotation/', add_annotation, name='add_annotation'),
    path('api/get-csrf-token/', get_csrf_token, name='get_csrf_token'),
    path('api/', include(router.urls)),
    path('api/projects/user/<int:user_id>/', UserProjectListView.as_view(), name='user-projects'),
]
