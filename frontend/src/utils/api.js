export const API = import.meta.env.VITE_API_BASE;

export async function apiGet(path) {
  const r = await fetch(`${API}${path}`);
  return r.json();
}

export async function apiPost(path, body) {
  const r = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return r.json();
}

export async function apiPut(path, body) {
  const r = await fetch(`${API}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return r.json();
}

export async function apiDelete(path) {
  const r = await fetch(`${API}${path}`, { method: "DELETE" });
  return r.json();
}
