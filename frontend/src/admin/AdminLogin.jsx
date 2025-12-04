
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [pin, setPin] = useState("");
  const navigate = useNavigate();

  function login() {
    if (pin === "941575") {
      localStorage.setItem("ADMIN_AUTH", "true");
      navigate("/admin/stories");
    } else {
      alert("Incorrect PIN");
    }
  }

  return (
    <div style={{ maxWidth: 320, margin: "60px auto", textAlign: "center" }}>
      <h2>Admin Login</h2>

      <input
        type="password"
        placeholder="Enter PIN"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        className="input"
        style={{ marginTop: 20 }}
      />

      <button onClick={login} className="btn-primary" style={{ marginTop: 20 }}>
        Login
      </button>
    </div>
  );
}
