import { useEffect, useState } from "react";
import api, { errorMessage } from "./api.js";
import { useAuth } from "./AuthContext.jsx";
import Alert from "./components/Alert.jsx";
import PageHeader from "./components/PageHeader.jsx";
import Empty from "./components/Empty.jsx";
import { Navigate } from "react-router-dom";

const PLANS = [
  { name: "FREE", price: "₹0", note: "Forever free", features: ["✅ Library access", "✅ Join groups", "❌ Priority notifications"] },
  { name: "PREMIUM", price: "₹99", note: "per month", popular: true, features: ["✅ Library access", "✅ Join groups", "✅ Priority notifications"] },
];

export default function Subscriptions() {
  const { user } = useAuth();
  const [subs, setSubs] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await api.get(`/subscriptions/user/${user.id}`);
      setSubs(res.data);
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  useEffect(() => { if (user) load(); }, []);

  const subscribe = async (plan) => {
    setError(""); setMessage("");
    try {
      await api.post("/subscriptions", { userId: user.id, plan });
      setMessage(`Subscribed to ${plan} 🎉`);
      load();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const changeStatus = async (s, status) => {
    try {
      await api.put(`/subscriptions/${s.id}`, { plan: s.plan, status });
      load();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

if (!user) return <Navigate to="/login" replace />;

  return (
    <>
      <PageHeader icon="⭐" title="Subscriptions" subtitle="Pick the plan that suits you" from="#7c3aed" to="#f59e0b" />
      <Alert message={message} error={error} />

      <div className="plans">
        {PLANS.map((p) => (
          <div className={`plan ${p.popular ? "popular" : ""}`} key={p.name}>
            {p.popular && <span className="ribbon">⭐ Most popular</span>}
            <h3>{p.name}</h3>
            <div className="price">{p.price}</div>
            <div className="muted">{p.note}</div>
            <ul>
              {p.features.map((f) => <li key={f}>{f}</li>)}
            </ul>
            <button onClick={() => subscribe(p.name)}>Subscribe</button>
          </div>
        ))}
      </div>

      <h3>My subscriptions</h3>
      {subs.map((s) => (
        <div className="card row" key={s.id} style={{ justifyContent: "space-between" }}>
          <span>
            {s.plan === "PREMIUM" ? "⭐" : "🆓"} <b>{s.plan}</b> <span className="badge">{s.status}</span>
          </span>
          {s.status === "ACTIVE" ? (
            <button className="danger" onClick={() => changeStatus(s, "CANCELLED")}>Cancel</button>
          ) : (
            <button onClick={() => changeStatus(s, "ACTIVE")}>Reactivate</button>
          )}
        </div>
      ))}
      {subs.length === 0 && <Empty icon="⭐" text="No subscriptions yet." />}
    </>
  );
}