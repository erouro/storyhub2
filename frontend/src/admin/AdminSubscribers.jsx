import React, { useEffect, useState } from "react";
import { API } from "../utils/api";
import AdminShell from "./AdminShell";

export default function AdminSubscribers() {
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const r = await fetch(`${API}/api/subscribers`);
    const j = await r.json();
    setSubs(j || []);
  }

  async function verify(id) {
    const dev = prompt("Enter device ID to bind:");
    if (!dev) return;

    await fetch(`${API}/api/subscribers/verify/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bind_device_id: dev }),
    });

    load();
  }

  async function remove(id) {
    if (!confirm("Delete record?")) return;
    await fetch(`${API}/api/subscribers/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <AdminShell>
      <h2>Subscribers & Donors</h2>

      {subs.map((s) => (
        <div key={s.id} className="card" style={{ marginBottom: 10 }}>
          <b>{s.type.toUpperCase()}</b>

          <div style={{ fontSize: 13, marginTop: 4 }}>
            {s.type === "donation" ? (
              <>
                Amount: {s.amount} /-  
                <br />
                Name: {s.name}
              </>
            ) : (
              <>
                Plan: {s.plan}  
                <br/>
                Status: {s.status}
                <br/>
                Device: {s.device_id || "Not bound"}
              </>
            )}
          </div>

          {s.type === "subscription" && s.status !== "active" && (
            <button className="btn-primary" style={{ marginTop: 10 }} onClick={() => verify(s.id)}>
              Verify Subscription
            </button>
          )}

          <button className="btn" style={{ marginTop: 10 }} onClick={() => remove(s.id)}>
            Delete
          </button>
        </div>
      ))}
    </AdminShell>
  );
}
