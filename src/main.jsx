import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

const API_BASE = "https://ai-storyworld.onrender.com"; // Backend URL

function App() {
  const [worlds, setWorlds] = useState([]);
  const [selectedWorld, setSelectedWorld] = useState("");
  const [story, setStory] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/worlds`)
      .then(res => res.json())
      .then(data => setWorlds(data))
      .catch(err => console.error("Error fetching worlds:", err));
  }, []);

  const startStory = () => {
    if (!selectedWorld) return alert("Select a world first!");
    fetch(`${API_BASE}/play?world=${encodeURIComponent(selectedWorld)}`)
      .then(res => res.json())
      .then(data => setStory(data.story))
      .catch(err => console.error("Error starting story:", err));
  };

  return (
    <div>
      <h1>🗡️ AI Storyworld Simulator</h1>
      <p>Choose your fantasy world and begin your RPG adventure!</p>

      <select
        value={selectedWorld}
        onChange={e => setSelectedWorld(e.target.value)}
      >
        <option value="">-- Select a World --</option>
        {worlds.map((w, i) => (
          <option key={i} value={w}>{w}</option>
        ))}
      </select>

      <button onClick={startStory}>Begin Adventure</button>

      {story && (
        <div style={{ marginTop: "20px" }}>
          <h2>📜 Your Story</h2>
          <p>{story}</p>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
