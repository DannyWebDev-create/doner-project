"use client";
import styles from "./page.module.css";
import { GameStateProvider } from '../components/GameStateContext';
import DonerClicker from '../components/DonerClicker';
import UpgradesPanel from '@/components/UpgradesPanel';
import ExtensionsPanel from '@/components/ExtensionsPanel';
import GoldenDoner from '../components/GoldenDoner';
import StatsDisplay from '../components/StatsDisplay';
import GameAnimations from '../components/GameAnimations';

export default function Home() {
  return (
    <GameStateProvider>
      <div className={styles.page} style={{ backgroundColor: "#f5f0e8", minHeight: "100vh", position: "relative" }}>
        <GoldenDoner />
        <main className={styles.main} style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "3rem", color: "#b8561d", marginBottom: 0, textShadow: "2px 2px 4px rgba(0,0,0,0.1)" }}>Döner Clicker</h1>
          <p style={{ fontWeight: "bold", fontSize: "1.4rem", color: "#333", margin: "0.5rem 0 1.5rem" }}>Klicke auf den Döner!</p>
          
          <StatsDisplay />
          
          <div style={{ 
            display: "flex", 
            flexDirection: "row", 
            gap: "2rem", 
            alignItems: "flex-start"
          }}>
            <DonerClicker />
            <UpgradesPanel />
            <ExtensionsPanel />
          </div>
          
          <GameAnimations />
        </main>
      </div>
    </GameStateProvider>
  );
}
