// Point to your Render backend (can be overridden by Vercel env var)
const API_BASE = import.meta.env.VITE_API_URL || "https://ai-storyworld.onrender.com";

// --- Worlds ---
export async function createWorld(name) {
  const res = await fetch(`${API_BASE}/worlds`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name })
  });
  if (!res.ok) throw new Error(`Create world failed: ${res.status}`);
  return res.json();
}

export async function getWorld(worldId) {
  const res = await fetch(`${API_BASE}/worlds/${worldId}`);
  if (!res.ok) throw new Error(`Get world failed: ${res.status}`);
  return res.json();
}

export async function tickWorld(worldId) {
  const res = await fetch(`${API_BASE}/worlds/${worldId}/tick`, { method: "POST" });
  if (!res.ok) throw new Error(`Tick failed: ${res.status}`);
  return res.json();
}

export async function getEvents(worldId) {
  const res = await fetch(`${API_BASE}/worlds/${worldId}/events`);
  if (!res.ok) throw new Error(`Get events failed: ${res.status}`);
  return res.json();
}

// --- Agents ---
export async function registerAgent(worldId, { name, endpoint, type = "NPC" }) {
  const url = new URL(`${API_BASE}/agents`);
  url.searchParams.set("world_id", worldId);
  const res = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, endpoint, type })
  });
  if (!res.ok) throw new Error(`Register agent failed: ${res.status}`);
  return res.json();
}
