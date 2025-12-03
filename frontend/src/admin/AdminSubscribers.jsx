import React, { useEffect, useState } from "react";
import { API } from "../utils/api";

export default function AdminSubscribers(){
  const [subs,setSubs] = useState([]);
  const [donors,setDonors] = useState([]);

  useEffect(()=>{ load(); }, []);

  async function load(){
    const s = await fetch((API||"") + "/api/subscribers?type=subscription").then(r=>r.json());
    const d = await fetch((API||"") + "/api/subscribers?type=donation").then(r=>r.json());
    setSubs(s||[]); setDonors(d||[]);
  }

  async function verify(id){
    const bind = window.prompt("Enter device ID to bind (or leave empty):");
    const r = await fetch((API||"") + "/api/subscribers/verify/"+id, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ action:"verify", bind_device_id: bind })});
    if (r.ok) load();
  }

  async function revoke(id){
    if (!confirm("Revoke subscription?")) return;
    const r = await fetch((API||"") + "/api/subscribers/verify/"+id, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ action:"revoke" })});
    if (r.ok) load();
  }

  async function remove(id){
    if (!confirm("Delete record?")) return;
    await fetch((API||"") + "/api/subscribers/"+id, { method:"DELETE" });
    load();
  }

  return (
    <div className="container">
      <h2>Subscribers</h2>
      <table style={{width:"100%",borderCollapse:"collapse",marginBottom:20}}>
        <thead><tr><th>Plan</th><th>Name</th><th>Device</th><th>Status</th><th>Created</th><th>Actions</th></tr></thead>
        <tbody>
          {subs.map(s=> <tr key={s.id} style={{borderBottom:"1px solid var(--border)"}}>
            <td>{s.plan}</td>
            <td>{s.name}</td>
            <td>{s.device_id}</td>
            <td>{s.status}</td>
            <td>{new Date(s.created_at).toLocaleString()}</td>
            <td>
              {s.status!=="active" && <button className="btn" onClick={()=>verify(s.id)}>Verify</button>}
              {s.status==="active" && <button className="btn" onClick={()=>revoke(s.id)}>Revoke</button>}
              <button className="btn" onClick={()=>remove(s.id)} style={{marginLeft:8}}>Delete</button>
            </td>
          </tr>)}
        </tbody>
      </table>

      <h2>Donors</h2>
      <table style={{width:"100%",borderCollapse:"collapse"}}>
        <thead><tr><th>Name</th><th>Amount</th><th>Created</th><th>Actions</th></tr></thead>
        <tbody>
          {donors.map(d=> <tr key={d.id} style={{borderBottom:"1px solid var(--border)"}}>
            <td>{d.name}</td>
            <td>₹{d.amount}</td>
            <td>{new Date(d.created_at).toLocaleString()}</td>
            <td><button className="btn" onClick={()=>remove(d.id)}>Delete</button></td>
          </tr>)}
        </tbody>
      </table>
    </div>
  )
}
