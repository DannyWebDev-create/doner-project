"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const CURRENT_STORAGE_KEY = "donerClickerState_v6";
import { Extension, extensions, getExtensionById, GeneratorType, ExtensionEffectType } from '../data/extensions';

// Define the game state interface
export interface GameState {
  donerCount: number;
  totalDonerEarned: number;
  clickPower: number; // Base click power
  effectiveClickPower: number; // Click power after extensions
  autoClickers: number;
  autoClickerCost: number;
  donerMesser: number;
  donerMesserCost: number;
  donerSpiess: number;
  donerSpiessCost: number;
  donerLokal: number;
  donerLokalCost: number;
  donerKette: number;
  donerKetteCost: number;
  donerImperium: number;
  donerImperiumCost: number;
  donerPlanet: number;
  donerPlanetCost: number;
  startTime: number;
  clickCount: number;
  goldenDonerClicked: number;
  goldenDonerMultiplier: number;
  goldenDonerMultiplierEndTime: number;
  purchasedExtensions: string[]; // Array of IDs of purchased extensions
  donersPerSecond: number; // Calculated Döner per second
}

// Define the context interface
interface GameStateContextType {
  gameState: GameState;
  donerCount: number;
  clickPower: number;
  effectiveClickPower: number;
  goldenDonerMultiplier: number;
  setDonerCount: (value: number | ((prev: number) => number)) => void;
  setTotalDonerEarned: (value: number | ((prev: number) => number)) => void;
  setClickPower: (value: number | ((prev: number) => number)) => void; // For buying base click power upgrades
  setAutoClickers: (value: number | ((prev: number) => number)) => void;
  setAutoClickerCost: (value: number | ((prev: number) => number)) => void;
  setDonerMesser: (value: number | ((prev: number) => number)) => void;
  setDonerMesserCost: (value: number | ((prev: number) => number)) => void;
  setDonerSpiess: (value: number | ((prev: number) => number)) => void;
  setDonerSpiessCost: (value: number | ((prev: number) => number)) => void;
  setDonerLokal: (value: number | ((prev: number) => number)) => void;
  setDonerLokalCost: (value: number | ((prev: number) => number)) => void;
  setDonerKette: (value: number | ((prev: number) => number)) => void;
  setDonerKetteCost: (value: number | ((prev: number) => number)) => void;
  setDonerImperium: (value: number | ((prev: number) => number)) => void;
  setDonerImperiumCost: (value: number | ((prev: number) => number)) => void;
  setDonerPlanet: (value: number | ((prev: number) => number)) => void;
  setDonerPlanetCost: (value: number | ((prev: number) => number)) => void;
  setClickCount: (value: number | ((prev: number) => number)) => void;
  setGoldenDonerClicked: (value: number | ((prev: number) => number)) => void;
  setGoldenDonerMultiplier: (value: number | ((prev: number) => number)) => void;
  setGoldenDonerMultiplierEndTime: (value: number | ((prev: number) => number)) => void;
  donersPerSecond: number;
  getRemainingMultiplierTime: () => number;
  buyExtension: (extensionId: string) => void;
  isExtensionPurchased: (extensionId: string) => boolean;
  getApplicableExtensions: (generatorType?: GeneratorType, effectType?: ExtensionEffectType) => Extension[];
  incrementClickCount: () => void;
  buyAutoClicker: () => void;
  buyDonerMesser: () => void;
}

// Create the context
const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

