import React from "react";

export default function GameMode({ onStart, goHome }) {
  const buttonStyle = {
    padding: "15px 30px",
    fontSize: "18px",
    margin: "10px",
    borderRadius: "10px",
    backgroundColor: "#00ffff",
    color: "black",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: "0 0 15px #00ffff",
    transition: "transform 0.2s ease",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <h2 style={{ color: "#00ffff", marginBottom: "30px" }}>Select Game Mode</h2>

      <div>
        <button
          onClick={() => onStart("classic")}
          style={buttonStyle}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
        >
          Classic 3x3
        </button>

        <button
          onClick={() => onStart("ultimate")}
          style={buttonStyle}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
        >
          Ultimate 9x9
        </button>

        {/* New Max 27x27 Button */}
        <button
          onClick={() => onStart("max")}
          style={buttonStyle}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
        >
          Max 27x27
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        <button
          onClick={goHome}
          style={buttonStyle}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
        >
          🏠 Back to Home
        </button>
      </div>
    </div>
  );
}
