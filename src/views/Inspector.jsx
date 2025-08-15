import React from "react";

export default function Inspector({ logs }){
  if(!logs || logs.length === 0) return <div style={{ fontSize: 13 }}>No events yet</div>;
  return (
    <div style={{ maxHeight: 420, overflow: "auto" }}>
      {logs.map((l, i) => (
        <div key={i} style={{ borderBottom: "1px dashed #ddd", padding: 8 }}>
          <div style={{ fontSize: 12, color: "#333" }}><strong>{l.event.actor_id}</strong> — {l.created_at}</div>
          <pre style={{ fontFamily: "monospace", marginTop: 6 }}>{JSON.stringify(l.event, null, 2)}</pre>
        </div>
      ))}
    </div>
  );
}
