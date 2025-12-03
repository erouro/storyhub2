// Central API base
export const API = import.meta.env.VITE_API_BASE || "http://localhost:5000";

// simple fetch wrapper
export async function apiFetch(path, opts) {
  const res = await fetch(API + path, opts);
  const text = await res.text();
  try { return JSON.parse(text); } catch(e) { return text; }
}
