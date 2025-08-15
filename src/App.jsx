import React, { useMemo, useState } from "react";
import { createWorld, getWorld, tickWorld, getEvents, registerAgent } from "./api";

export default function App() {
  const [worldName, setWorldName] = useState("Tavern of Whispers");
  const [worldId, setWorldId] = useState("");
  const [worldState, setWorldState] = useState(null);
  const [events, setEvents] = useState([]);
  const [agentName, setAgentName] = useState("Blacksmith");
  const [agentEndpoint, setAgentEndpoint] = useState("http://localhost:8002/act_mcp");
  const [busy, setBusy] = useState(false);
  const API_BASE = useMemo(() => import.meta.env.VITE_API_URL || "https://ai-storyworld.onrender.com", []);

  async function handleCreateWorld() {
    try {
      setBusy(true);
      const w = await createWorld(worldName || "Demo World");
      setWorldId(w.id);
      setWorldState(w.state);
      setEvents([]);
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleFetchWorld() {
    if (!worldId) return;
    try {
      setBusy(true);
      const w = await getWorld(worldId);
      setWorldState(w);
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleTick() {
    if (!worldId) return;
    try {
      setBusy(true);
      await tickWorld(worldId);
      const [w, ev] = await Promise.all([getWorld(worldId), getEvents(worldId)]);
      setWorldState(w);
      setEvents(ev);
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleRegisterAgent() {
    if (!worldId) return alert("Create a world first.");
    try {
      setBusy(true);
      await registerAgent(worldId, { name: agentName, endpoint: agentEndpoint, type: "NPC" });
      await handleFetchWorld();
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="app-shell">
      <h1 className="title">⚔️ AI Storyworld Simulator</h1>

      {/* World Creator */}
      <section className="panel">
        <h2>🛠 Create World</h2>
        <div className="input-row">
          <input
            className="input"
            placeholder="World name"
            value={worldName}
            onChange={(e) => setWorldName(e.target.value)}
          />
          <button className="btn" onClick={handleCreateWorld} disabled={busy}>
            {busy ? "Creating..." : "Create"}
          </button>
        </div>
        {worldId && (
          <p className="muted" style={{ marginTop: 8 }}>
            World ID: <code>{worldId}</code>
          </p>
        )}
      </section>

      {/* Agent Register + Tick */}
      <section className="panel">
        <h2>🧙 Register NPC Agent & Advance Time</h2>
        <div className="grid-2">
          <div className="box">
            <div style={{ marginBottom: 8 }}>
              <label>Name</label>
              <input
                className="input"
                placeholder="Agent name"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label>Agent Endpoint</label>
              <input
                className="input"
                placeholder="http://localhost:8002/act_mcp"
                value={agentEndpoint}
                onChange={(e) => setAgentEndpoint(e.target.value)}
              />
              <p className="muted" style={{ margin: "6px 0 0" }}>
                Tip: If your NPC Agent runs in Docker with the backend, use its container URL.
              </p>
            </div>
            <button className="btn secondary" onClick={handleRegisterAgent} disabled={busy || !worldId}>
              {busy ? "Registering..." : "Register Agent"}
            </button>
          </div>

          <div className="box">
            <p className="muted">Backend: <code>{API_BASE}</code></p>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn" onClick={handleFetchWorld} disabled={busy || !worldId}>
                Refresh World
              </button>
              <button className="btn" onClick={handleTick} disabled={busy || !worldId}>
                {busy ? "Ticking..." : "Tick World"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* World + Events */}
      <section className="panel">
        <h2>🌍 World State & 📜 Event Log</h2>
        <div className="grid-2">
          <div className="box scroll">
            <strong>World JSON</strong>
            <pre style={{ whiteSpace: "pre-wrap" }}>
{worldState ? JSON.stringify(worldState, null, 2) : "Create a world to see its state here."}
            </pre>
          </div>
          <div className="box scroll">
            <strong>Events</strong>
            <div style={{ marginTop: 8 }}>
              {events.length === 0 ? (
                <div className="item">No events yet — tick the world to generate activity.</div>
              ) : (
                events.map((e, i) => (
                  <div key={i} className="item">
                    <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>
                      <strong>{e.event?.type || "event"}</strong>
                      {e.created_at ? <span className="muted"> — {e.created_at}</span> : null}
                    </div>
                    <pre style={{ margin: "6px 0 0", whiteSpace: "pre-wrap" }}>
{JSON.stringify(e.event, null, 2)}
                    </pre>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="footer">💡 Pro tip: Register multiple agents, then tick to watch them interact.</div>
    </div>
  );
}
