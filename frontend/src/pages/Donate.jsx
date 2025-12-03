import React, { useState } from "react";
import { API } from "../utils/api";

export default function Donate(){
  const [name,setName] = useState("");
  const [amount,setAmount] = useState(50);
  const [msg,setMsg] = useState("");
  const presets = [10,20,50,100,200];

  async function donate(val){
    setMsg("Processing...");
    try {
      const r = await fetch((API||"") + "/api/subscribers", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ type:"donation", name, amount: val || amount })
      });
      const j = await r.json();
      if (!r.ok) { setMsg(j.error || "Failed"); return; }
      setMsg("Thank you for your donation!");
      setName(""); setAmount(50);
    } catch(e){ setMsg("Network error"); }
  }

  return (
    <div className="container">
      <h2>Donate</h2>
      <p>Your support keeps StoryHub alive.</p>

      <div style={{display:"flex", gap:10, flexWrap:"wrap", marginBottom:12}}>
        {presets.map(p => <button key={p} className="btn" onClick={()=>donate(p)}>₹{p}</button>)}
      </div>

      <div style={{marginBottom:12}}>
        <input placeholder="Name (optional)" value={name} onChange={e=>setName(e.target.value)} style={{padding:8,width:"100%",marginBottom:8}} />
        <input type="number" placeholder="Amount" value={amount} onChange={e=>setAmount(Number(e.target.value))} style={{padding:8,width:"200px"}} />
      </div>

      <div>
        <button className="btn btn-primary" onClick={()=>donate(null)}>Donate ₹{amount}</button>
      </div>

      <div style={{marginTop:12,color:"green"}}>{msg}</div>
    </div>
  )
}
