from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed
from django.conf import settings


class CookieJWTAuthentication(JWTAuthentication):
    def get_raw_token(self, request):
        return request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE'])

    def authenticate(self, request):
        raw_token = self.get_raw_token(request)
        if raw_token is None:
            return None

        try:
            validated_token = self.get_validated_token(raw_token)
        except InvalidToken as e:
            raise AuthenticationFailed('Token invalide ou expiré') from e

        return self.get_user(validated_token), validated_token
