import React, { useState } from "react";
import {
  createWorld,
  registerAgent,
  tickWorld,
  getWorld,
  getEvents,
} from "../api";
import Inspector from "./Inspector";

export default function PlayView() {
  const [world, setWorld] = useState(null);
  const [worldId, setWorldId] = useState(null);
  const [agents, setAgents] = useState([]);
  const [events, setEvents] = useState([]);

  async function handleCreate() {
    const res = await createWorld("Tavern Demo");
    setWorld(res.state);
    setWorldId(res.id);
    setAgents([]);
    setEvents([]);
  }

  async function handleRegister() {
    if (!worldId) return alert("Create world first");
    const endpoint = window.prompt(
      "Agent endpoint:",
      "http://localhost:8002/act_mcp"
    );
    if (!endpoint) return;
    const spec = { name: "Blacksmith", endpoint, type: "NPC" };
    const res = await registerAgent(worldId, spec);
    setAgents((a) => [...a, res]);
  }

  async function handleTick() {
    if (!worldId) return;
    await tickWorld(worldId);
    const w = await getWorld(worldId);
    const ev = await getEvents(worldId);
    setWorld(w);
    setEvents(ev);
  }

  const buttonStyle = {
    backgroundColor: "#5c4033",
    color: "#f4e4bc",
    border: "2px solid #d4af37",
    padding: "8px 14px",
    cursor: "pointer",
    fontFamily: "'Cinzel', serif",
    marginRight: "8px",
    borderRadius: "6px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
  };

  const panelStyle = {
    backgroundColor: "rgba(44, 38, 33, 0.95)",
    padding: "12px",
    border: "2px solid #d4af37",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
  };

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <button onClick={handleCreate} style={buttonStyle}>
          ⚔️ Create World
        </button>
        <button
          onClick={handleRegister}
          disabled={!worldId}
          style={{
            ...buttonStyle,
            opacity: worldId ? 1 : 0.5,
            cursor: worldId ? "pointer" : "not-allowed",
          }}
        >
          🛠️ Register NPC
        </button>
        <button
          onClick={handleTick}
          disabled={!worldId}
          style={{
            ...buttonStyle,
            opacity: worldId ? 1 : 0.5,
            cursor: worldId ? "pointer" : "not-allowed",
          }}
        >
          ⏳ Tick World
        </button>
      </div>

      <div style={{ display: "flex", gap: 20 }}>
        <div style={{ flex: 1, ...panelStyle }}>
          <h3 style={{ color: "#d4af37" }}>🌍 World</h3>
          <pre
            style={{
              background: "#2b2520",
              padding: 12,
              maxHeight: 420,
              overflow: "auto",
              color: "#f4e4bc",
              border: "1px solid #d4af37",
              borderRadius: "4px",
            }}
          >
            {JSON.stringify(world, null, 2)}
          </pre>
        </div>
        <div style={{ width: 420, ...panelStyle }}>
          <h3 style={{ color: "#d4af37" }}>🧙 Agents</h3>
          {agents.length === 0 && (
            <div style={{ fontSize: 13, color: "#aaa" }}>
              No agents registered
            </div>
          )}
          {agents.map((a) => (
            <div
              key={a.id}
              style={{
                borderBottom: "1px solid #d4af37",
                padding: "6px 0",
              }}
            >
              <strong>{a.name}</strong>
              <div style={{ fontSize: 12, color: "#ccc" }}>{a.endpoint}</div>
            </div>
          ))}
          <h3 style={{ marginTop: 12, color: "#d4af37" }}>📜 Events</h3>
          <Inspector logs={events} />
        </div>
      </div>
    </div>
  );
}
