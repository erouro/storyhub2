import React, { useEffect, useState } from "react";
import { API } from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function SubmitStory(){
  const [form, setForm] = useState({name:"", email:"", title:"", categories:"", content:""});
  const [captcha, setCaptcha] = useState(null);
  const [msg, setMsg] = useState("");
  const nav = useNavigate();

  useEffect(()=>{ fetch((API||"") + "/api/captcha").then(r=>r.json()).then(j=>setCaptcha(j)).catch(()=>setCaptcha(null)); },[]);

  async function submit(e){
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) { setMsg("Title and content required"); return; }
    const user = window.prompt("Enter captcha result shown on form:");
    if (!user) { setMsg("Captcha required"); return; }

    try {
      const r = await fetch((API||"") + "/api/stories/submissions", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          name: form.name, email: form.email,
          title: form.title, categories: form.categories, content: form.content,
          token: captcha?.token, code: user
        })
      });
      const j = await r.json();
      if (!r.ok) { setMsg(j.error || "Failed"); return; }
      setMsg("Submitted. Admin will review.");
      setTimeout(()=>nav("/"),1200);
    } catch(e){ setMsg("Network error"); }
  }

  return (
    <div className="container">
      <h2>Submit Story</h2>
      <form onSubmit={submit}>
        <input placeholder="Your name (optional)" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} style={{padding:8,width:"100%",marginBottom:8}} />
        <input placeholder="Email (optional)" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} style={{padding:8,width:"100%",marginBottom:8}} />
        <input placeholder="Story title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} style={{padding:8,width:"100%",marginBottom:8}} />
        <input placeholder="Categories (comma separated)" value={form.categories} onChange={e=>setForm({...form, categories:e.target.value})} style={{padding:8,width:"100%",marginBottom:8}} />
        <textarea placeholder="Story content" value={form.content} onChange={e=>setForm({...form, content:e.target.value})} style={{padding:8,width:"100%",height:220,marginBottom:8}} />
        <div style={{marginBottom:8}}>
          <div style={{display:"inline-block",padding:"8px 12px",border:"1px solid var(--border)",borderRadius:8,marginRight:8,fontWeight:700}}>
            {captcha ? captcha.display || (captcha.a+" + "+captcha.b) : "..." }
          </div>
          <button type="button" onClick={()=>{ fetch((API||"") + "/api/captcha").then(r=>r.json()).then(j=>setCaptcha(j)); }} className="btn">New Code</button>
        </div>

        <div><button className="btn btn-primary" type="submit">Submit Story</button></div>
      </form>

      <div style={{marginTop:12,color:"green"}}>{msg}</div>
    </div>
  )
}
