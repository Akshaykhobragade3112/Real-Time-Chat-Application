
from rest_framework import serializers
from .models import ChatRoom, Message
from django.contrib.auth.models import User

class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)

    class Meta:
        model = Message
        fields = ['id','chatroom','sender','sender_username','content','timestamp']
        read_only_fields = ['id','chatroom','sender','sender_username','timestamp']

class ChatRoomSerializer(serializers.ModelSerializer):
    last_message = serializers.SerializerMethodField()
    creator_username = serializers.CharField(source='creator.username', read_only=True)
    creator_id = serializers.IntegerField(source='creator.id', read_only=True)

    class Meta:
        model = ChatRoom
        fields = ['id','name','created_at','last_message','creator_username','creator_id']

    def get_last_message(self, obj):
        last = obj.messages.last()
        if last:
            return {'content': last.content, 'sender': last.sender.username, 'timestamp': last.timestamp}
        return None
