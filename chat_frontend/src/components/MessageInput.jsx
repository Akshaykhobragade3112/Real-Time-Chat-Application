import { useState } from "react";
import { FiSend } from "react-icons/fi";
import "./MessageInput.css";

export default function MessageInput({ onSend }) {
  const [input, setInput] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSend} className="message-input-container">
      {/* Input field */}
      <textarea
        rows={1}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        className="message-input"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend(e);
          }
        }}
      />

      {/* Send button */}
      <button type="submit" className="send-btn">
        <FiSend size={20} />
      </button>
    </form>
  );
}
