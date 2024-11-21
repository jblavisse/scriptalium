from django.test import TestCase
from rest_framework.test import APIRequestFactory
from unittest.mock import patch, MagicMock
from django.urls import reverse
from rest_framework import status
from datetime import timedelta
from api.views import MyTokenObtainPairView


class LoginUnitTestCase(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.login_url = reverse('token_obtain_pair')

    @patch('api.views.settings')
    @patch.object(MyTokenObtainPairView, 'get_serializer')
    def test_login_success(self, mock_get_serializer, mock_settings):
        mock_settings.SIMPLE_JWT = {
            'AUTH_COOKIE': 'access_token',
            'AUTH_COOKIE_REFRESH': 'refresh_token',
            'AUTH_COOKIE_HTTP_ONLY': True,
            'AUTH_COOKIE_SECURE': False,
            'AUTH_COOKIE_SAMESITE': 'Lax',
            'ACCESS_TOKEN_LIFETIME': timedelta(minutes=5),
            'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
        }

        mock_serializer = MagicMock()
        mock_serializer.is_valid.return_value = True
        mock_serializer.validated_data = {
            'access': 'mock_access_token',
            'refresh': 'mock_refresh_token'
        }
        mock_get_serializer.return_value = mock_serializer

        request_data = {
            'username': 'testuser',
            'password': 'secret'
        }
        request = self.factory.post(self.login_url, request_data, format='json')

        view = MyTokenObtainPairView.as_view()

        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['detail'], 'Connexion réussie')

        access_cookie = response.cookies.get('access_token')
        self.assertIsNotNone(access_cookie)
        self.assertEqual(access_cookie.value, 'mock_access_token')

        refresh_cookie = response.cookies.get('refresh_token')
        self.assertIsNotNone(refresh_cookie)
        self.assertEqual(refresh_cookie.value, 'mock_refresh_token')

    @patch('api.views.settings')
    @patch.object(MyTokenObtainPairView, 'get_serializer')
    def test_login_failure(self, mock_get_serializer, mock_settings):
        mock_settings.SIMPLE_JWT = {
            'AUTH_COOKIE': 'access_token',
            'AUTH_COOKIE_REFRESH': 'refresh_token',
            'AUTH_COOKIE_HTTP_ONLY': True,
            'AUTH_COOKIE_SECURE': False,
            'AUTH_COOKIE_SAMESITE': 'Lax',
            'ACCESS_TOKEN_LIFETIME': timedelta(minutes=5),
            'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
        }

        mock_serializer = MagicMock()
        mock_serializer.is_valid.side_effect = Exception("Invalid credentials")
        mock_get_serializer.return_value = mock_serializer

        request_data = {
            'username': 'wronguser',
            'password': 'wrongpassword'
        }
        request = self.factory.post(self.login_url, request_data, format='json')

        view = MyTokenObtainPairView.as_view()

        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data['detail'], "Nom d'utilisateur ou mot de passe incorrect")

        self.assertNotIn('access_token', response.cookies)
        self.assertNotIn('refresh_token', response.cookies)
