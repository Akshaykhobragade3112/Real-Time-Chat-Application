// src/components/MessageInput.jsx
import { useState } from "react";
import { FiSend } from "react-icons/fi";

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
    <form
      onSubmit={handleSend}
      className="flex items-center gap-2 bg-white border rounded-full px-4 py-2 shadow-md"
    >
      {/* Input field */}
      <textarea
        rows={1}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 resize-none bg-transparent outline-none text-gray-700 p-1 max-h-28"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend(e);
          }
        }}
      />

      {/* Send button */}
      <button
        type="submit"
        className="bg-green-600 p-2 rounded-full text-white hover:bg-green-700 transition"
      >
        <FiSend size={20} />
      </button>
    </form>
  );
}
