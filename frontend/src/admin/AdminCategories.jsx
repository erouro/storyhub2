import React, { useEffect, useState } from "react";
import { API } from "../utils/api";
import AdminShell from "./AdminShell";

export default function AdminCategories() {
  const [cats, setCats] = useState([]);
  const [newName, setNewName] = useState("");

  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const r = await fetch(`${API}/api/categories`);
    const j = await r.json();
    setCats(j || []);
  }

  async function createCat() {
    if (!newName.trim()) return;

    await fetch(`${API}/api/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });

    setNewName("");
    load();
  }

  async function saveEdit(id) {
    if (!editName.trim()) return;

    await fetch(`${API}/api/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName }),
    });

    setEditId(null);
    setEditName("");
    load();
  }

  async function remove(id) {
    if (!confirm("Delete category?")) return;
    await fetch(`${API}/api/categories/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <AdminShell>
      <h2>Manage Categories</h2>

      {/* Add category */}
      <div className="card" style={{ marginBottom: 20 }}>
        <input
          className="input"
          placeholder="New category"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button className="btn-primary" onClick={createCat} style={{ marginTop: 10 }}>
          Add
        </button>
      </div>

      {/* List */}
      {cats.map((c) => (
        <div key={c.id} className="card" style={{ marginBottom: 10 }}>
          {editId === c.id ? (
            <>
              <input
                className="input"
                style={{ width: "60%", marginBottom: 10 }}
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
              <button className="btn-primary" onClick={() => saveEdit(c.id)}>Save</button>
              <button className="btn" onClick={() => setEditId(null)}>Cancel</button>
            </>
          ) : (
            <>
              <b>{c.name}</b>
              <button className="btn" style={{ float: "right" }} onClick={() => remove(c.id)}>
                Delete
              </button>
              <button className="btn" style={{ float: "right" }} onClick={() => { setEditId(c.id); setEditName(c.name); }}>
                Edit
              </button>
            </>
          )}
        </div>
      ))}
    </AdminShell>
  );
}
