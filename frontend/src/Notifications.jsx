import { useEffect, useState } from "react";
import api, { errorMessage } from "./api.js";
import { useAuth } from "./AuthContext.jsx";
import Alert from "./components/Alert.jsx";
import PageHeader from "./components/PageHeader.jsx";
import Empty from "./components/Empty.jsx";

export default function Notifications() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await api.get(`/notifications/${user.id}`);
      setItems(res.data);
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      load();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const create = async (e) => {
    e.preventDefault();
    try {
      await api.post("/notifications", { userId: user.id, message: text });
      setText("");
      setError("");
      load();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const unread = items.filter((n) => n.status === "UNREAD").length;

  return (
    <>
      <PageHeader icon="🔔" title="Notifications" subtitle={`You have ${unread} new notification(s)`} from="#f59e0b" to="#ec4899" />
      <Alert error={error} />

      <form className="card toolbar" onSubmit={create}>
        <input style={{ flex: 1 }} placeholder="Write a test notification (for demo)" value={text} onChange={(e) => setText(e.target.value)} />
        <button type="submit">Add</button>
      </form>

      {items.map((n) => (
        <div className={`card ${n.status === "UNREAD" ? "unread" : ""}`} key={n.id}>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <div className="row">
              <span style={{ fontSize: 26 }}>{n.status === "UNREAD" ? "🔔" : "✅"}</span>
              <div>
                <b>{n.message}</b>
                <div className="muted">{new Date(n.createdAt).toLocaleString()}</div>
              </div>
            </div>
            {n.status === "UNREAD" && <button onClick={() => markRead(n.id)}>Mark as read</button>}
          </div>
        </div>
      ))}
      {items.length === 0 && <Empty icon="🔕" text="No notifications yet." />}
    </>
  );
}