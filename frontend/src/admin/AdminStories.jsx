import React, { useEffect, useState } from "react";
import { API } from "../utils/api";

function authHeaders(){
  const t = localStorage.getItem("admin_token");
  return t ? { 'x-admin-token': t } : {};
}

export default function AdminStories(){
  const [stories,setStories] = useState([]);
  const [form,setForm] = useState({title:"", excerpt:"", content:"", categories:"", is_premium:false});
  const [loading,setLoading] = useState(true);

  useEffect(()=>{ load(); }, []);

  async function load(){
    setLoading(true);
    const r = await fetch((API||"") + "/api/stories");
    const j = await r.json();
    setStories(j||[]);
    setLoading(false);
  }

  async function create(e){
    e.preventDefault();
    const body = {...form, categories: form.categories.split(",").map(s=>s.trim()).filter(Boolean)};
    const r = await fetch((API||"") + "/api/stories", { method:"POST", headers:{"Content-Type":"application/json", ...authHeaders()}, body: JSON.stringify(body) });
    if (r.ok) { setForm({title:"",excerpt:"",content:"",categories:"",is_premium:false}); load(); } else alert("Failed");
  }

  async function remove(id){
    if (!confirm("Delete story?")) return;
    const r = await fetch((API||"") + "/api/stories/"+id, { method:"DELETE", headers: authHeaders() });
    if (r.ok) load();
  }

  return (
    <div className="container">
      <h2>Admin — Stories</h2>
      <form onSubmit={create} style={{marginBottom:16}}>
        <input placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} style={{width:"100%",padding:8,marginBottom:8}} />
        <input placeholder="Excerpt" value={form.excerpt} onChange={e=>setForm({...form,excerpt:e.target.value})} style={{width:"100%",padding:8,marginBottom:8}} />
        <textarea placeholder="Content" value={form.content} onChange={e=>setForm({...form,content:e.target.value})} style={{width:"100%",padding:8,height:140,marginBottom:8}} />
        <input placeholder="Categories (comma separated)" value={form.categories} onChange={e=>setForm({...form,categories:e.target.value})} style={{width:"100%",padding:8,marginBottom:8}} />
        <label><input type="checkbox" checked={form.is_premium} onChange={e=>setForm({...form,is_premium:e.target.checked})} /> Premium</label>
        <div style={{marginTop:8}}><button className="btn btn-primary" type="submit">Create</button></div>
      </form>

      <div>
        {loading ? <div>Loading...</div> : stories.map(s=>(
          <div key={s.id} className="card" style={{marginBottom:8}}>
            <strong>{s.title}</strong>
            <div style={{marginTop:8}}>{s.excerpt}</div>
            <div style={{marginTop:8}}><button onClick={()=>remove(s.id)} className="btn">Delete</button></div>
          </div>
        ))}
      </div>
    </div>
  )
}
