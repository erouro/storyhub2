import React, { useEffect, useState } from "react";
import { API, apiGet, apiPost } from "../utils/api";

export default function SubmitStory() {
  const [cats, setCats] = useState([]);
  const [selected, setSelected] = useState([]);
  const [captcha, setCaptcha] = useState(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const cs = await apiGet("/api/categories");
    setCats(cs || []);

    const cap = await apiGet("/api/captcha");
    setCaptcha(cap);
  }

  function toggleCategory(name) {
    if (selected.includes(name))
      setSelected(selected.filter((x) => x !== name));
    else setSelected([...selected, name]);
  }

  async function submit() {
    if (!title.trim()) return alert("Title required");
    if (!content.trim()) return alert("Content required");

    const ans = Number(prompt(`What is ${captcha.a} + ${captcha.b}?`));
    if (isNaN(ans)) return alert("Invalid captcha");

    const res = await apiPost("/api/submit-story", {
      title,
      content,
      categories: selected,
      captcha_answer: ans,
    });

    if (res.ok) {
      alert("Story submitted!");
      setTitle("");
      setContent("");
      setSelected([]);
      load();
    } else {
      alert(res.error || "Error");
    }
  }

  return (
    <div>
      <h2>Submit Story</h2>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input"
      />

      <textarea
        placeholder="Story Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="textarea"
      />

      <h3>Select Categories</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {cats.map((c) => (
          <button
            key={c.id}
            onClick={() => toggleCategory(c.name)}
            className="chip"
            style={{
              background: selected.includes(c.name) ? "#000" : "#ddd",
              color: selected.includes(c.name) ? "#fff" : "#000",
            }}
          >
            {c.name}
          </button>
        ))}
      </div>

      <button className="btn-primary" onClick={submit} style={{ marginTop: 20 }}>
        Submit Story
      </button>
    </div>
  );
}
