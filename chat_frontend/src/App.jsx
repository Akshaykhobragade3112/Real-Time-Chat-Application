// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Rooms from "./pages/Rooms";
import ChatRoom from "./pages/ChatRoom";
import { clearTokens, getAccessToken } from "./utils/auth";
import Navbar from "./components/Navbar"; // ✅ Import Navbar
import "./App.css";
import { FaLinkedin, FaGithub } from "react-icons/fa";

export default function App() {
  const isAuthenticated = !!getAccessToken();

  const handleLogout = () => {
    clearTokens();
    window.location.href = "/";
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      <Navbar onLogout={isAuthenticated ? handleLogout : null} />

      {/* Routes */}
      <main className="app-main">
        <div className="content-box">
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
      <footer className="app-footer">
        <p>
           Built the Real-Time Chat Application with Django + React + WebSockets and cache(Redis) | Developed by{" "}
          <strong>Akshay Khobragade</strong>
        </p>
        <div className="footer-links">
          <a href="https://www.linkedin.com/in/akshaykhobragade123/" target="_blank" rel="noopener noreferrer">
            <FaLinkedin />
          </a>
          <a href="https://github.com/Akshaykhobragade3112" target="_blank" rel="noopener noreferrer">
            <FaGithub />
          </a>
        </div>
      </footer>
    </div>
  );
}
