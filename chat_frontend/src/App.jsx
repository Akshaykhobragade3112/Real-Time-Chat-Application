
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Rooms from "./pages/Rooms";
import ChatRoom from "./pages/ChatRoom";
import { clearTokens, getAccessToken } from "./utils/auth";

export default function App() {
  const isAuthenticated = !!getAccessToken();

  const handleLogout = () => {
    clearTokens();
    window.location.href = "/"; 
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-green-600 text-white text-center py-4 shadow">
        <h1 className="text-2xl font-bold">💬 Real-Time Chat Application</h1>
      </header>

      {/* Routes */}
      <main className="flex-1">
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
      </main>

      {/* Logout Button */}
      {isAuthenticated && (
        <footer className="text-center py-4 border-t bg-gray-100">
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </footer>
      )}
    </div>
  );
}
