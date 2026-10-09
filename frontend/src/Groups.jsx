import { useEffect, useState } from "react";
import api, { errorMessage } from "./api.js";
import { useAuth } from "./AuthContext.jsx";
import Alert from "./components/Alert.jsx";
import PageHeader from "./components/PageHeader.jsx";
import Empty from "./components/Empty.jsx";

export default function Groups() {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState("");
  const [newGroup, setNewGroup] = useState({ groupName: "", description: "" });
  const [selected, setSelected] = useState(null);
  const [posts, setPosts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const notify = (msg, isError = false) => {
    setMessage(isError ? "" : msg);
    setError(isError ? msg : "");
  };

  const loadGroups = async () => {
    try {
      const res = await api.get("/groups", { params: search ? { search } : {} });
      setGroups(res.data);
    } catch (err) {
      notify(errorMessage(err), true);
    }
  };

  useEffect(() => { loadGroups(); }, []);

  const openGroup = async (g) => {
    setSelected(g);
    try {
      const p = await api.get(`/posts/group/${g.id}`);
      setPosts(p.data);
      if (g.createdBy === user.id) {
        const r = await api.get(`/groups/${g.id}/requests`);
        setRequests(r.data);
      } else {
        setRequests([]);
      }
    } catch (err) {
      notify(errorMessage(err), true);
    }
  };

  const createGroup = async (e) => {
    e.preventDefault();
    try {
      await api.post("/groups", { ...newGroup, createdBy: user.id });
      setNewGroup({ groupName: "", description: "" });
      notify("Group created");
      loadGroups();
    } catch (err) {
      notify(errorMessage(err), true);
    }
  };

  const editGroup = async (g) => {
    const groupName = window.prompt("Group name", g.groupName);
    if (!groupName) return;
    const description = window.prompt("Description", g.description || "");
    try {
      await api.put(`/groups/${g.id}`, { groupName, description });
      setSelected(null);
      notify("Group updated");
      loadGroups();
    } catch (err) {
      notify(errorMessage(err), true);
    }
  };

  const deleteGroup = async (g) => {
    if (!window.confirm("Group ani tyache sagle posts delete honar. Barobar?")) return;
    try {
      await api.delete(`/groups/${g.id}`);
      setSelected(null);
      notify("Group deleted");
      loadGroups();
    } catch (err) {
      notify(errorMessage(err), true);
    }
  };

  const join = async (g) => {
    try {
      await api.post(`/groups/${g.id}/join`, null, { params: { userId: user.id } });
      notify("Join request sent. Group owner approve karel tevha tu post karu shakshil.");
    } catch (err) {
      notify(errorMessage(err), true);
    }
  };

  const decide = async (userId, status) => {
    try {
      await api.put(`/groups/${selected.id}/members/${userId}`, null, { params: { status } });
      notify(`Request ${status.toLowerCase()}`);
      openGroup(selected);
    } catch (err) {
      notify(errorMessage(err), true);
    }
  };

  const addPost = async (e) => {
    e.preventDefault();
    try {
      await api.post("/posts", { groupId: selected.id, userId: user.id, content });
      setContent("");
      notify("Post added");
      openGroup(selected);
    } catch (err) {
      notify(errorMessage(err), true);
    }
  };

  const deletePost = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      openGroup(selected);
    } catch (err) {
      notify(errorMessage(err), true);
    }
  };

  return (
    <>
      <PageHeader icon="👥" title="Student Groups" subtitle="Groups join kar, doubts post kar ani mitrancha sobat discuss kar" from="#0ea5e9" to="#7c3aed" />
      <Alert message={message} error={error} />

      <form className="card stack" onSubmit={createGroup}>
        <h3>➕ Create a group</h3>
        <input placeholder="Group name" value={newGroup.groupName} onChange={(e) => setNewGroup({ ...newGroup, groupName: e.target.value })} />
        <input placeholder="Description" value={newGroup.description} onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })} />
        <button type="submit">Create</button>
      </form>

      <form className="card toolbar" onSubmit={(e) => { e.preventDefault(); loadGroups(); }}>
        <input style={{ flex: 1 }} placeholder="🔍 Search groups..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <button type="submit">Search</button>
      </form>

      <div className="grid">
        {groups.map((g) => (
          <div className="card" key={g.id}>
            <div className="gavatar">{g.groupName?.charAt(0).toUpperCase()}</div>
            <h3>{g.groupName}</h3>
            <p className="muted">{g.description}</p>
            <div className="row">
              <button onClick={() => openGroup(g)}>Open</button>
              <button className="secondary" onClick={() => join(g)}>Request to join</button>
            </div>
          </div>
        ))}
      </div>
      {groups.length === 0 && <Empty icon="👥" text="Kahi groups nahit. Pahila group tu bana!" />}

      {selected && (
        <div className="card" style={{ marginTop: 24 }}>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <h3>💬 {selected.groupName}</h3>
            {selected.createdBy === user.id && (
              <div className="row">
                <button className="secondary" onClick={() => editGroup(selected)}>Edit</button>
                <button className="danger" onClick={() => deleteGroup(selected)}>Delete</button>
              </div>
            )}
          </div>

          {selected.createdBy === user.id && requests.length > 0 && (
            <div className="card">
              <h4>🔔 Pending join requests</h4>
              {requests.map((r) => (
                <div className="row" key={r.id} style={{ marginBottom: 8 }}>
                  <span>User #{r.userId}</span>
                  <button onClick={() => decide(r.userId, "APPROVED")}>Approve</button>
                  <button className="danger" onClick={() => decide(r.userId, "REJECTED")}>Reject</button>
                </div>
              ))}
            </div>
          )}

          <form className="stack" onSubmit={addPost}>
            <textarea rows="2" placeholder="Write a post..." value={content} onChange={(e) => setContent(e.target.value)} />
            <button type="submit">Post</button>
          </form>

          <h4 style={{ marginTop: 20 }}>Posts</h4>
          {posts.map((p) => (
            <div className="card post" key={p.id}>
              <div className="pa">{p.userId}</div>
              <div className="pb">
                <p style={{ margin: "0 0 6px" }}>{p.content}</p>
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <span className="muted">User #{p.userId} | {new Date(p.createdAt).toLocaleString()}</span>
                  {(p.userId === user.id || selected.createdBy === user.id) && (
                    <button className="danger" onClick={() => deletePost(p.id)}>Delete</button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {posts.length === 0 && <Empty icon="💬" text="Ajun kahi posts nahit." />}
        </div>
      )}
    </>
  );
}