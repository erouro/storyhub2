import React, { useEffect, useState } from "react";
import { API, apiGet } from "../utils/api";
import StoryCard from "../components/StoryCard";

export default function Home() {
  const [stories, setStories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [active, setActive] = useState(null);

  useEffect(() => {
    loadCats();
    loadStories();
  }, []);

  async function loadCats() {
    const res = await apiGet("/api/categories");
    setCategories(res || []);
  }

  async function loadStories(cat = null) {
    const url = cat ? `/api/stories?category=${encodeURIComponent(cat)}` : "/api/stories";
    const res = await apiGet(url);
    setStories(res || []);
  }

  function selectCategory(name) {
    setActive(name);
    loadStories(name);
  }

  return (
    <div>
      <h2>New Stories</h2>

      {/* Category Bar */}
      <div style={{
        display: "flex",
        overflowX: "auto",
        paddingBottom: "10px",
        marginBottom: "12px"
      }}>
        <button
          className="chip"
          onClick={() => { setActive(null); loadStories(); }}
          style={{ background: active === null ? "#000" : "#ddd", color: active === null ? "#fff" : "#000" }}
        >
          All
        </button>

        {categories.map(c => (
          <button
            key={c.id}
            className="chip"
            onClick={() => selectCategory(c.name)}
            style={{
              background: active === c.name ? "#000" : "#ddd",
              color: active === c.name ? "#fff" : "#000"
            }}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Stories */}
      <div>
        {stories.map(s => (
          <StoryCard key={s.id} story={s} />
        ))}
      </div>
    </div>
  );
}
