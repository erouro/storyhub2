import React, { useEffect, useState } from "react";
import { API } from "../utils/api";

function getDeviceId() {
  let id = localStorage.getItem("device_id");
  if (!id) { id = "dev-" + Math.random().toString(36).slice(2); localStorage.setItem("device_id", id); }
  return id;
}

export default function PremiumStories(){
  const [allowed, setAllowed] = useState(null);
  const [stories, setStories] = useState([]);

  useEffect(()=>{
    const dev = getDeviceId();
    fetch((API||"") + "/api/subscribers/check?device_id=" + encodeURIComponent(dev))
      .then(r=>r.json())
      .then(j=>{
        if (j.active) {
          setAllowed(true);
          fetch((API||"") + "/api/stories").then(r=>r.json()).then(all=>{
            setStories((all||[]).filter(s=>s.is_premium));
          });
        } else setAllowed(false);
      })
      .catch(()=>setAllowed(false));
  },[]);

  if (allowed === null) return <div className="container">Checking subscription...</div>;
  if (!allowed) return <div className="container"><h3>Premium locked 🔒</h3><p>Please subscribe to view premium stories. <a href="/subscribe">Subscribe</a></p></div>;

  return (
    <div className="container">
      <h2>Premium Stories</h2>
      {stories.length===0 ? <div>No premium stories yet.</div> : stories.map(s=>(
        <article key={s.id} className="card" style={{marginBottom:8}}>
          <h4>{s.title}</h4>
          <p style={{margin:0,color:"var(--muted)"}}>{s.excerpt}</p>
        </article>
      ))}
    </div>
  )
}
