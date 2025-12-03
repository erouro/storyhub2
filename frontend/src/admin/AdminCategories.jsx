import React, { useEffect, useState } from "react";
import { API } from "../utils/api";

export default function AdminCategories(){
  const [cats,setCats] = useState([]);
  const [name,setName] = useState("");

  useEffect(()=>{ load(); }, []);

  async function load(){
    const r = await fetch((API||"") + "/api/categories");
    const j = await r.json();
    setCats(j||[]);
  }

  async function create(){
    if (!name.trim()) return;
    const r = await fetch((API||"") + "/api/categories", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ name })});
    if (r.ok) { setName(""); load(); }
  }

  async function remove(id){
    if (!confirm("Delete category?")) return;
    await fetch((API||"") + "/api/categories/"+id, { method:"DELETE" });
    load();
  }

  return (
    <div className="container">
      <h2>Admin — Categories</h2>
      <div style={{marginBottom:12}}>
        <input placeholder="Category name" value={name} onChange={e=>setName(e.target.value)} style={{padding:8,width:240,marginRight:8}} />
        <button className="btn" onClick={create}>Create</button>
      </div>
      <div>
        {cats.map(c=> <div key={c.id} className="card" style={{marginBottom:8}}>{c.name} <button style={{float:"right"}} onClick={()=>remove(c.id)} className="btn">Delete</button></div>)}
      </div>
    </div>
  )
}
