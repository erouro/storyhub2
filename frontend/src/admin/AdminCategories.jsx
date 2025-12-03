import React, { useEffect, useState } from "react";
import { API, apiGet, apiPost, apiPut, apiDelete } from "../utils/api";

export default function AdminCategories() {
  const [cats, setCats] = useState([]);
  const [newName, setNewName] = useState("");

  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await apiGet("/api/categories");
    setCats(res || []);
  }

  async function createCategory() {
    if (!newName.trim()) return;
    await apiPost("/api/categories", { name: newName });
    setNewName("");
    load();
  }

  function startEdit(cat) {
    setEditId(cat.id);
    setEditName(cat.name);
  }

  async function saveEdit(id) {
    if (!editName.trim()) return;
    await apiPut(`/api/categories/${id}`, { name: editName });
    setEditId(null);
    setEditName("");
    load();
  }

  async function remove(id) {
    if (!confirm("Delete category?")) return;
    await apiDelete(`/api/categories/${id}`);
    load();
  }

  return (
    <div>
      <h2>Admin — Categories</h2>

      {/* Add category */}
      <div style={{ marginBottom: 15 }}>
        <input
          placeholder="New category name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="input"
        />
        <button className="btn-primary" onClick={createCategory}>Add</button>
      </div>

      {/* Category List */}
      {cats.map((c) => (
        <div key={c.id} className="card" style={{ marginBottom: 8 }}>
          {editId === c.id ? (
            <>
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="input"
                style={{ width: "60%", marginRight: 10 }}
              />
              <button className="btn-primary" onClick={() => saveEdit(c.id)}>
                Save
              </button>
              <button className="btn" onClick={() => setEditId(null)}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <span>{c.name}</span>

              <button className="btn" style={{ float: "right" }} onClick={() => remove(c.id)}>
                Delete
              </button>
              <button className="btn" style={{ float: "right" }} onClick={() => startEdit(c)}>
                Edit
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
