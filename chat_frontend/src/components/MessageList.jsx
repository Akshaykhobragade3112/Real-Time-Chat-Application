// src/components/MessageList.jsx
import "../components/MessageList.css";

export default function MessageList({ messages, userId }) {
  return (
    <div className="message-list">
      {messages.map((m, i) => {
        const isSystem = m.username === "System";
        const isMine = m.user_id === userId;

        if (isSystem) {
          return (
            <div key={i} className="system-message">
              {m.message}
            </div>
          );
        }

        return (
          <div key={i} className={`message-row ${isMine ? "my-message" : "other-message"}`}>
            <div className={`message-bubble ${isMine ? "mine" : "theirs"}`}>
              {!isMine && <div className="message-username">{m.username}</div>}
              <div className="message-text">{m.message}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
