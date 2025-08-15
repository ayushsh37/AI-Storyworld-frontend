import React, { useState } from "react";
import { createWorld, registerAgent, tickWorld, getWorld, getEvents } from "../api";
import Inspector from "./Inspector";

export default function PlayView(){
  const [world, setWorld] = useState(null);
  const [worldId, setWorldId] = useState(null);
  const [agents, setAgents] = useState([]);
  const [events, setEvents] = useState([]);

  async function handleCreate(){
    const res = await createWorld("Tavern Demo");
    setWorld(res.state);
    setWorldId(res.id);
    setAgents([]);
    setEvents([]);
  }

  async function handleRegister(){
    if(!worldId) return alert("Create world first");
    const endpoint = window.prompt("Agent endpoint (inside docker use http://npc_agent:8002/act_mcp, or local http://localhost:8002/act_mcp)", "http://localhost:8002/act_mcp");
    if(!endpoint) return;
    const spec = { name: "Blacksmith", endpoint, type: "NPC" };
    const res = await registerAgent(worldId, spec);
    setAgents(a => [...a, res]);
  }

  async function handleTick(){
    if(!worldId) return;
    await tickWorld(worldId);
    const w = await getWorld(worldId);
    const ev = await getEvents(worldId);
    setWorld(w);
    setEvents(ev);
  }

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <button onClick={handleCreate}>Create World</button>{" "}
        <button onClick={handleRegister} disabled={!worldId}>Register NPC Agent</button>{" "}
        <button onClick={handleTick} disabled={!worldId}>Tick / Step World</button>
      </div>

      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ flex: 1 }}>
          <h3>World</h3>
          <pre style={{ background: "#f7f7f7", padding: 12, maxHeight: 420, overflow: "auto" }}>{JSON.stringify(world, null, 2)}</pre>
        </div>
        <div style={{ width: 420 }}>
          <h3>Agents</h3>
          {agents.length === 0 && <div style={{ fontSize: 13 }}>No agents registered</div>}
          {agents.map(a => (
            <div key={a.id} style={{ borderBottom: "1px solid #eee", padding: "6px 0" }}>
              <strong>{a.name}</strong><div style={{ fontSize: 12 }}>{a.endpoint}</div>
            </div>
          ))}
          <h3 style={{ marginTop: 12 }}>Events</h3>
          <Inspector logs={events} />
        </div>
      </div>
    </div>
  );
}
