import React, { useEffect, useState } from "react";
import { API } from "../utils/api";

export default function AdminCategories(){
  const [cats,setCats] = useState([]);
  const [name,setName] = useState("");
  const [editingId,setEditingId] = useState(null);
  const [editName,setEditName] = useState("");

  useEffect(()=>{ load(); }, []);

  async function load(){
    const r = await fetch((API||"") + "/api/categories");
    const j = await r.json();
    setCats(j||[]);
  }

  // CREATE
  async function create(){
    if (!name.trim()) return;
    const r = await fetch((API||"") + "/api/categories", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ name })
    });
    if (r.ok) { setName(""); load(); }
  }

  // DELETE
  async function remove(id){
    if (!confirm("Delete category?")) return;
    await fetch((API||"") + "/api/categories/"+id, { method:"DELETE" });
    load();
  }

  // ENTER EDIT MODE
  function startEdit(cat){
    setEditingId(cat.id);
    setEditName(cat.name);
  }

  // SAVE EDIT
  async function saveEdit(id){
    if (!editName.trim()) return;
    const r = await fetch((API||"") + "/api/categories/"+id, {
      method:"PUT",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ name: editName })
    });
    if (r.ok) {
      setEditingId(null);
      setEditName("");
      load();
    }
  }

  return (
    <div className="container">
      <h2>Admin — Categories</h2>

      {/* ADD CATEGORY */}
      <div style={{marginBottom:12}}>
        <input
          placeholder="New category"
          value={name}
          onChange={e=>setName(e.target.value)}
          style={{padding:8,width:240,marginRight:8}}
        />
        <button className="btn" onClick={create}>Add</button>
      </div>

      {/* CATEGORY LIST */}
      <div>
        {cats.map(c=> (
          <div key={c.id} className="card" style={{marginBottom:8}}>
            
            {editingId === c.id ? (
              <>
                <input
                  value={editName}
                  onChange={e=>setEditName(e.target.value)}
                  style={{padding:6,width:"60%",marginRight:8}}
                />
                <button className="btn btn-primary" onClick={()=>saveEdit(c.id)}>Save</button>
                <button className="btn" onClick={()=>setEditingId(null)} style={{marginLeft:6}}>Cancel</button>
              </>
            ) : (
              <>
                {c.name}
                <button className="btn" style={{float:"right",marginLeft:6}} onClick={()=>remove(c.id)}>Delete</button>
                <button className="btn" style={{float:"right"}} onClick={()=>startEdit(c)}>Edit</button>
              </>
            )}

          </div>
        ))}
      </div>
    </div>
  )
}
