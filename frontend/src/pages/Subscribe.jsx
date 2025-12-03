import React, { useState } from "react";
import { API } from "../utils/api";
import { useNavigate } from "react-router-dom";

function getDeviceId(){
  let id = localStorage.getItem("device_id");
  if (!id) { id = "dev-" + Math.random().toString(36).slice(2); localStorage.setItem("device_id", id); }
  return id;
}

export default function Subscribe(){
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [custom, setCustom] = useState("");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const deviceId = getDeviceId();
  const plans = { "1m":199, "3m":299, "6m":499, "12m":699 };
  const UPI_ID = "YOUR_UPI_ID_HERE"; // replace
  const QR_PATH = "/payment-qr.png"; // replace file in /public

  function chosenAmount(){
    if (selected && plans[selected]) return plans[selected];
    const n = Number(custom); return isNaN(n)||n<=0?0:n;
  }

  async function proceed(){
    const amt = chosenAmount();
    if (!amt) return setMsg("Pick a plan or enter amount");
    setMsg("Recording pending subscription...");
    try {
      const r = await fetch((API||"") + "/api/subscribers", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          type:"subscription",
          plan: selected || "custom",
          amount: amt,
          name,
          device_id: deviceId,
          payment_provider: "manual_upi"
        })
      });
      const j = await r.json();
      if (!r.ok) { setMsg(j.error || "Failed"); return; }
      setMsg("Recorded as PENDING. Pay using the QR/UPI shown, then admin will verify.");
      setTimeout(()=> navigate("/"), 1200);
    } catch(e){ setMsg("Network error"); }
  }

  return (
    <div className="container">
      <h2>Subscribe (Manual UPI)</h2>
      <p>Select a plan, pay using the QR or UPI id, then admin verifies and activates your subscription for this device.</p>

      <div style={{display:"flex",gap:20,alignItems:"flex-start"}}>
        <div style={{flex:1}}>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
            <button className={`btn ${selected==="1m"?"btn-primary":""}`} onClick={()=>setSelected("1m")}>₹199 / 1m</button>
            <button className={`btn ${selected==="3m"?"btn-primary":""}`} onClick={()=>setSelected("3m")}>₹299 / 3m</button>
            <button className={`btn ${selected==="6m"?"btn-primary":""}`} onClick={()=>setSelected("6m")}>₹499 / 6m</button>
            <button className={`btn ${selected==="12m"?"btn-primary":""}`} onClick={()=>setSelected("12m")}>₹699 / 12m</button>
          </div>

          <div style={{marginBottom:12}}>
            <input placeholder="Custom amount (optional)" value={custom} onChange={e=>{ setCustom(e.target.value); setSelected(null); }} style={{padding:8,width:"200px"}} />
          </div>

          <div style={{marginBottom:12}}>
            <input placeholder="Name (optional)" value={name} onChange={e=>setName(e.target.value)} style={{padding:8,width:"100%"}} />
          </div>

          <div>
            <button className="btn btn-primary" disabled={chosenAmount()<=0} onClick={proceed}>
              Proceed — Pay ₹{chosenAmount()||0}
            </button>
          </div>

          <div style={{marginTop:12,color:"green"}}>{msg}</div>
        </div>

        <div style={{width:320}}>
          <div className="card">
            <img src={QR_PATH} alt="qr" style={{width:"100%", borderRadius:6, marginBottom:10}} />
            <div style={{fontWeight:700}}>UPI ID: <span style={{fontWeight:400}}>{UPI_ID}</span></div>
            <div style={{marginTop:8,color:"var(--muted)",fontSize:13}}>Scan QR or use UPI app to pay. After payment, admin will verify and activate for this device.</div>
            <div style={{marginTop:10,fontSize:12,color:"#666"}}>Device ID: <code style={{background:"#f6f6f6",padding:"2px 6px"}}>{deviceId}</code></div>
          </div>
        </div>
      </div>
    </div>
  )
}
