import React, { useEffect, useState } from "react";
import "../index.css";

export default function GameBoard({ mode, playerType, goBack }) {
  const [board, setBoard] = useState(null);
  const [player, setPlayer] = useState("X");
  const [winner, setWinner] = useState(null);
  const [activeSubgrid, setActiveSubgrid] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1); // ✅ new

  const fetchState = () => {
    fetch(`http://localhost:8000/state?mode=${mode}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.board) && Array.isArray(data.board[0])) {
          setBoard(data.board);
          setPlayer(data.player);
          setWinner(data.winner);
          setActiveSubgrid(data.active_subgrid || null);
        } else {
          console.error("❌ Invalid board format:", data);
          alert("Something went wrong loading the board.");
        }
      });
  };

  const resetBoard = () => {
    fetch(`http://localhost:8000/reset?mode=${mode}`, { method: "POST" }).then(fetchState);
  };

  useEffect(() => {
    resetBoard();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClick = (x, y) => {
    if (!board || !board[y] || board[y][x] !== "" || winner) return;

    fetch(`http://localhost:8000/move?mode=${mode}&player_type=${playerType}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ x, y })
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.board)) {
          setBoard(data.board);
          setPlayer(data.player);
          setWinner(data.winner);
          setActiveSubgrid(data.active_subgrid || null);
        } else {
          console.error("❌ Invalid move response:", data);
          alert("Something went wrong after move.");
        }
      })
      .catch(err => {
        console.error("❌ Fetch error:", err);
        alert("❌ Failed to make move. Backend issue.");
      });
  };

  const getSubgridSize = () => {
    if (mode === "classic") return 1;
    if (mode === "ultimate") return 3;
    if (mode === "max") return 9;
    return 1;
  };

  const isInActiveSubgrid = (x, y) => {
    if (!activeSubgrid || mode === "classic") return false;
    const subgridSize = getSubgridSize();
    const [subX, subY] = activeSubgrid;
    const startX = subX * subgridSize;
    const startY = subY * subgridSize;
    return x >= startX && x < startX + subgridSize && y >= startY && y < startY + subgridSize;
  };

  const getSubgridWinner = (x, y) => {
    if (mode === "classic") return null;
    const subgridSize = getSubgridSize();
    const gridX = Math.floor(x / subgridSize);
    const gridY = Math.floor(y / subgridSize);
    const midX = gridX * subgridSize + Math.floor(subgridSize / 2);
    const midY = gridY * subgridSize + Math.floor(subgridSize / 2);
    const center = board[midY]?.[midX];
    return Array.isArray(center) ? center[0] : null;
  };

  if (!board || !Array.isArray(board) || !Array.isArray(board[0])) {
    return <div className="loading">Loading board...</div>;
  }

  const subgridSize = getSubgridSize();
  const baseSize = mode === "classic" ? 80 : mode === "ultimate" ? 50 : 20;
  const cellSize = baseSize * (mode === "max" ? zoomLevel : 1); // ✅ updated
  const fontSize = mode === "classic" ? "36px" :
                   mode === "ultimate" ? "22px" :
                   `${10 * zoomLevel}px`; // ✅ scalable font

  return (
    <div className="game-container">
      <h2 className={`game-status ${winner ? "show-result" : ""}`}>
        {winner === "Draw" ? "🏁 Match is a Draw!" : winner ? `🏆 Winner: ${winner}` : `Current Player: ${player}`}
      </h2>

      <div className="grid-board-container">
        <div
          className="grid-board"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${board.length}, ${cellSize}px)`,
            gap: "1px",
          }}
        >
          {board.map((row, y) =>
            row.map((cell, x) => {
              const subgridWinner = getSubgridWinner(x, y);
              const isCenter =
                x % subgridSize === Math.floor(subgridSize / 2) &&
                y % subgridSize === Math.floor(subgridSize / 2);

              if (subgridWinner && mode !== "classic" && !isCenter) {
                return <div key={`${x}-${y}`} style={{ width: `${cellSize}px`, height: `${cellSize}px` }} />;
              }

              return (
                <div
                  key={`${x}-${y}`}
                  onClick={() => handleClick(x, y)}
                  className={`grid-cell ${cell ? "fade-in" : ""} ${isInActiveSubgrid(x, y) ? "active-subgrid" : ""}`}
                  style={{
                    width: `${cellSize}px`,
                    height: `${cellSize}px`,
                    fontSize,
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#1e1e1e",
                    color: "white",
                    borderTop: y % 9 === 0 ? "3px solid #fff" : y % 3 === 0 ? "2px solid #666" : "1px solid #333",
                    borderLeft: x % 9 === 0 ? "3px solid #fff" : x % 3 === 0 ? "2px solid #666" : "1px solid #333",
                    boxSizing: "border-box",
                    cursor: "pointer"
                  }}
                >
                  {!subgridWinner || mode === "classic" ? (Array.isArray(cell) ? cell[0] : cell) : ""}

                  {subgridWinner && isCenter && (
                    <div
                      className="overlay-winner"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        color: subgridWinner === "X" ? "#00f0ff" : "#ff007c",
                        fontSize: cellSize * subgridSize * 0.4,
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        pointerEvents: "none",
                        textShadow: `0 0 10px ${subgridWinner === "X" ? "#00f0ff" : "#ff007c"}`
                      }}
                    >
                      {subgridWinner}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ✅ Zoom controls only for max mode */}
      {mode === "max" && (
        <div style={{ marginTop: 20, display: "flex", gap: "10px", alignItems: "center", justifyContent: "center" }}>
          <button onClick={() => setZoomLevel(z => Math.min(z + 0.1, 3))}>🔍 Zoom In</button>
          <span style={{ color: "white" }}>Zoom: {Math.round(zoomLevel * 100)}%</span>
          <button onClick={() => setZoomLevel(z => Math.max(z - 0.1, 0.5))}>🔎 Zoom Out</button>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        {winner && <button onClick={resetBoard}>🔁 Play Again</button>}
        <button onClick={goBack} style={{ marginLeft: 10 }}>🔙 Back to Mode</button>
      </div>
    </div>
  );
}
