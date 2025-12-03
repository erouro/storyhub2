import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { API, apiFetch } from "../utils/api";

function getDeviceId(){
  let id = localStorage.getItem("device_id");
  if (!id) { id = "dev-" + Math.random().toString(36).slice(2); localStorage.setItem("device_id", id); }
  return id;
}

export default function Header(){
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [search, setSearch] = useState("");
  const loc = useLocation();

  useEffect(()=>{
    const dev = getDeviceId();
    fetch((API||"") + "/api/subscribers/check?device_id=" + encodeURIComponent(dev))
      .then(r=>r.json())
      .then(j=> setIsPremium(!!j.active))
      .catch(()=> setIsPremium(false));
  }, [loc]);

  return (
    <>
      <div className="container" style={{paddingTop:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:16}}>
          {/* left: site title */}
          <div>
            <Link to="/" style={{textDecoration:"none", color:"inherit"}}>
              <h1 className="header-title" style={{margin:0}}>StoryHub</h1>
            </Link>
            <div className="header-sub" style={{marginTop:6}}>
              <Link to="/donate" style={{marginRight:12}}>Donate</Link>
              <Link to="/subscribe">Subscribe</Link>
            </div>
          </div>

          {/* center: nav */}
          <div style={{flex:1, textAlign:"center"}}>
            <nav className="nav" style={{justifyContent:"center"}}>
              <Link to="/" style={{padding:"6px 10px"}}>Home</Link>
              <Link to="/?category=New%20Arrival" style={{padding:"6px 10px"}}>New Stories</Link>
              <Link to="/popular" style={{padding:"6px 10px"}}>Popular</Link>
              <Link to="/submit-story" style={{padding:"6px 10px"}}>Submit Story</Link>
              <Link to="/premium-stories" style={{padding:"6px 10px"}}>
                Premium Stories {isPremium ? null : <span className="lock">🔒</span>}
              </Link>
            </nav>
          </div>

          {/* right: search + menu */}
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <input className="search-input" placeholder="Search stories..." value={search} onChange={(e)=>setSearch(e.target.value)} style={{width:220}} onKeyDown={(e)=>{ if(e.key==="Enter"){ window.location = "/?q="+encodeURIComponent(search); }}} />
            <button className="menu-three" onClick={()=>setDrawerOpen(true)}>⋮</button>
          </div>
        </div>
      </div>

      {drawerOpen && <div className="backdrop" onClick={()=>setDrawerOpen(false)}></div>}
      <div className="slide-drawer" style={{transform: drawerOpen ? "translateX(0%)":"translateX(-110%)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <strong>Menu</strong>
          <button className="menu-three" onClick={()=>setDrawerOpen(false)}>✕</button>
        </div>
        <div style={{marginTop:18, display:"flex", flexDirection:"column", gap:10}}>
          <Link to="/" onClick={()=>setDrawerOpen(false)}>Home</Link>
          <Link to="/?category=New%20Arrival" onClick={()=>setDrawerOpen(false)}>New Stories</Link>
          <Link to="/popular" onClick={()=>setDrawerOpen(false)}>Popular</Link>
          <Link to="/donate" onClick={()=>setDrawerOpen(false)}>Donate</Link>
          <Link to="/subscribe" onClick={()=>setDrawerOpen(false)}>Subscribe</Link>
          <Link to="/submit-story" onClick={()=>setDrawerOpen(false)}>Submit Story</Link>
          <Link to="/admin/login" onClick={()=>setDrawerOpen(false)}>Admin</Link>
        </div>
      </div>
    </>
  )
}
