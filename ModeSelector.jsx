import React from "react";
import XOBackground from "./XOBackground"; // Add this import
import "./ModeSelector.css";

const ModeSelector = ({ onModeSelect }) => {
  return (
    <>
      <XOBackground /> {/* Rain effect in background */}
      <div className="mode-selector-wrapper">
        <div className="mode-selector-card">
          <h2>🎮 Choose Game Mode</h2>
          <div className="button-group">
            <button onClick={() => onModeSelect("human")}>
              🧑‍🤝‍🧑 Human vs Human
            </button>
            <button onClick={() => onModeSelect("ai")}>
              🤖 Human vs AI
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModeSelector;
