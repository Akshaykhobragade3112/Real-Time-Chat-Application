
from django.urls import path
from .views import ChatRoomListCreateView, MessageListCreateView, ChatRoomDeleteView

urlpatterns = [
    path('rooms/', ChatRoomListCreateView.as_view(), name='rooms'),
    path('rooms/<int:id>/delete/', ChatRoomDeleteView.as_view(), name='room-delete'),
    path('rooms/<int:room_id>/messages/', MessageListCreateView.as_view(), name='messages'),
]
