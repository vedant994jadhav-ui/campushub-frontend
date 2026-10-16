import { useEffect, useState } from "react";
import api, { errorMessage } from "./api.js";
import { useAuth } from "./AuthContext.jsx";
import Alert from "./components/Alert.jsx";
import PageHeader from "./components/PageHeader.jsx";
import Empty from "./components/Empty.jsx";

const CATS = ["Lab Equipment", "Stationery", "Books"];
const ICONS = { "Lab Equipment": "🔬", Stationery: "✏️", Books: "📚" };
const empty = { name: "", category: CATS[0], price: "", stock: "" };

export default function Shop() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [form, setForm] = useState(empty);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      else if (category) params.category = category;
      const res = await api.get("/products", { params });
      setProducts(res.data);
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  useEffect(() => { load(); }, [category]);

  const add = async (e) => {
    e.preventDefault();
    setError(""); setMessage("");
    try {
      await api.post("/products", {
        ...form,
        price: form.price === "" ? null : Number(form.price),
        stock: form.stock === "" ? null : Number(form.stock),
      });
      setForm(empty);
      setMessage("Product added");
      load();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  const remove = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      load();
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <>
      <PageHeader icon="🧪" title="Campus Shop" subtitle="Lab equipment and academic items" from="#0d9488" to="#6366f1" />
      <Alert message={message} error={error} />

      {isAdmin && (
        <form className="card stack" onSubmit={add}>
          <h3>🛠️ Add product (Admin)</h3>
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {CATS.map((c) => <option key={c}>{c}</option>)}
          </select>
          <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          <button type="submit">Add</button>
        </form>
      )}

      <form className="card toolbar" onSubmit={(e) => { e.preventDefault(); load(); }}>
        <input style={{ flex: 1 }} placeholder="🔍 Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <button type="submit">Search</button>
      </form>

      <div className="chips">
        <button className={`chip ${category === "" ? "active" : ""}`} onClick={() => { setSearch(""); setCategory(""); }}>All</button>
        {CATS.map((c) => (
          <button key={c} className={`chip ${category === c ? "active" : ""}`} onClick={() => { setSearch(""); setCategory(c); }}>
            {ICONS[c]} {c}
          </button>
        ))}
      </div>

      <div className="grid">
        {products.map((p) => (
          <div className="card" key={p.id}>
            <div className="thumb">{ICONS[p.category] || "🛍️"}</div>
            <span className="badge">{p.category}</span>
            <h3>{p.name}</h3>
            <div className="price-tag">₹{p.price}</div>
            <p className={p.stock > 0 ? "stock-ok" : "stock-out"}>
              {p.stock > 0 ? `● In stock (${p.stock})` : "● Out of stock"}
            </p>
            {isAdmin && <button className="danger" onClick={() => remove(p.id)}>Delete</button>}
          </div>
        ))}
      </div>
      {products.length === 0 && <Empty icon="🛍️" text="No products yet." />}
    </>
  );
}