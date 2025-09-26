from django.shortcuts import render

# Create your views here.

from rest_framework import generics, permissions, status
from .models import ChatRoom, Message
from .serializers import ChatRoomSerializer, MessageSerializer
from rest_framework.response import Response


class ChatRoomListCreateView(generics.ListCreateAPIView):
    queryset = ChatRoom.objects.all()
    serializer_class = ChatRoomSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

class ChatRoomDeleteView(generics.DestroyAPIView):
    queryset = ChatRoom.objects.all()
    serializer_class = ChatRoomSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'  # allows /rooms/<id>/delete/

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        # Restrict deletion to the creator
        if instance.creator != request.user:
            return Response(
                {"error": "You are not allowed to delete this room."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        room_name = instance.name
        self.perform_destroy(instance)
        return Response(
            {"message": f"'{room_name}' room is deleted successfully."},
            status=status.HTTP_200_OK
        )

class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        room_id = self.kwargs['room_id']
        return Message.objects.filter(chatroom_id=room_id).order_by('timestamp')

    def perform_create(self, serializer):
        room_id = self.kwargs['room_id']
        serializer.save(sender=self.request.user, chatroom_id=room_id)