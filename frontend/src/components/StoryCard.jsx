import React from "react";
import { Link } from "react-router-dom";

export default function StoryCard({ story }) {
  return (
    <Link
      to={`/story/${story.id}`}
      style={{
        display: "block",
        background: "#fff",
        marginBottom: 12,
        padding: 12,
        borderRadius: 8,
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        textDecoration: "none",
        color: "#000",
      }}
    >
      {/* Thumbnail */}
      {story.thumbnail_url && (
        <img
          src={story.thumbnail_url}
          alt=""
          style={{ width: "100%", borderRadius: 8, marginBottom: 8 }}
        />
      )}

      <h3>{story.title}</h3>
      <p style={{ color: "#555" }}>{story.excerpt}</p>

      {/* Categories */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {story.categories?.map((c, i) => (
          <span
            key={i}
            style={{
              background: "#eee",
              padding: "4px 10px",
              borderRadius: 12,
              fontSize: 12,
            }}
          >
            {c}
          </span>
        ))}
      </div>

      {/* PREMIUM BADGE */}
      {story.is_premium && (
        <span
          style={{
            marginTop: 10,
            display: "inline-block",
            background: "gold",
            color: "#000",
            padding: "4px 10px",
            borderRadius: 12,
            fontWeight: "bold",
            fontSize: 12,
          }}
        >
          Premium
        </span>
      )}
    </Link>
  );
}
