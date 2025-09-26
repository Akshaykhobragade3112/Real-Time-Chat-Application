import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import "./Signup.css";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://127.0.0.1:8000/api/auth/signup/", {
        username,
        email,
        password,
      });
      alert("Signup successful! Please login.");
      navigate("/"); // redirect to login
    } catch (err) {
      alert("Signup failed: " + (err.response?.data?.detail || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        {/* Header */}
        <div>
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>👤</div>
          <h2>Create Account</h2>
          <p>Join us and start chatting!</p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSignup}>
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

          {/* Email */}
          <div className="input-group">
            <FaEnvelope />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            {loading ? "Signing up..." : "Signup"}
          </button>
        </form>

        {/* Back to login */}
        <p>
          Already have an account?{" "}
          <button onClick={() => navigate("/")} className="link-btn">
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
