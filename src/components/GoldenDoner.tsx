"use client";
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useGameState } from './GameStateContext';

export default function GoldenDoner() {
  const { 
    gameState,
    setGoldenDonerMultiplier,
    setGoldenDonerMultiplierEndTime,
    setGoldenDonerClicked,
    getRemainingMultiplierTime
  } = useGameState();

  // Golden Döner state
  const [goldenDonerVisible, setGoldenDonerVisible] = useState(false);
  const [goldenDonerPosition, setGoldenDonerPosition] = useState({ top: 0, left: 0 });

  // Click handler for golden döner
  const handleGoldenDonerClick = useCallback(() => {
    // Activate 20x multiplier for 30 seconds
    setGoldenDonerMultiplier(20);
    setGoldenDonerMultiplierEndTime(Date.now() + 30000); // 30 seconds
    setGoldenDonerVisible(false);
    setGoldenDonerClicked(prev => prev + 1);
  }, [setGoldenDonerMultiplier, setGoldenDonerMultiplierEndTime, setGoldenDonerClicked]);

  // Golden Döner logic
  useEffect(() => {
    // Randomly spawn the golden döner (approx. every 30-120 seconds)
    const spawnGoldenDoner = () => {
      if (!goldenDonerVisible) {
        const mainElement = document.querySelector('main');
        if (mainElement) {
          const mainRect = mainElement.getBoundingClientRect();
          const maxTop = mainRect.height - 100;
          const maxLeft = mainRect.width - 100;
          
          setGoldenDonerPosition({
            top: Math.floor(Math.random() * maxTop),
            left: Math.floor(Math.random() * maxLeft)
          });
          setGoldenDonerVisible(true);
          
          // Golden Döner disappears after 5 seconds
          setTimeout(() => {
            setGoldenDonerVisible(false);
          }, 5000);
        }
      }
    };
    
    // Randomly spawn the golden döner
    const minDelay = 30000; // 30 seconds
    const maxDelay = 120000; // 2 minutes
    const delay = Math.floor(Math.random() * (maxDelay - minDelay)) + minDelay;
    
    const timer = setTimeout(spawnGoldenDoner, delay);
    return () => clearTimeout(timer);
  }, [goldenDonerVisible]);

  return (
    <>
      {/* Golden Döner (appears randomly) */}
      {goldenDonerVisible && (
        <div 
          style={{
            position: "absolute",
            top: goldenDonerPosition.top,
            left: goldenDonerPosition.left,
            zIndex: 100,
            cursor: "pointer",
            animation: "float 2s infinite alternate",
          }}
          onClick={handleGoldenDonerClick}
        >
          <Image 
            src="/goldendoner.png"
            alt="Goldener Döner"
            width={80}
            height={80}
            style={{ filter: "drop-shadow(0 0 10px gold)" }}
          />
        </div>
      )}
      
      {/* Multiplier display */}
      {gameState.goldenDonerMultiplier > 1 && (
        <div style={{
          position: "fixed",
          top: "10px",
          right: "10px",
          backgroundColor: "gold",
          color: "#b8561d",
          padding: "0.5rem 1rem",
          borderRadius: "8px",
          fontWeight: "bold",
          boxShadow: "0 0 15px rgba(255, 215, 0, 0.7)",
          zIndex: 1000,
        }}>
          x{gameState.goldenDonerMultiplier} Bonus! ({getRemainingMultiplierTime()}s)
        </div>
      )}
    </>
  );
}
