import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaLock } from "react-icons/fa";
import "./Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/auth/token/", {
        username,
        password,
      });
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      navigate("/rooms");
      window.location.reload();
    } catch (error) {
      alert("Login failed: " + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        {/* Header */}
        <div>
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>💬</div>
          <h2>Welcome Back</h2>
          <p>Login to continue chatting</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          {/* Username */}
          <div className="input-group">
            <FaUser />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="auth-input"
            />
          </div>

          {/* Password */}
          <div className="input-group">
            <FaLock />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="auth-input"
            />
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Signup link */}
        <p>
          Don’t have an account?{" "}
          <button onClick={() => navigate("/signup")} className="link-btn">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
