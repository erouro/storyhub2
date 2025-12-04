import React, { useEffect, useState } from "react";
import { API } from "../utils/api";
import AdminShell from "./AdminShell";

export default function AdminStories() {
  const [stories, setStories] = useState([]);
  const [cats, setCats] = useState([]);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [selectedCats, setSelectedCats] = useState([]);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    loadStories();
    loadCategories();
  }, []);

  async function loadStories() {
    const r = await fetch(`${API}/api/stories`);
    const j = await r.json();
    setStories(j || []);
  }

  async function loadCategories() {
    const r = await fetch(`${API}/api/categories`);
    const j = await r.json();
    setCats(j || []);
  }

  function toggleCat(name) {
    if (selectedCats.includes(name))
      setSelectedCats(selectedCats.filter((x) => x !== name));
    else setSelectedCats([...selectedCats, name]);
  }

  async function createStory() {
    if (!title.trim()) return alert("Title required");

    const r = await fetch(`${API}/api/stories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        excerpt,
        content,
        thumbnail_url: thumbnail,
        categories: selectedCats,
        is_premium: isPremium,
      }),
    });

    if (r.ok) {
      alert("Story created");
      setTitle("");
      setExcerpt("");
      setContent("");
      setThumbnail("");
      setSelectedCats([]);
      setIsPremium(false);
      loadStories();
    }
  }

  async function remove(id) {
    if (!confirm("Delete story?")) return;

    await fetch(`${API}/api/stories/${id}`, { method: "DELETE" });
    loadStories();
  }

  return (
    <AdminShell>
      <h2>Manage Stories</h2>

      {/* CREATE STORY FORM */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h3>Add Story</h3>

        <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />

        <input className="input" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Excerpt" />

        <input className="input" value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} placeholder="Thumbnail URL" />

        <textarea className="textarea" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content"></textarea>

        <h4>Select Categories</h4>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {cats.map((c) => (
            <button
              key={c.id}
              className="chip"
              onClick={() => toggleCat(c.name)}
              style={{
                background: selectedCats.includes(c.name) ? "#000" : "#ddd",
                color: selectedCats.includes(c.name) ? "#fff" : "#000",
              }}
            >
              {c.name}
            </button>
          ))}
        </div>

        <label style={{ marginTop: 10 }}>
          <input type="checkbox" checked={isPremium} onChange={() => setIsPremium(!isPremium)} />
          &nbsp; Premium Story
        </label>

        <button className="btn-primary" onClick={createStory} style={{ marginTop: 15 }}>
          Add Story
        </button>
      </div>

      {/* STORY LIST */}
      <h3>All Stories</h3>
      {stories.map((s) => (
        <div key={s.id} className="card" style={{ marginBottom: 10 }}>
          <div><b>{s.title}</b></div>
          <div style={{ fontSize: 13, color: "#555" }}>{s.categories?.join(", ")}</div>

          {s.is_premium && <span className="badge" style={{ background: "gold", color: "#000" }}>Premium</span>}

          <button className="btn" style={{ float: "right" }} onClick={() => remove(s.id)}>
            Delete
          </button>
        </div>
      ))}
    </AdminShell>
  );
}
