// src/pages/Rooms.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { FaComments, FaSignOutAlt } from "react-icons/fa";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchRooms() {
      try {
        const { data } = await API.get("chat/rooms/");
        setRooms(data);
      } catch (err) {
        console.error("Error fetching rooms", err);
      }
    }
    fetchRooms();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r flex flex-col">
        {/* Header */}
        <div className="bg-green-600 text-white p-4 flex items-center justify-between">
          <span className="font-bold text-lg flex items-center gap-2">
            <FaComments /> Chat Rooms
          </span>
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
            className="hover:text-red-200"
          >
            <FaSignOutAlt size={18} />
          </button>
        </div>

        {/* Rooms List */}
        <ul className="flex-1 overflow-y-auto">
          {rooms.map((room) => (
            <li
              key={room.id}
              onClick={() => navigate(`/chat/${room.id}`)}
              className="p-4 border-b hover:bg-gray-200 cursor-pointer flex justify-between items-center transition"
            >
              <span className="font-medium">{room.name}</span>
              <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                Join
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Placeholder for Chat Area */}
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg">
          👈 Select a room to start chatting
        </p>
      </div>
    </div>
  );
}
