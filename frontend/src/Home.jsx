import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "./api.js";
import { useAuth } from "./AuthContext.jsx";

const FEATURES = [
  { icon: "📚", title: "Academic Library", text: "Study guides, research papers, lab manuals and digital textbooks, all in one place.", to: "/library" },
  { icon: "👥", title: "Student Groups", text: "Join groups, post your doubts and discuss with your peers.", to: "/groups" },
  { icon: "🔔", title: "Notifications", text: "Stay on top of important updates and alerts.", to: "/notifications" },
  { icon: "💝", title: "Donate", text: "Give your old books and notes a second life for other students.", to: "/donate" },
  { icon: "⭐", title: "Subscriptions", text: "Pick a Free or Premium plan and unlock more features.", to: "/subscriptions" },
  { icon: "🧪", title: "Lab Shop", text: "Lab equipment and academic items in one app.", to: "/shop" },
];

export default function Home() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ resources: 0, groups: 0, products: 0 });

  useEffect(() => {
    Promise.allSettled([api.get("/resources"), api.get("/groups"), api.get("/products")]).then(
      ([r, g, p]) => {
        setStats({
          resources: r.value?.data.length ?? 0,
          groups: g.value?.data.length ?? 0,
          products: p.value?.data.length ?? 0,
        });
      }
    );
  }, []);

  return (
    <>
      <section className="hero-wrap">
        <div className="hero-content">
          <span className="pill">✨ Student Resource Sharing and Collaboration System</span>
          <h1>Learn together.<br />Share smarter.</h1>
          <p>Find study materials, join groups and become a part of your campus community.</p>
          <div className="hero-actions">
            <Link className="btn btn-light" to="/library">Explore Library</Link>
            {user ? (
              <Link className="btn btn-ghost" to="/groups">Open Groups</Link>
            ) : (
              <Link className="btn btn-ghost" to="/login">Join Hub</Link>
            )}
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="stat"><b>{stats.resources}</b><span>Resources</span></div>
        <div className="stat"><b>{stats.groups}</b><span>Groups</span></div>
        <div className="stat"><b>{stats.products}</b><span>Shop Products</span></div>
      </section>

      <h2 className="section-title">Everything a student needs</h2>
      <section className="features">
        {FEATURES.map((f) => (
          <Link className="feature" to={f.to} key={f.title}>
            <div className="icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </Link>
        ))}
      </section>

      <h2 className="section-title">How it works</h2>
      <section className="steps">
        <div className="card step"><div className="num">1</div><h3>Register</h3><p>Create a free account in one minute.</p></div>
        <div className="card step"><div className="num">2</div><h3>Upload or Join</h3><p>Upload resources or join groups.</p></div>
        <div className="card step"><div className="num">3</div><h3>Collaborate</h3><p>Post, share and help each other.</p></div>
      </section>

      <section className="cta">
        <h2>Ready to join Campus Hub?</h2>
        <Link className="btn btn-light" to={user ? "/library" : "/login"}>
          {user ? "Go to Library" : "Get Started"}
        </Link>
      </section>
    </>
  );
}