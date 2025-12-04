import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API } from "../utils/api";
import StoryCard from "../components/StoryCard";

export default function CategoryPage() {
  const { name } = useParams();
  const [stories, setStories] = useState([]);

  useEffect(() => {
    load();
  }, [name]);

  async function load() {
    const r = await fetch(`${API}/api/stories?category=${name}`);
    const j = await r.json();
    setStories(j || []);
  }

  return (
    <div style={{ padding: 15 }}>
      <h2>{name} Stories</h2>

      <div style={{ marginTop: 15 }}>
        {stories.map((s) => (
          <StoryCard key={s.id} story={s} />
        ))}
      </div>
    </div>
  );
}