// Provider component
export function GameStateProvider({ children }: { children: ReactNode }) {
  // State for Döner counter and upgrades
  const [donerCount, setDonerCount] = useState(0);
  const [totalDonerEarned, setTotalDonerEarned] = useState(0);
  const [clickPower, setClickPower] = useState(1); // Base click power
  
  // Upgrades
  const [autoClickers, setAutoClickers] = useState(0);
  const [autoClickerCost, setAutoClickerCost] = useState(100);
  
  const [donerMesser, setDonerMesser] = useState(0);
  const [donerMesserCost, setDonerMesserCost] = useState(1030);
  
  const [donerSpiess, setDonerSpiess] = useState(0);
  const [donerSpiessCost, setDonerSpiessCost] = useState(11500);
  
  const [donerLokal, setDonerLokal] = useState(0);
  const [donerLokalCost, setDonerLokalCost] = useState(130050);
  
  const [donerKette, setDonerKette] = useState(0);
  const [donerKetteCost, setDonerKetteCost] = useState(1460000);

  const [donerImperium, setDonerImperium] = useState(0);
  const [donerImperiumCost, setDonerImperiumCost] = useState(16000000);

  const [donerPlanet, setDonerPlanet] = useState(0);
  const [donerPlanetCost, setDonerPlanetCost] = useState(177000000);
  
  // Statistics
  const [startTime, setStartTime] = useState(Date.now());
  const [clickCount, setClickCount] = useState(0);
  const incrementClickCount = () => setClickCount(prev => prev + 1);

  // Purchase logic for base generators
  const buyAutoClicker = () => {
    if (donerCount >= autoClickerCost) {
      setDonerCount(prev => prev - autoClickerCost);
      setAutoClickers(prev => prev + 1);
      setAutoClickerCost(prev => Math.ceil(prev * 1.15)); // Increase cost by 15%
    }
  };

  const buyDonerMesser = () => {
    if (donerCount >= donerMesserCost) {
      setDonerCount(prev => prev - donerMesserCost);
      setDonerMesser(prev => prev + 1);
      setDonerMesserCost(prev => Math.ceil(prev * 1.15)); // Increase cost by 15%
    }
  };

  const [goldenDonerClicked, setGoldenDonerClicked] = useState(0);
  
  // Golden Döner
  const [goldenDonerMultiplier, setGoldenDonerMultiplier] = useState(1);
  const [goldenDonerMultiplierEndTime, setGoldenDonerMultiplierEndTime] = useState(0);

  // State for purchased extensions
  const [purchasedExtensions, setPurchasedExtensions] = useState<string[]>([]);

  // Load game state from localStorage
  useEffect(() => {
    const refreshedFlag = sessionStorage.getItem('refreshedForStorageVersion');

    if (refreshedFlag !== CURRENT_STORAGE_KEY) {
      // Clear all known old versions of the save state
      localStorage.removeItem("donerClickerState");

      // Add any other specific old keys here if needed

      sessionStorage.setItem('refreshedForStorageVersion', CURRENT_STORAGE_KEY);
      window.location.reload();
      return; // Stop execution until page reloads
    }

    const saved = localStorage.getItem(CURRENT_STORAGE_KEY);
    if (saved) {
      try {
        const state = JSON.parse(saved);
        const safeParse = (value: string | number | null | undefined, defaultValue: number) => {
          if (typeof value === "number") return value;
          if (typeof value === "string") {
            const parsed = parseFloat(value);
            return isNaN(parsed) ? defaultValue : parsed;
          }
          return defaultValue;
        };

        setDonerCount(safeParse(state.donerCount, 0));
        setTotalDonerEarned(safeParse(state.totalDonerEarned, 0));
        setClickPower(safeParse(state.clickPower, 1)); // Ensure clickPower is at least 1 via safeParse
        setAutoClickers(safeParse(state.autoClickers, 0));
        setAutoClickerCost(safeParse(state.autoClickerCost, 100));
        setDonerMesser(safeParse(state.donerMesser, 0));
        setDonerMesserCost(safeParse(state.donerMesserCost, 1100));
        setDonerSpiess(safeParse(state.donerSpiess, 0));
        setDonerSpiessCost(safeParse(state.donerSpiessCost, 12100));
        setDonerLokal(safeParse(state.donerLokal, 0));
        setDonerLokalCost(safeParse(state.donerLokalCost, 133100));
        setDonerKette(safeParse(state.donerKette, 0));
        setDonerKetteCost(safeParse(state.donerKetteCost, 1464100));
        setDonerImperium(safeParse(state.donerImperium, 0));
        setDonerImperiumCost(safeParse(state.donerImperiumCost, 16105100));
        setDonerPlanet(safeParse(state.donerPlanet, 0));
        setDonerPlanetCost(safeParse(state.donerPlanetCost, 177156100));
        setStartTime(state.startTime || Date.now());
        setClickCount(state.clickCount || 0);
        setGoldenDonerClicked(state.goldenDonerClicked || 0);
        setPurchasedExtensions(state.purchasedExtensions || []);
      } catch (e) {
        console.error("Fehler beim Laden des Spielstands:", e);
      }
    }
  }, []);

  // Save game state to localStorage
  useEffect(() => {
    const stateToSave: Omit<GameState, 'effectiveClickPower' | 'donersPerSecond'> = {
      donerCount,
      totalDonerEarned,
      clickPower,
      autoClickers,
      autoClickerCost,
      donerMesser,
      donerMesserCost,
      donerSpiess,
      donerSpiessCost,
      donerLokal,
      donerLokalCost,
      donerKette,
      donerKetteCost,
      donerImperium,
      donerImperiumCost,
      donerPlanet,
      donerPlanetCost,
      startTime,
      clickCount,
      goldenDonerClicked,
      goldenDonerMultiplier,
      goldenDonerMultiplierEndTime,
      purchasedExtensions,
    };
    localStorage.setItem(CURRENT_STORAGE_KEY, JSON.stringify(stateToSave));
  }, [
    donerCount, totalDonerEarned, clickPower, 
    autoClickers, autoClickerCost, 
    donerMesser, donerMesserCost, 
    donerSpiess, donerSpiessCost, 
    donerLokal, donerLokalCost, 
    donerKette, donerKetteCost, 
    donerImperium, donerImperiumCost, 
    donerPlanet, donerPlanetCost, 
    startTime, clickCount, goldenDonerClicked, goldenDonerMultiplier, goldenDonerMultiplierEndTime, purchasedExtensions
  ]);

  // Extension logic
  const isExtensionPurchased = (extensionId: string): boolean => {
    return purchasedExtensions.includes(extensionId);
  };

  const getApplicableExtensions = (generatorTypeInput?: GeneratorType, effectTypeInput?: ExtensionEffectType): Extension[] => {
    return extensions.filter(ext => 
      isExtensionPurchased(ext.id) &&
      (!generatorTypeInput || ext.generatorAffected === generatorTypeInput || !ext.generatorAffected) && // Handles global extensions too if no generatorAffected
      (!effectTypeInput || ext.effectType === effectTypeInput)
    );
  };

  const buyExtension = (extensionId: string) => {
    const extension = getExtensionById(extensionId);
    if (!extension) {
      console.error(`Extension with ID ${extensionId} not found.`);
      return;
    }

    if (isExtensionPurchased(extensionId)) {
      console.warn(`Extension ${extensionId} already purchased.`);
      return;
    }

    if (donerCount < extension.cost) {
      console.warn(`Not enough Döner to buy ${extension.name}.`);
      return;
    }

    // Check prerequisites
    if (extension.prerequisites) {
      for (const prereq of extension.prerequisites) {
        let currentGeneratorCount = 0;
        switch (prereq.generator) {
          case GeneratorType.AutoClicker: currentGeneratorCount = autoClickers; break;
          case GeneratorType.DonerMesser: currentGeneratorCount = donerMesser; break;
          case GeneratorType.DonerSpiess: currentGeneratorCount = donerSpiess; break;
          case GeneratorType.DonerLokal: currentGeneratorCount = donerLokal; break;
          case GeneratorType.DonerKette: currentGeneratorCount = donerKette; break;
          case GeneratorType.DonerImperium: currentGeneratorCount = donerImperium; break;
          case GeneratorType.DonerPlanet: currentGeneratorCount = donerPlanet; break;
          // Add other generator types if needed for prerequisites
          default:
            console.warn(`Unknown generator type in prerequisite: ${prereq.generator}`);
            return; // Prerequisite not met if generator type is unknown
        }
        if (currentGeneratorCount < prereq.count) {
          console.warn(`Prerequisite for ${extension.name} not met: Need ${prereq.count} of ${prereq.generator}, have ${currentGeneratorCount}.`);
          return;
        }
      }
    }

    setDonerCount(prev => prev - extension.cost);
    setPurchasedExtensions(prev => [...prev, extensionId]);
    console.log(`Purchased extension: ${extension.name}`);
  };

  // Function to calculate effective click power considering extensions
  const calculateEffectiveClickPower = (currentGameState: GameState) => {
    let power = clickPower; // Start with base click power
    const clickExtensions = getApplicableExtensions(undefined, ExtensionEffectType.MULTIPLY_CLICK_POWER);
    clickExtensions.forEach(ext => {
      if (ext.bonusCalculation) {
        // This case is not used by current MULTIPLY_CLICK_POWER extensions, but added for future flexibility
        power *= ext.bonusCalculation(currentGameState); // Pass current game state to calculation 
      } else if (ext.bonusValue !== undefined) {
        power *= ext.bonusValue; // Apply multiplicative bonuses
      }
    });
    return power;
  };

  // Calculate Döner per second with extensions
  // Calculate Döner per second with extensions
  const calculateDps = (currentGameState: GameState) => {
    let totalDps = 0;

    const generatorConfigs: { 
        type: GeneratorType, 
        count: number, 
        baseDpsPerUnit: number 
    }[] = [
      { type: GeneratorType.AutoClicker, count: currentGameState.autoClickers, baseDpsPerUnit: 1 },
      { type: GeneratorType.DonerMesser, count: currentGameState.donerMesser, baseDpsPerUnit: 5 },
      { type: GeneratorType.DonerSpiess, count: currentGameState.donerSpiess, baseDpsPerUnit: 25 },
      { type: GeneratorType.DonerLokal, count: currentGameState.donerLokal, baseDpsPerUnit: 125 },
      { type: GeneratorType.DonerKette, count: currentGameState.donerKette, baseDpsPerUnit: 625 },
      { type: GeneratorType.DonerImperium, count: currentGameState.donerImperium, baseDpsPerUnit: 3125 },
      { type: GeneratorType.DonerPlanet, count: currentGameState.donerPlanet, baseDpsPerUnit: 15625 },
    ];

    generatorConfigs.forEach(config => {
      if (config.count > 0) {
        let dpsForThisGeneratorType = config.count * config.baseDpsPerUnit;

        // Apply ADD_TO_BASE_DPS_OF_GENERATOR extensions
        const addExtensions = getApplicableExtensions(config.type, ExtensionEffectType.ADD_TO_BASE_DPS_OF_GENERATOR);
        addExtensions.forEach(ext => {
          let bonusPerUnit = 0;
          if (ext.bonusCalculation) {
            bonusPerUnit = ext.bonusCalculation(currentGameState);
          } else if (ext.bonusValue !== undefined) {
            bonusPerUnit = ext.bonusValue;
          }
          dpsForThisGeneratorType += config.count * bonusPerUnit; // Bonus is per unit
        });

        // Apply MULTIPLY_GENERATOR_OUTPUT extensions
        const multiplyExtensions = getApplicableExtensions(config.type, ExtensionEffectType.MULTIPLY_GENERATOR_OUTPUT);
        multiplyExtensions.forEach(ext => {
          let multiplier = 1;
          if (ext.bonusCalculation) {
            multiplier = ext.bonusCalculation(currentGameState);
          } else if (ext.bonusValue !== undefined) {
            multiplier = ext.bonusValue;
          }
          dpsForThisGeneratorType *= multiplier;
        });
        totalDps += dpsForThisGeneratorType;
      }
    });

    // Apply MULTIPLY_ALL_OUTPUT extensions
    const globalMultiplyExtensions = getApplicableExtensions(undefined, ExtensionEffectType.MULTIPLY_ALL_OUTPUT);
    globalMultiplyExtensions.forEach(ext => {
      let globalMultiplier = 1;
      if (ext.bonusCalculation) {
        globalMultiplier = ext.bonusCalculation(currentGameState);
      } else if (ext.bonusValue !== undefined) {
        globalMultiplier = ext.bonusValue;
      }
      totalDps *= globalMultiplier;
    });

    return totalDps;
  };


  // Check if multiplier is still active
  useEffect(() => {
    if (goldenDonerMultiplier > 1 && Date.now() > goldenDonerMultiplierEndTime) {
      setGoldenDonerMultiplier(1);
    }
    
    const checkInterval = setInterval(() => {
      if (goldenDonerMultiplier > 1 && Date.now() > goldenDonerMultiplierEndTime) {
        setGoldenDonerMultiplier(1);
      }
    }, 1000);
    
    return () => clearInterval(checkInterval);
  }, [goldenDonerMultiplier, goldenDonerMultiplierEndTime]);

  // Calculate remaining time for the multiplier
  const getRemainingMultiplierTime = () => {
    if (goldenDonerMultiplier <= 1) return 0;
    const remaining = Math.max(0, goldenDonerMultiplierEndTime - Date.now());
    return Math.ceil(remaining / 1000); // In seconds
  };

  // Combine all state into a single object for the context
  // Construct the game state in stages to handle dependencies
  const rawState: Omit<GameState, 'effectiveClickPower' | 'donersPerSecond'> = {
    donerCount,
    totalDonerEarned,
    clickPower,
    autoClickers,
    autoClickerCost,
    donerMesser,
    donerMesserCost,
    donerSpiess,
    donerSpiessCost,
    donerLokal,
    donerLokalCost,
    donerKette,
    donerKetteCost,
    donerImperium,
    donerImperiumCost,
    donerPlanet,
    donerPlanetCost,
    startTime,
    clickCount,
    goldenDonerClicked,
    goldenDonerMultiplier,
    goldenDonerMultiplierEndTime,
    purchasedExtensions,
  };

  // Cast to GameState for calculateEffectiveClickPower, assuming it might read other GameState properties
  // that are not yet fully calculated (like donersPerSecond). This is a common pattern for interdependent calculations.
  // If calculateEffectiveClickPower strictly only needs rawState, this cast can be more specific.
  const effectiveClickPowerValue = calculateEffectiveClickPower(rawState as GameState);

  const intermediateGameState: GameState = {
    ...rawState,
    effectiveClickPower: effectiveClickPowerValue,
    donersPerSecond: 0, // Placeholder before final DPS calculation
  };

  const donersPerSecondValue = calculateDps(intermediateGameState);

  const finalGameState: GameState = {
    ...rawState, // Spreads all properties from rawState
    effectiveClickPower: effectiveClickPowerValue,
    donersPerSecond: donersPerSecondValue,
  };

  // Auto-clicker logic
  useEffect(() => {
    if (finalGameState.donersPerSecond > 0) {
      const interval = setInterval(() => {
        // Add 1/10th of DPS every 100ms, or full DPS if interval is 1000ms.
        // Assuming 1000ms interval based on original code.
        const newDoners = finalGameState.donersPerSecond; 
        setDonerCount(c => c + newDoners);
        setTotalDonerEarned(t => t + newDoners);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [finalGameState.donersPerSecond, setDonerCount, setTotalDonerEarned]);

  const contextValue: GameStateContextType = {
    gameState: finalGameState,
    donerCount: finalGameState.donerCount,
    clickPower: finalGameState.clickPower,
    effectiveClickPower: finalGameState.effectiveClickPower,
    goldenDonerMultiplier: finalGameState.goldenDonerMultiplier,
    setDonerCount,
    setTotalDonerEarned,
    setClickPower,
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
    setClickCount,
    setGoldenDonerClicked,
    setGoldenDonerMultiplier,
    setGoldenDonerMultiplierEndTime,
    donersPerSecond: finalGameState.donersPerSecond,
    getRemainingMultiplierTime,
    buyExtension,
    isExtensionPurchased,
    getApplicableExtensions,
    incrementClickCount,
    buyAutoClicker,
    buyDonerMesser,
  };

  return (
    <GameStateContext.Provider value={contextValue}>
      {children}
    </GameStateContext.Provider>
  );
}

// ... (rest of the code remains the same)
export function useGameState() {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
}
