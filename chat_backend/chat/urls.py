
from django.urls import path
from .views import ChatRoomListCreateView, MessageListCreateView

urlpatterns = [
    path('rooms/', ChatRoomListCreateView.as_view(), name='rooms'),
    path('rooms/<int:room_id>/messages/', MessageListCreateView.as_view(), name='messages'),
]
