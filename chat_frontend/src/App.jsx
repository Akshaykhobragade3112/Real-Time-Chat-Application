// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Rooms from "./pages/Rooms";
import ChatRoom from "./pages/ChatRoom";
import { clearTokens, getAccessToken } from "./utils/auth";
import"./APP.css";

export default function App() {
  const isAuthenticated = !!getAccessToken();

  const handleLogout = () => {
    clearTokens();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-green-100">
      {/* Header */}
      <header className="bg-green-600 text-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-wide">
            💬 Real-Time Chat App
          </h1>
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
            >
              Logout
            </button>
          )}
        </div>
      </header>

      {/* Routes */}
      <main className="flex-1 container mx-auto px-6 py-8">
        <div className="bg-white shadow-lg rounded-xl p-6 min-h-[500px]">
          <Routes>
            {/* Login route */}
            <Route
              path="/"
              element={isAuthenticated ? <Navigate to="/rooms" /> : <Login />}
            />

            {/* Signup route */}
            <Route
              path="/signup"
              element={isAuthenticated ? <Navigate to="/rooms" /> : <Signup />}
            />

            {/* Rooms route */}
            <Route
              path="/rooms"
              element={isAuthenticated ? <Rooms /> : <Navigate to="/" />}
            />

            {/* Chat route */}
            <Route
              path="/chat/:roomId"
              element={isAuthenticated ? <ChatRoom /> : <Navigate to="/" />}
            />
          </Routes>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 bg-gray-200 text-sm text-gray-600">
        <p>⚡ Built with Django + React + WebSockets</p>
      </footer>
    </div>
  );
}
