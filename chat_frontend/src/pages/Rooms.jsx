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
    <div className="rooms-container">
      {/* Sidebar */}
      <div className="sidebar">
        {/* Header */}
        <div className="sidebar-header">
          <span className="sidebar-title">
            <FaComments style={{ marginRight: "8px" }} /> Chat Rooms
          </span>
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
            className="logout-btn"
          >
            <FaSignOutAlt size={18} />
          </button>
        </div>

        {/* Rooms List */}
        <ul className="room-list">
          {rooms.map((room) => (
            <li
              key={room.id}
              onClick={() => navigate(`/chat/${room.id}`)}
              className="room-item"
            >
              <span className="room-name">{room.name}</span>
              <button className="join-btn">Join</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Placeholder for Chat Area */}
      <div className="chat-placeholder">
        <p>👈 Select a room to start chatting</p>
      </div>
    </div>
  );
}
