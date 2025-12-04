import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API } from "../utils/api";

export default function Header() {
  const [cats, setCats] = useState([]);
  const [open, setOpen] = useState(false); // category dropdown

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const r = await fetch(`${API}/api/categories`);
    const j = await r.json();
    setCats(j || []);
  }

  return (
    <div>
      {/* TOP BAR */}
      <div
        style={{
          background: "#111",
          color: "#fff",
          padding: "12px 15px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* SITE NAME */}
        <Link to="/" style={{ color: "#fff", fontSize: 20, fontWeight: "bold", textDecoration: "none" }}>
          StoryHub
        </Link>

        {/* RIGHT BUTTONS */}
        <div style={{ display: "flex", gap: 15 }}>
          <Link to="/donate" style={{ color: "yellow", textDecoration: "none" }}>
            Donate
          </Link>

          <Link to="/subscribe" style={{ color: "cyan", textDecoration: "none" }}>
            Subscribe
          </Link>
        </div>
      </div>

      {/* MENU BAR */}
      <div style={{ background: "#eee", padding: "10px", display: "flex", gap: 15 }}>
        <Link to="/" className="menu-link">Home</Link>
        <Link to="/new" className="menu-link">New Stories</Link>
        <Link to="/popular" className="menu-link">Popular</Link>

        {/* CATEGORY DROPDOWN */}
        <span
          className="menu-link"
          style={{ cursor: "pointer" }}
          onClick={() => setOpen(!open)}
        >
          Categories ▾
        </span>
      </div>

      {/* CATEGORY DROPDOWN LIST */}
      {open && (
        <div
          style={{
            background: "#fff",
            borderBottom: "1px solid #ddd",
            padding: 10,
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          {cats.map((c) => (
            <Link
              key={c.id}
              to={`/category/${encodeURIComponent(c.name)}`}
              className="chip"
              style={{
                background: "#ddd",
                padding: "6px 12px",
                borderRadius: 20,
                textDecoration: "none",
                color: "#000",
              }}
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
