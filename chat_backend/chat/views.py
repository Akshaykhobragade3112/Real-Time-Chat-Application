from django.shortcuts import render

# Create your views here.

from rest_framework import generics, permissions
from .models import ChatRoom, Message
from .serializers import ChatRoomSerializer, MessageSerializer

class ChatRoomListCreateView(generics.ListCreateAPIView):
    queryset = ChatRoom.objects.all()
    serializer_class = ChatRoomSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ChatRoomDeleteView(generics.RetrieveDestroyAPIView):
    queryset = ChatRoom.objects.all()
    serializer_class = ChatRoomSerializer
    permission_classes = [permissions.IsAuthenticated]  # only logged-in users can delete
    lookup_field = 'id'  # allows /rooms/<id>/delete/
    
    def perform_destroy(self, instance):
        # custom logic (if needed, e.g., check permissions)
        instance.delete()

class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        room_id = self.kwargs['room_id']
        return Message.objects.filter(chatroom_id=room_id).order_by('timestamp')

    def perform_create(self, serializer):
        room_id = self.kwargs['room_id']
        serializer.save(sender=self.request.user, chatroom_id=room_id)