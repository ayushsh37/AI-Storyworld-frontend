const API_BASE = "https://ai-storyworld.onrender.com";

export async function createWorld(name) {
  const res = await fetch(`${API_BASE}/worlds`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return res.json();
}

export async function registerAgent(world_id, agent){
  const r = await fetch(`${BASE}/agents?world_id=${encodeURIComponent(world_id)}`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(agent)
  });
  return r.json();
}

export async function tickWorld(world_id){
  const r = await fetch(`${BASE}/worlds/${encodeURIComponent(world_id)}/tick`, { method: "POST" });
  return r.json();
}

export async function getWorld(world_id){
  const r = await fetch(`${BASE}/worlds/${encodeURIComponent(world_id)}`);
  return r.json();
}

export async function getEvents(world_id){
  const r = await fetch(`${BASE}/worlds/${encodeURIComponent(world_id)}/events`);
  return r.json();
}
