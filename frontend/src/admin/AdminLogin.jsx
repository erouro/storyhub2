import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ADMIN_PIN = "941575"; // <- change here if needed

export default function AdminLogin(){
  const [pin,setPin] = useState("");
  const [err,setErr] = useState("");
  const nav = useNavigate();

  function submit(e){
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      localStorage.setItem("admin_token", "ok-"+Date.now());
      nav("/admin/stories");
    } else {
      setErr("Wrong PIN");
    }
  }

  return (
    <div className="container">
      <h2>Admin Login</h2>
      <form onSubmit={submit}>
        <input placeholder="Enter admin PIN" value={pin} onChange={e=>setPin(e.target.value)} style={{padding:8,width:200,marginBottom:8}} />
        <div><button className="btn btn-primary" type="submit">Login</button></div>
      </form>
      {err && <div style={{color:"red",marginTop:8}}>{err}</div>}
    </div>
  )
}
