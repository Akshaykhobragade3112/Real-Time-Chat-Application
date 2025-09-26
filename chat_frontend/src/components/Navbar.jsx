import "../components/Navbar.css";

export default function Navbar({ onLogout }) {
  return (
    <nav className="navbar">
      <h1 className="navbar-title">ChatApp 💬 </h1>
      {onLogout && (
        <button onClick={onLogout} className="logout-btn">
          Logout
        </button>
      )}
    </nav>
  );
}
