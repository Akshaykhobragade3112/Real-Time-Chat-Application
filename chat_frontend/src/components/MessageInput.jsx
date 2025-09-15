import { useState } from "react";
import { FiSend } from "react-icons/fi"; // ✅ install react-icons if not already

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
      className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 shadow-sm"
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 bg-transparent outline-none p-2 text-gray-700"
      />
      <button
        type="submit"
        className="bg-green-600 p-2 rounded-full text-white hover:bg-green-700 transition"
      >
        <FiSend size={20} />
      </button>
    </form>
  );
}
