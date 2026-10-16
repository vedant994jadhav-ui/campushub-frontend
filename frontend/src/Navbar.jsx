import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(
    () => document.documentElement.getAttribute("data-theme") === "dark"
  );

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch (e) {
      // storage blocked, theme still changes for this session
    }
  };

  return (
    <nav className="navbar">
      <NavLink to="/" className="brand">🎓 Campus Hub</NavLink>

      <button className="menu-btn" onClick={() => setOpen(!open)}>☰</button>

      <div className={`links ${open ? "open" : ""}`} onClick={() => setOpen(false)}>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/library">Library</NavLink>
        <NavLink to="/groups">Groups</NavLink>
        <NavLink to="/notifications">Notifications</NavLink>
        <NavLink to="/donate">Donate</NavLink>
        <NavLink to="/subscriptions">Subscriptions</NavLink>
        <NavLink to="/shop">Shop</NavLink>
      </div>

      <div className="auth">
        <button
          className="icon-btn"
          onClick={toggleTheme}
          title={dark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {dark ? "☀️" : "🌙"}
        </button>
        {user ? (
          <>
            <div className="avatar">{user.name?.charAt(0).toUpperCase()}</div>
            <button className="secondary" onClick={() => { logout(); navigate("/"); }}>Logout</button>
          </>
        ) : (
          <NavLink to="/login" className="login-pill">Log In</NavLink>
        )}
      </div>
    </nav>
  );
}