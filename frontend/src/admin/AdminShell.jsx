import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminShell({ children }) {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("ADMIN_AUTH");
    navigate("/admin/login");
  }

  return (
    <div>
      <div
        style={{
          background: "#111",
          color: "#fff",
          padding: "12px 15px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontSize: 20, fontWeight: "bold" }}>Admin Panel</div>

        <button className="btn" onClick={logout}>
          Logout
        </button>
      </div>

      {/* Navigation */}
      <div style={{ padding: 12, background: "#eaeaea" }}>
        <Link to="/admin/stories" className="admin-link">Stories</Link>
        <Link to="/admin/categories" className="admin-link">Categories</Link>
        <Link to="/admin/subscribers" className="admin-link">Subscribers</Link>
      </div>

      {/* Page content */}
      <div style={{ padding: 15 }}>{children}</div>
    </div>
  );
}
