import urllib.parse
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.backends import TokenBackend
from django.conf import settings
from django.contrib.auth import get_user_model
from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware

User = get_user_model()

@database_sync_to_async
def get_user(user_id):
    try:
        return User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return AnonymousUser()

class JWTAuthMiddleware(BaseMiddleware):
    """
    Proper Channels 4+ middleware for JWT authentication.
    Reads ?token=<JWT> from query string and attaches user to scope.
    """

    async def __call__(self, scope, receive, send):
        query_string = scope.get("query_string", b"").decode()
        print("[DEBUG] Query string:", query_string)

        qs = urllib.parse.parse_qs(query_string)
        token_list = qs.get("token") or qs.get("access") or []
        token = token_list[0] if token_list else None
        print("[DEBUG] Extracted token:", token)

        scope["user"] = AnonymousUser()

        if token:
            try:
                UntypedToken(token)  
                token_backend = TokenBackend(
                    algorithm=settings.SIMPLE_JWT.get("ALGORITHM", "HS256"),
                    signing_key=settings.SECRET_KEY
                )
                data = token_backend.decode(token, verify=True)
                user_id = data.get("user_id")
                print("[DEBUG] Decoded user_id:", user_id)
                user = await get_user(user_id)
                scope["user"] = user
            except Exception as e:
                print("[DEBUG] Token validation failed:", e)

        return await super().__call__(scope, receive, send)
