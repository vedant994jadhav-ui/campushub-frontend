import { useEffect, useState } from "react";
import api, { errorMessage } from "./api.js";
import { useAuth } from "./AuthContext.jsx";
import Alert from "./components/Alert.jsx";
import PageHeader from "./components/PageHeader.jsx";
import Empty from "./components/Empty.jsx";

export default function Donate() {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [details, setDetails] = useState("");
  const [resourceId, setResourceId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
  // Temporary mock data backend connect hoiparyant
  setItems([
    { id: 1, title: "Welcome to CampusHub!", message: "Your account is active.", read: false },
    { id: 2, title: "Assignment Reminder", message: "Submit Java project by tomorrow.", read: true }
  ]);
};

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setMessage("");
    try {
      await api.post("/donations", {
        userId: user.id,
        details,
        resourceId: resourceId ? Number(resourceId) : null,
      });
      setDetails(""); setResourceId("");
      setMessage("Thank you for your donation! 💝");
      load();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/donations/${id}`);
      load();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <>
      <PageHeader icon="💝" title="Donate" subtitle="Tuzya jun books, notes ani equipment dusrya students na de" from="#ec4899" to="#f97316" />
      <Alert message={message} error={error} />

      <div className="two-col">
        <form className="card stack" onSubmit={submit}>
          <h3>🎁 New donation</h3>
          <textarea rows="4" placeholder="Kay donate karaychay? (jase notes, books, equipment)" value={details} onChange={(e) => setDetails(e.target.value)} />
          <input placeholder="Resource ID (optional)" value={resourceId} onChange={(e) => setResourceId(e.target.value)} />
          <button type="submit">Donate</button>
        </form>

        <div>
          <h3>My donations ({donations.length})</h3>
          {donations.map((d) => (
            <div className="card" key={d.id}>
              <p style={{ marginTop: 0 }}>💝 {d.details}</p>
              <div className="row" style={{ justifyContent: "space-between" }}>
                <span className="muted">{new Date(d.createdAt).toLocaleString()}</span>
                <button className="danger" onClick={() => remove(d.id)}>Delete</button>
              </div>
            </div>
          ))}
          {donations.length === 0 && <Empty icon="🎁" text="Ajun donations nahit." />}
        </div>
      </div>
    </>
  );
}