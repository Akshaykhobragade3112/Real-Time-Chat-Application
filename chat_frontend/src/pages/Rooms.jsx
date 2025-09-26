// src/pages/Rooms.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { FaComments, FaSignOutAlt, FaPlus, FaTrash } from "react-icons/fa";
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
      const created = res.data;
      setRooms((prev) => [created, ...prev]);
      setShowCreateModal(false);
      if (created?.id) {
        navigate(`/chat/${created.id}`);
      } else {
        alert("Room created — open it from the list.");
      }
    } catch (err) {
      console.error("Create room error:", err);
      const errMsg =
        err.response?.data?.name?.[0] ||
        err.response?.data?.detail ||
        err.message ||
        "Failed to create room";
      alert("Create failed: " + errMsg);
    } finally {
      setCreating(false);
    }
  };

  // ✅ Delete room with direct popup for non-creators
  const deleteRoom = async (roomId, roomName) => {
    try {
      const res = await API.delete(`chat/rooms/${roomId}/delete/`);
      alert(res.data.message);
      setRooms((prev) => prev.filter((r) => r.id !== roomId));
    } catch (err) {
      console.error("Delete room error:", err);

      if (err.response?.status === 403) {
        // 🚨 Show warning immediately — no confirm popup
        alert("⚠️ Can't delete this room — only the creator can delete it.");
      } else {
        const errMsg =
          err.response?.data?.detail ||
          err.message ||
          "Failed to delete room";
        alert("❌ " + errMsg);
      }
    }
  };

  return (
    <div className="rooms-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <span className="sidebar-title">
            <FaComments style={{ marginRight: 8 }} /> Chat Rooms
          </span>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={openCreate} className="new-room-btn" title="Create new room">
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
              <li key={room.id} className="room-item">
                <span
                  className="room-name"
                  onClick={() => navigate(`/chat/${room.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  {room.name}
                </span>

                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    onClick={(ev) => {
                      ev.stopPropagation();
                      navigate(`/chat/${room.id}`);
                    }}
                    className="join-btn"
                  >
                    Join
                  </button>
                  <button
                    onClick={(ev) => {
                      ev.stopPropagation();
                      deleteRoom(room.id, room.name);
                    }}
                    className="delete-btn"
                    title="Delete room"
                  >
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="chat-placeholder">
        <p>👈 Select a room to start chatting</p>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={closeCreate}>
          <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <h3>Create new room</h3>
            <form onSubmit={createRoom}>
              <input
                autoFocus
                className="modal-input"
                placeholder="Room name (e.g. 'General')"
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
