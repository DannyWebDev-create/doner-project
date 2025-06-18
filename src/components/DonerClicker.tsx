"use client";
import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useGameState } from './GameStateContext';

export default function DonerClicker() {
  const { 
    gameState, 
    donerCount, 
    setDonerCount, 
    clickPower, // Base click power for upgrade cost calculation
    effectiveClickPower, // Effective click power for actual clicking and display
    setClickPower, // To upgrade base click power
    setTotalDonerEarned, 
    incrementClickCount,
    goldenDonerMultiplier // Get the multiplier directly
  } = useGameState();
  
  // Animation state
  const [showClickEffect, setShowClickEffect] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });

  // Click handler for Döner image with animation
  const handleDonerClick = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setClickPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    setShowClickEffect(true);
    setTimeout(() => setShowClickEffect(false), 500);
    
    const clickValue = effectiveClickPower * goldenDonerMultiplier; // Apply golden doner multiplier
    setDonerCount(prev => prev + clickValue);
    setTotalDonerEarned(prev => prev + clickValue);
    incrementClickCount();
  }, [effectiveClickPower, goldenDonerMultiplier, setDonerCount, setTotalDonerEarned, incrementClickCount]);

  // Handler for click power upgrade
  const handleBuyClickPower = () => {
    const cost = clickPower * 200; // Cost based on base clickPower
    if (donerCount >= cost) {
      setDonerCount(c => c - cost);
      setClickPower(p => p + 1); // Increment base clickPower
    }
  };

  return (
    <div style={{ 
      flex: "1", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      position: "relative" 
    }}>
      <div style={{ 
        fontSize: "2.5rem", 
        color: "#b8561d", 
        marginBottom: "1rem", 
        textAlign: "center", 
        fontWeight: "bold" 
      }}>
        {Math.floor(gameState.donerCount)} Döner
      </div>
      
      <button
        style={{
          border: "none",
          background: "none",
          cursor: "pointer",
          outline: "none",
          transition: "transform 0.1s",
          position: "relative",
        }}
        onClick={handleDonerClick}
      >
        <Image
          src="/doner.png"
          alt="Döner"
          width={280}
          height={280}
          style={{ 
            borderRadius: "50%", 
            boxShadow: "0 8px 32px rgba(184, 86, 29, 0.4)",
            transform: showClickEffect ? "scale(0.95)" : "scale(1)",
            transition: "transform 0.1s"
          }}
          priority
        />
        
        {showClickEffect && (
          <div style={{
            position: "absolute",
            top: clickPosition.y - 15,
            left: clickPosition.x - 15,
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "#ffcc00",
            textShadow: "0 0 3px #000",
            animation: "floatUp 0.5s forwards",
            opacity: 1,
            pointerEvents: 'none'
          }}>
            +{effectiveClickPower * goldenDonerMultiplier}
          </div>
        )}
      </button>

      <div style={{ 
        marginTop: "1rem", 
        padding: "0.5rem 1.5rem", 
        backgroundColor: "#fff", 
        borderRadius: "8px", 
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)" 
      }}>
        <button
          onClick={handleBuyClickPower}
          disabled={donerCount < clickPower * 200}
          style={{
            padding: "8px 16px",
            background: donerCount >= clickPower * 200 ? "#ff9800" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold",
            fontSize: "0.9rem",
            cursor: donerCount >= clickPower * 200 ? "pointer" : "not-allowed",
            width: "100%",
            marginTop: "0.5rem"
          }}
        >
          Dönermesser schärfen (+1 pro Klick)<br />
          Kosten: {clickPower * 200} Döner
        </button>
        <div style={{ textAlign: "center", marginTop: "0.5rem", fontSize: "0.9rem", color: "black" }}>
          Aktuell: <b>{effectiveClickPower} Döner pro Klick</b>
        </div>
      </div>
    </div>
  );
}
