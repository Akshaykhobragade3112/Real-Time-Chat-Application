import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAccessToken, getUserId } from "../utils/auth";
import MessageInput from "../components/MessageInput";
import "./ChatRoom.css";

export default function ChatRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const wsRef = useRef(null);
  const userId = getUserId();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;

    const ws = new WebSocket(
      `ws://127.0.0.1:8000/ws/chat/${roomId}/?token=${token}`
    );
    wsRef.current = ws;

    ws.onopen = () => console.log("Connected to WebSocket");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };
    ws.onclose = () => console.log("WebSocket closed");

    return () => ws.close();
  }, [roomId]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages come in
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (msg) => {
    if (wsRef.current && msg.trim()) {
      wsRef.current.send(JSON.stringify({ message: msg }));
    }
  };

  return (
    <div className="chatroom-container">
      {/* Header */}
      <div className="chatroom-header">
        <h2>💬 Room {roomId}</h2>
        <button onClick={() => navigate("/rooms")} className="exit-btn">
          Exit
        </button>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`message-row ${
              m.user_id === userId ? "my-message" : "other-message"
            }`}
          >
            <div className="message-bubble">
              <p className="message-username">{m.username}</p>
              <p className="message-text">{m.message}</p>
              <p className="message-time">
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input">
        <MessageInput onSend={sendMessage} />
      </div>
    </div>
  );
}
