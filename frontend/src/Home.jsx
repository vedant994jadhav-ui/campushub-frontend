import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "./api.js";
import { useAuth } from "./AuthContext.jsx";

const FEATURES = [
{ icon: "📚", title: "Academic Library", text: "Study guides, research papers, lab manuals ani digital textbooks ek ch thikani.", to: "/library" },  { icon: "👥", title: "Student Groups", text: "Groups join kar, doubts post kar ani mitrancha sobat discuss kar.", to: "/groups" },
  { icon: "🔔", title: "Notifications", text: "Mahatvache updates ani alerts kadhi miss karu nako.", to: "/notifications" },
  { icon: "💝", title: "Donate", text: "Tuzi jun books ani notes dusrya students na upyogi padu de.", to: "/donate" },
  { icon: "⭐", title: "Subscriptions", text: "Free kinva Premium plan nivad ani jast features unlock kar.", to: "/subscriptions" },
  { icon: "🧪", title: "Lab Shop", text: "Lab equipment ani academic items ek ch app madhe.", to: "/shop" },
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
          <p>Campus Hub madhe study materials shodh, groups join kar ani tuzya campus cha community cha bhag ho.</p>
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
        <div className="card step"><div className="num">1</div><h3>Register</h3><p>Free account banav, 1 minute madhe.</p></div>
        <div className="card step"><div className="num">2</div><h3>Upload or Join</h3><p>Resources upload kar kinva groups join kar.</p></div>
        <div className="card step"><div className="num">3</div><h3>Collaborate</h3><p>Post kar, share kar ani ekmekanna madat kar.</p></div>
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