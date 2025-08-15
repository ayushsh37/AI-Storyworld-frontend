import React from "react";
import PlayView from "./views/PlayView";

export default function App(){
  return (
    <div style={{ fontFamily: "system-ui, Arial", padding: 20 }}>
      <h1>AI Storyworld Simulator (MCP)</h1>
      <PlayView />
    </div>
  );
}
