import React from "react";
import { Link } from "react-router-dom";

export default function StoryCard({ story }) {
  return (
    <Link to={`/story/${story.id}`} className="story-card">
      <img
        src={story.thumbnail_url || "/default-thumb.jpg"}
        className="story-thumb"
      />

      <div className="story-title">{story.title}</div>

      <div style={{ marginTop: 6 }}>
        {(story.categories || []).map(c => (
          <span key={c} className="badge">{c}</span>
        ))}
      </div>

      {story.is_premium && <span className="premium-badge">Premium 🔒</span>}
    </Link>
  );
}
