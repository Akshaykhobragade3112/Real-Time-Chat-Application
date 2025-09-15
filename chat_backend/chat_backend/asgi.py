import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "chat_backend.settings")

django_asgi_app = get_asgi_application()

def get_application():
    from users.middleware import JWTAuthMiddleware  
    import chat.routing                           

    return ProtocolTypeRouter({
        "http": django_asgi_app,
        "websocket": JWTAuthMiddleware(
            URLRouter(
                chat.routing.websocket_urlpatterns
            )
        ),
    })

application = get_application()
