"use client";
import { useGameState } from './GameStateContext';

export default function StatsDisplay() {
  const { gameState, donersPerSecond } = useGameState();

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "space-between", 
      backgroundColor: "#fff", 
      padding: "0.8rem", 
      borderRadius: "8px", 
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      marginBottom: "1.5rem"
    }}>
      <div>
        <span style={{ fontSize: "1.1rem", color: "#666" }}>Döner pro Sekunde:</span>
        <span style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#b8561d", marginLeft: "0.5rem" }}>{donersPerSecond}</span>
      </div>
      <div>
        <span style={{ fontSize: "1.1rem", color: "#666" }}>Klicks:</span>
        <span style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#b8561d", marginLeft: "0.5rem" }}>{gameState.clickCount}</span>
        <p>Klick-Power: {gameState.effectiveClickPower}</p>
      </div>
      <div>
        <span style={{ fontSize: "1.1rem", color: "#666" }}>Insgesamt verdient:</span>
        <span style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#b8561d", marginLeft: "0.5rem" }}>{gameState.totalDonerEarned}</span>
      </div>
    </div>
  );
}
