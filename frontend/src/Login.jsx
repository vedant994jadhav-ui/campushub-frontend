import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { errorMessage } from "./api.js";
import { useAuth } from "./AuthContext.jsx";
import Alert from "./components/Alert.jsx";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const url = isRegister ? "/auth/register" : "/auth/login";
      const body = isRegister ? form : { email: form.email, password: form.password };
      const res = await api.post(url, body);
      login(res.data);
      navigate("/library");
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-side">
        <h1>🎓 Campus Hub</h1>
        <p>Your campus digital community.</p>
        <ul>
          <li>📚 Upload and download study materials</li>
          <li>👥 Discuss in student groups</li>
          <li>🔔 Notifications and updates</li>
          <li>🧪 Lab equipment shop</li>
        </ul>
      </div>

      <form className="auth-form stack" onSubmit={handleSubmit}>
        <h2>{isRegister ? "Create account" : "Welcome back 👋"}</h2>
        <Alert error={error} />
        {isRegister && <input name="name" placeholder="👤 Name" value={form.name} onChange={handleChange} />}
        <input name="email" placeholder="✉️ Email" value={form.email} onChange={handleChange} />
        <input name="password" type="password" placeholder="🔒 Password" value={form.password} onChange={handleChange} />
        <button type="submit">{isRegister ? "Register" : "Log In"}</button>
        <button type="button" className="secondary" onClick={() => { setIsRegister(!isRegister); setError(""); }}>
          {isRegister ? "Already have an account? Log In" : "New user? Register"}
        </button>
      </form>
    </div>
  );
}