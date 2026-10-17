import { useEffect, useState } from "react";
import api, { errorMessage } from "./api.js";
import { useAuth } from "./AuthContext.jsx";
import Alert from "./components/Alert.jsx";
import PageHeader from "./components/PageHeader.jsx";
import Empty from "./components/Empty.jsx";

const TYPES = ["Study Guide", "Research Paper", "Lab Manual", "Digital Textbook", "Study Tool"];
const ICONS = {
  "Study Guide": "📘",
  "Research Paper": "🔬",
  "Lab Manual": "🧪",
  "Digital Textbook": "📖",
  "Study Tool": "🛠️",
};
const empty = { title: "", type: TYPES[0], description: "", fileUrl: "" };

export default function Library() {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [form, setForm] = useState(empty);
  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      else if (type) params.type = type;
      const res = await api.get("/resources", { params });
      setResources(res.data);
    } catch (err) {
      setError(errorMessage(err));
    }
  };

// Aadhicha delete function kadhun ha purna code taka:
const handleDelete = async (id) => {
  try {
    // 1. Backend vardustun item delete kara
    await axios.delete(`https://campushub-api-znud.onrender.com/api/resources/${id}`);
    
    // 2. MAHATVACHI GOST: Delete zalyanantar list parat refresh करा
    await load(); 
    
    setMessage("Item successfully delete zala!");
  } catch (err) {
    console.error("Delete failure:", err);
    setError(errorMessage(err));
  }
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setMessage("");
    try {
      let fileUrl = form.fileUrl;
      if (file) {
        const data = new FormData();
        data.append("file", file);
        const up = await api.post("/files/upload", data);
        fileUrl = up.data.fileUrl;
      }
      const body = { ...form, fileUrl, userId: user.id };
      if (editingId) {
        await api.put(`/resources/${editingId}`, body);
        setMessage("Resource updated");
      } else {
        await api.post("/resources", body);
        setMessage("Resource added");
      }
      setForm(empty); setFile(null); setEditingId(null);
      e.target.reset();
      load();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const startEdit = (r) => {
    setEditingId(r.id);
    setForm({ title: r.title, type: r.type, description: r.description || "", fileUrl: r.fileUrl || "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this resource?")) return;
    try {
      await api.delete(`/resources/${id}`);
      setMessage("Resource deleted");
      load();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <>
      <PageHeader icon="📚" title="Academic Library" subtitle="Study guides, research papers, lab manuals and digital textbooks" from="#4f46e5" to="#06b6d4" />
      <Alert message={message} error={error} />

      {user ? (
        <form className="card stack" onSubmit={handleSubmit}>
          <h3>{editingId ? "✏️ Edit resource" : "⬆️ Upload a resource"}</h3>
          <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            {TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
          <textarea rows="3" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <div className="row">
            <button type="submit">{editingId ? "Update" : "Upload"}</button>
            {editingId && (
              <button type="button" className="secondary" onClick={() => { setEditingId(null); setForm(empty); setFile(null); }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      ) : (
        <div className="msg ok">🔐 Please log in to upload a resource.</div>
      )}

      <form className="card toolbar" onSubmit={(e) => { e.preventDefault(); load(); }}>
        <input style={{ flex: 1 }} placeholder="🔍 Search by title..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <button type="submit">Search</button>
      </form>

      <div className="chips">
        <button className={`chip ${type === "" ? "active" : ""}`} onClick={() => { setSearch(""); setType(""); }}>All</button>
        {TYPES.map((t) => (
          <button key={t} className={`chip ${type === t ? "active" : ""}`} onClick={() => { setSearch(""); setType(t); }}>
            {ICONS[t]} {t}
          </button>
        ))}
      </div>

      <div className="grid">
        {resources.map((r) => (
          <div className="card" key={r.id}>
            <div className="thumb">{ICONS[r.type] || "📄"}</div>
            <span className="badge">{r.type}</span>
            <h3>{r.title}</h3>
            <p className="muted">{r.description}</p>
            <div className="row">
              {r.fileUrl && <a className="btn" href={r.fileUrl} target="_blank" rel="noreferrer">Open</a>}
              {user && (user.id === r.userId || user.role === "ADMIN") && (
                <>
                  <button className="secondary" onClick={() => startEdit(r)}>Edit</button>
                  <button className="danger" onClick={() => remove(r.id)}>Delete</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      {resources.length === 0 && <Empty icon="📭" text="No resources yet. Be the first to upload one!" />}
    </>
  );
}