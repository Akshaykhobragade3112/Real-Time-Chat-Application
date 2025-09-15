// src/pages/ChatRoom.jsx
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAccessToken, getUserId } from "../utils/auth";
import MessageInput from "../components/MessageInput";

export default function ChatRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const wsRef = useRef(null);
  const userId = getUserId();

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;

    const ws = new WebSocket(
      `ws://127.0.0.1:8000/ws/chat/${roomId}/?token=${token}`
    );
    wsRef.current = ws;

    ws.onopen = () => console.log("✅ Connected to WebSocket");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };
    ws.onclose = () => console.log("❌ WebSocket closed");

    return () => ws.close();
  }, [roomId]);

  const sendMessage = (msg) => {
    if (wsRef.current && msg.trim()) {
      wsRef.current.send(JSON.stringify({ message: msg }));
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center bg-green-600 text-white px-4 py-3 shadow">
        <h2 className="text-lg font-bold">Room {roomId}</h2>
        <button
          onClick={() => navigate("/rooms")}
          className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
        >
          Exit
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100 space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.user_id === userId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg shadow ${
                m.user_id === userId
                  ? "bg-green-500 text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none"
              }`}
            >
              <p className="text-sm font-semibold">
                {m.username}
              </p>
              <p>{m.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t bg-white">
        <MessageInput onSend={sendMessage} />
      </div>
    </div>
  );
}
