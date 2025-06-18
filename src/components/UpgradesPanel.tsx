"use client";
import { useGameState } from './GameStateContext';

// Component for a single upgrade item
interface UpgradeItemProps {
  title: string;
  description: string;
  count: number;
  cost: number;
  onBuy: () => void;
  disabled: boolean;
}

function UpgradeItem({ title, description, count, cost, onBuy, disabled }: UpgradeItemProps) {
  return (
    <div style={{ 
      marginBottom: "1.5rem", 
      padding: "1rem", 
      backgroundColor: "#f9f5f0", 
      borderRadius: "8px", 
      border: "1px solid #e0d5c0",
      color: "black"
    }}>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "0.5rem" 
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "1.2rem" }}>{title}</h3>
          <p style={{ margin: 0, fontSize: "0.9rem", color: "#666" }}>{description}</p>
        </div>
        <div style={{ fontWeight: "bold" }}>{count}</div>
      </div>
      <button
        onClick={onBuy}
        disabled={disabled}
        style={{
          padding: "8px 16px",
          background: !disabled ? "#b8561d" : "#ccc",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontWeight: "bold",
          fontSize: "0.9rem",
          cursor: !disabled ? "pointer" : "not-allowed",
          width: "100%"
        }}
      >
        Kaufen: {cost} Döner
      </button>
    </div>
  );
}

export default function UpgradesPanel() {
  const { 
    gameState,
    setDonerCount,
    setAutoClickers,
    setAutoClickerCost,
    setDonerMesser,
    setDonerMesserCost,
    setDonerSpiess,
    setDonerSpiessCost,
    setDonerLokal,
    setDonerLokalCost,
    setDonerKette,
    setDonerKetteCost,
    setDonerImperium,
    setDonerImperiumCost,
    setDonerPlanet,
    setDonerPlanetCost,
  } = useGameState();

  // Upgrade handlers
  const handleBuyAutoClicker = () => {
    if (gameState.donerCount >= gameState.autoClickerCost) {
      setDonerCount(c => c - gameState.autoClickerCost);
      setAutoClickers(a => a + 1);
      setAutoClickerCost(cost => Math.floor(cost * 1.15));
    }
  };
  
  const handleBuyDonerMesser = () => {
    if (gameState.donerCount >= gameState.donerMesserCost) {
      setDonerCount(c => c - gameState.donerMesserCost);
      setDonerMesser(d => d + 1);
      setDonerMesserCost(cost => Math.floor(cost * 1.15));
    }
  };
  
  const handleBuyDonerSpiess = () => {
    if (gameState.donerCount >= gameState.donerSpiessCost) {
      setDonerCount(c => c - gameState.donerSpiessCost);
      setDonerSpiess(d => d + 1);
      setDonerSpiessCost(cost => Math.floor(cost * 1.15));
    }
  };
  
  const handleBuyDonerLokal = () => {
    if (gameState.donerCount >= gameState.donerLokalCost) {
      setDonerCount(c => c - gameState.donerLokalCost);
      setDonerLokal(d => d + 1);
      setDonerLokalCost(cost => Math.floor(cost *  1.15));
    }
  };
  
  const handleBuyDonerKette = () => {
    if (gameState.donerCount >= gameState.donerKetteCost) {
      setDonerCount(c => c - gameState.donerKetteCost);
      setDonerKette(d => d + 1);
      setDonerKetteCost(prev => Math.ceil(prev * 1.15));
    }
  };

  const handleBuyDonerImperium = () => {
    if (gameState.donerCount < gameState.donerImperiumCost) return;
    setDonerCount(prev => prev - gameState.donerImperiumCost);
    setDonerImperium(prev => prev + 1);
    setDonerImperiumCost(prev => Math.ceil(prev *  1.15));
  };

  const handleBuyDonerPlanet = () => {
    if (gameState.donerCount < gameState.donerPlanetCost) return;
    setDonerCount(prev => prev - gameState.donerPlanetCost);
    setDonerPlanet(prev => prev + 1);
    setDonerPlanetCost(prev => Math.ceil(prev * 1.15));
  };

  return (
    <div style={{ 
      flex: "1", 
      backgroundColor: "#fff", 
      padding: "1.5rem", 
      borderRadius: "8px", 
      boxShadow: "0 4px 16px rgba(0,0,0,0.1)" 
    }}>
      <h2 style={{ fontSize: "1.5rem", color: "#b8561d", marginTop: 0, marginBottom: "1rem" }}>Upgrades</h2>
      
      <UpgradeItem
        title="Dönermeister"
        description="+1 Döner pro Sekunde"
        count={gameState.autoClickers}
        cost={gameState.autoClickerCost}
        onBuy={handleBuyAutoClicker}
        disabled={gameState.donerCount < gameState.autoClickerCost}
      />
      
      <UpgradeItem
        title="Dönerspieß"
        description="+5 Döner pro Sekunde"
        count={gameState.donerMesser}
        cost={gameState.donerMesserCost}
        onBuy={handleBuyDonerMesser}
        disabled={gameState.donerCount < gameState.donerMesserCost}
      />
      
      <UpgradeItem
        title="Der Dönergerät"
        description="+25 Döner pro Sekunde"
        count={gameState.donerSpiess}
        cost={gameState.donerSpiessCost}
        onBuy={handleBuyDonerSpiess}
        disabled={gameState.donerCount < gameState.donerSpiessCost}
      />
      
      <UpgradeItem
        title="Döner-Lokal"
        description="+100 Döner pro Sekunde"
        count={gameState.donerLokal}
        cost={gameState.donerLokalCost}
        onBuy={handleBuyDonerLokal}
        disabled={gameState.donerCount < gameState.donerLokalCost}
      />
      
      <UpgradeItem
        title="Döner-Kette"
        description="+500 Döner pro Sekunde"
        count={gameState.donerKette}
        cost={gameState.donerKetteCost}
        onBuy={handleBuyDonerKette}
        disabled={gameState.donerCount < gameState.donerKetteCost}
      />

      <UpgradeItem
        title="Döner-Imperium"
        description="+2500 Döner pro Sekunde"
        count={gameState.donerImperium}
        cost={gameState.donerImperiumCost}
        onBuy={handleBuyDonerImperium}
        disabled={gameState.donerCount < gameState.donerImperiumCost}
      />

      <UpgradeItem
        title="Döner-Planet"
        description="+15000 Döner pro Sekunde"
        count={gameState.donerPlanet}
        cost={gameState.donerPlanetCost}
        onBuy={handleBuyDonerPlanet}
        disabled={gameState.donerCount < gameState.donerPlanetCost}
      />
    </div>
  );
}
