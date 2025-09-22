// src/pages/Rooms.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { FaComments, FaSignOutAlt, FaPlus } from "react-icons/fa";
import "./Rooms.css";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoadingRooms(true);
    try {
      const { data } = await API.get("chat/rooms/");
      setRooms(data);
    } catch (err) {
      console.error("Error fetching rooms", err);
      alert("Could not load rooms. Check console for details.");
    } finally {
      setLoadingRooms(false);
    }
  };

  const openCreate = () => {
    setNewRoomName("");
    setShowCreateModal(true);
    // accessibility: focus will be on the input (handled by browser when modal opens)
  };

  const closeCreate = () => {
    if (!creating) setShowCreateModal(false);
  };

  const createRoom = async (e) => {
    e?.preventDefault();
    const name = newRoomName.trim();
    if (!name || name.length < 2) {
      alert("Please provide a room name (at least 2 characters).");
      return;
    }

    setCreating(true);
    try {
      const res = await API.post("chat/rooms/", { name });
      // res.data should be the created room (id + name)
      const created = res.data;
      // Append to rooms list (at top)
      setRooms((prev) => [created, ...prev]);
      setShowCreateModal(false);
      // Optionally navigate directly to the room
      if (created?.id) {
        navigate(`/chat/${created.id}`);
      } else {
        alert("Room created — open it from the list.");
      }
    } catch (err) {
      console.error("Create room error:", err);
      // Try to show server error
      const errMsg =
        err.response?.data?.name?.[0] ||
        err.response?.data?.detail ||
        err.message ||
        "Failed to create room";
      alert("❌ Create failed: " + errMsg);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="rooms-container">
      {/* Sidebar */}
      <div className="sidebar">
        {/* Header */}
        <div className="sidebar-header">
          <span className="sidebar-title">
            <FaComments style={{ marginRight: 8 }} /> Chat Rooms
          </span>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              onClick={openCreate}
              className="new-room-btn"
              title="Create new room"
            >
              <FaPlus /> New
            </button>

            <button
              onClick={() => {
                localStorage.clear();
                navigate("/");
              }}
              className="logout-btn"
              title="Logout"
            >
              <FaSignOutAlt size={18} />
            </button>
          </div>
        </div>

        {/* Rooms List */}
        <ul className="room-list" aria-live="polite">
          {loadingRooms ? (
            <li style={{ padding: 16, color: "#666" }}>Loading...</li>
          ) : rooms.length === 0 ? (
            <li style={{ padding: 16, color: "#666" }}>No rooms yet</li>
          ) : (
            rooms.map((room) => (
              <li
                key={room.id}
                onClick={() => navigate(`/chat/${room.id}`)}
                className="room-item"
              >
                <span className="room-name">{room.name}</span>
                <button
                  onClick={(ev) => {
                    ev.stopPropagation();
                    navigate(`/chat/${room.id}`);
                  }}
                  className="join-btn"
                >
                  Join
                </button>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Placeholder for Chat Area */}
      <div className="chat-placeholder">
        <p>👈 Select a room to start chatting</p>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={closeCreate}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Create new room</h3>
            <form onSubmit={createRoom}>
              <input
                autoFocus
                className="modal-input"
                placeholder="Room name (e.g. Group-B)"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                maxLength={60}
              />
              <div className="modal-actions">
                <button
                  type="button"
                  className="modal-cancel"
                  onClick={closeCreate}
                  disabled={creating}
                >
                  Cancel
                </button>
                <button type="submit" className="modal-create" disabled={creating}>
                  {creating ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
