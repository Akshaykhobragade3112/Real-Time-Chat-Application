import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import ChatRoom, Message
from django.contrib.auth.models import AnonymousUser
from django.contrib.auth import get_user_model

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'chat_{self.room_id}'
        print(f"[DEBUG] WebSocket connect attempt room={self.room_id}, user={self.scope.get('user')}")

        
        if not self.scope["user"] or isinstance(self.scope["user"], AnonymousUser) or not self.scope["user"].is_authenticated:
            print("[DEBUG] Rejecting anonymous user")
            await self.close()
            return

        
        try:
            self.chatroom = await database_sync_to_async(ChatRoom.objects.get)(pk=self.room_id)
        except ChatRoom.DoesNotExist:
            await self.close()
            return

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

        
        username = self.scope["user"].username
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "user_join",
                "message": f"{username} joined",
            }
        )

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get("message")

        
        if not message or not self.scope["user"].is_authenticated:
            print("[DEBUG] Rejecting message from unauthenticated user")
            return

        user = self.scope["user"]
        username = user.username

        
        await database_sync_to_async(Message.objects.create)(
            chatroom=self.chatroom,
            sender=user,
            content=message
        )

        
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
                "username": username,
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "type": "chat_message",
            "message": event["message"],
            "username": event["username"],
        }))

    async def user_join(self, event):
        await self.send(text_data=json.dumps({
            "type": "user_join",
            "message": event.get("message")
        }))
