import React from "react";
import PlayView from "./views/PlayView";

export default function App() {
  return (
    <div
      style={{
        fontFamily: "'Cinzel', serif",
        backgroundColor: "#1a1a1d",
        color: "#f4e4bc",
        minHeight: "100vh",
        padding: 20,
        backgroundImage:
          "url('https://www.transparenttextures.com/patterns/black-linen.png')",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "2.5rem",
          color: "#d4af37",
          textShadow: "2px 2px #000",
          marginBottom: "1.5rem",
        }}
      >
        🏰 AI Storyworld Simulator
      </h1>
      <PlayView />
    </div>
  );
}
