import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <NavLink to="/" className="brand">Campus Hub</NavLink>
      <div className="links">
                <NavLink to="/">home</NavLink>

        <NavLink to="/library">Library</NavLink>
        <NavLink to="/groups">Groups</NavLink>
        <NavLink to="/notifications">Notifications</NavLink>
        <NavLink to="/donate">Donate</NavLink>
        <NavLink to="/subscriptions">Subscriptions</NavLink>
        <NavLink to="/shop">Shop</NavLink>
      </div>
      <div className="auth">
        {user ? (
          <>
            <span>Hi, {user.name}</span>
            <button onClick={() => { logout(); navigate("/"); }}>Logout</button>
          </>
        ) : (
          <NavLink to="/login">Log In</NavLink>
        )}
      </div>
    </nav>
  );
}