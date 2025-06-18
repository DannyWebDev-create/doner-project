"use client";
import React from 'react';
import { useGameState } from './GameStateContext';
import { extensions as allExtensions, Extension, GeneratorType } from '../data/extensions';
import { formatNumber } from '../utils/formatNumber'; // Assuming you have this utility

const ExtensionsPanel: React.FC = () => {
  const { gameState, buyExtension, isExtensionPurchased, donerCount } = useGameState();

  const getGeneratorCurrentCount = (generatorType: GeneratorType): number => {
    switch (generatorType) {
      case GeneratorType.AutoClicker: return gameState.autoClickers;
      case GeneratorType.DonerMesser: return gameState.donerMesser;
      case GeneratorType.DonerSpiess: return gameState.donerSpiess;
      case GeneratorType.DonerLokal: return gameState.donerLokal;
      case GeneratorType.DonerKette: return gameState.donerKette;
      case GeneratorType.DonerImperium: return gameState.donerImperium;
      case GeneratorType.DonerPlanet: return gameState.donerPlanet;
      default: return 0;
    }
  };

  const checkPrerequisites = (extension: Extension): boolean => {
    if (!extension.prerequisites) return true;
    return extension.prerequisites.every(prereq => {
      const currentCount = getGeneratorCurrentCount(prereq.generator);
      return currentCount >= prereq.count;
    });
  };

  const availableExtensions = allExtensions.filter(ext => !isExtensionPurchased(ext.id));

  return (
    <div style={{ 
        backgroundColor: "#fff0e1", 
        padding: "1rem", 
        borderRadius: "8px", 
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)", 
        marginTop: "1rem"
    }}>
      <h2 style={{ 
          textAlign: "center", 
          color: "#8c5a32", 
          marginBottom: "1.5rem", 
          borderBottom: "2px solid #8c5a32", 
          paddingBottom: "0.5rem"
      }}>
        Erweiterungen
      </h2>
      {availableExtensions.length === 0 && <p style={{textAlign: 'center', color: '#555'}}>Alle Erweiterungen gekauft!</p>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1rem" }}>
        {availableExtensions.map(ext => {
          const canAfford = donerCount >= ext.cost;
          const prerequisitesMet = checkPrerequisites(ext);
          const canBuy = canAfford && prerequisitesMet;

          return (
            <div key={ext.id} style={{
              border: `2px solid ${canBuy ? '#8c5a32' : '#d3c0b0'}`, 
              padding: "1rem", 
              borderRadius: "8px", 
              backgroundColor: "#fffaf0",
              opacity: canBuy ? 1 : 0.7,
              cursor: canBuy ? 'default' : 'not-allowed'
            }}>
              <h3 style={{ marginTop: 0, color: '#b8561d' }}>{ext.name}</h3>
              <p style={{ fontSize: "0.9rem", color: "#5a3e2b" }}>{ext.description}</p>
              <p style={{ fontSize: "0.9rem", color: "#5a3e2b" }}>Kosten: <span style={{fontWeight: 'bold'}}>{formatNumber(ext.cost)}</span> Döner</p>
              {ext.prerequisites && ext.prerequisites.length > 0 && (
                <div style={{ fontSize: "0.8rem", color: "#7a5230", marginBottom: '0.5rem' }}>
                  <strong>Voraussetzungen:</strong>
                  <ul>
                    {ext.prerequisites.map((prereq, index) => {
                      const currentGeneratorCount = getGeneratorCurrentCount(prereq.generator);
                      const met = currentGeneratorCount >= prereq.count;
                      return (
                        <li key={index} style={{ color: met ? 'green' : 'red' }}>
                          {prereq.count} {prereq.generator} (Aktuell: {currentGeneratorCount})
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              <button 
                onClick={() => buyExtension(ext.id)}
                disabled={!canBuy}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  backgroundColor: canBuy ? "#ff9800" : "#ccc",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  fontWeight: "bold",
                  cursor: canBuy ? "pointer" : "not-allowed",
                  transition: "background-color 0.2s ease"
                }}
              >
                Kaufen
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExtensionsPanel;
