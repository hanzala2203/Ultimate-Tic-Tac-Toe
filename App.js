import React, { useState } from "react";
import ModeSelector from "./component/ModeSelector";
import GameMode from "./component/GameMode";
import GameBoard from "./component/GameBoard";
import "./index.css";

function App() {
  const [playerType, setPlayerType] = useState(null);
  const [gameMode, setGameMode] = useState(null);

  return (
    <div className="app-wrapper animated-background">
      {/* Neon header bar */}
      <header className="header-bar">
        <h1 className="neon-title">O Ultimate Tic Tac Toe X</h1>
      </header>

      {/* App content */}
      <main style={{ position: "relative", zIndex: 2 }}>
        {!playerType ? (
          <ModeSelector
            onModeSelect={(type) => {
              setPlayerType(type);
              setGameMode(null);
            }}
          />
        ) : !gameMode ? (
          <GameMode
            onStart={(mode) => setGameMode(mode)}
            goHome={() => setPlayerType(null)}
          />
        ) : (
          <GameBoard
            mode={gameMode}
            playerType={playerType}
            goBack={() => setGameMode(null)}
          />
        )}
      </main>

      {/* Footer glow line */}
      <footer className="footer-glow"></footer>
    </div>
  );
}

export default App;
