// src/data/extensions.ts
import type { GameState } from '../components/GameStateContext'; // adjust path as needed

export enum GeneratorType {
  AutoClicker = 'autoClicker',
  DonerMesser = 'donerMesser',
  DonerSpiess = 'donerSpiess',
  DonerLokal = 'donerLokal',
  DonerKette = 'donerKette',
  DonerImperium = 'donerImperium',
  DonerPlanet = 'donerPlanet',
  ClickPower = 'clickPower', // Für Klick-bezogene Upgrades
}

export enum ExtensionEffectType {
  MULTIPLY_GENERATOR_OUTPUT = 'MULTIPLY_GENERATOR_OUTPUT', // Multipliziert den Output eines spezifischen Generatortyps
  MULTIPLY_ALL_OUTPUT = 'MULTIPLY_ALL_OUTPUT',         // Multipliziert den Output aller Generatoren
  MULTIPLY_CLICK_POWER = 'MULTIPLY_CLICK_POWER',       // Multipliziert die Klick-Power
  ADD_TO_BASE_DPS_OF_GENERATOR = 'ADD_TO_BASE_DPS_OF_GENERATOR', // Fügt jedem Generator dieses Typs einen flachen Betrag hinzu
}

export interface ExtensionPrerequisite {
  generator: GeneratorType;
  count: number;
}

export interface Extension {
  id: string; // Eindeutige ID für die Erweiterung
  name: string;
  description: string;
  cost: number;
  generatorAffected?: GeneratorType; // Welchen Generator diese Erweiterung primär beeinflusst (optional für globale Upgrades)
  effectType: ExtensionEffectType;
  bonusValue?: number; // Static bonus, e.g., +5 DPS, or multiplier value like 2 (for 2x)
  bonusCalculation?: (gameState: GameState) => number; // Dynamic bonus calculation
  prerequisites?: ExtensionPrerequisite[]; // z.B. muss 1 AutoClicker besitzen
  icon?: string; // Pfad zu einem Icon-Bild (optional)
  flavorText?: string; // Optionaler Fließtext
}

export const extensions: Extension[] = [
  // AutoClicker Erweiterungen
  {
    id: 'ac_dönerschulung',
    name: 'Dönerschulung',
    description: 'Dönermeister sind doppelt so effizient.',
    cost: 1000,
    generatorAffected: GeneratorType.AutoClicker,
    effectType: ExtensionEffectType.MULTIPLY_GENERATOR_OUTPUT,
    bonusValue: 2,
    prerequisites: [{ generator: GeneratorType.AutoClicker, count: 1 }],
    icon: '🔧',
  },
  {
    id: 'ac_dönerprüfung',
    name: 'Dönerprüfung',
    description: 'Dönermeister sind NOCHMAL doppelt so effizient.',
    cost: 5000,
    generatorAffected: GeneratorType.AutoClicker,
    effectType: ExtensionEffectType.MULTIPLY_GENERATOR_OUTPUT,
    bonusValue: 2, // Beachte: Die Logik, wie Boni gestapelt werden, müssen wir im GameStateContext implementieren
    prerequisites: [{ generator: GeneratorType.AutoClicker, count: 10 }],
    icon: '🔩',
  },
  // Dönermesser Erweiterungen
  {
    id: 'dm_sharper_blades',
    name: 'Schärfere Klingen',
    description: 'Jedes Dönermesser produziert +2 Döner pro Sekunde zusätzlich.',
    cost: 2500,
    generatorAffected: GeneratorType.DonerMesser,
    effectType: ExtensionEffectType.ADD_TO_BASE_DPS_OF_GENERATOR,
    // bonusValue: 2, // Replaced by dynamic calculation
    bonusCalculation: (gameState) => gameState.clickPower, // Each DonerMesser gets +current clickPower DPS
    prerequisites: [{ generator: GeneratorType.DonerMesser, count: 1 }],
    icon: '🔪',
  },
  // Klick-Power Erweiterungen
  {
    id: 'cp_ergonomic_grip',
    name: 'Ergonomischer Griff',
    description: 'Deine Klicks sind doppelt so stark.',
    cost: 500,
    generatorAffected: GeneratorType.ClickPower, // Spezieller Typ für Klick-Upgrades
    effectType: ExtensionEffectType.MULTIPLY_CLICK_POWER,
    bonusValue: 2,
    // prerequisites: [], // Keine Generator-Voraussetzung, vielleicht später eine Gesamt-Klick-Anzahl?
    icon: '🖱️',
  },
  // Globale Erweiterungen
  {
    id: 'global_motivation',
    name: 'Motivationsschub',
    description: 'Alle Dönerproduktionen sind um 10% effektiver.',
    cost: 100000,
    // generatorAffected ist hier nicht nötig, da es global wirkt
    effectType: ExtensionEffectType.MULTIPLY_ALL_OUTPUT,
    bonusValue: 1.1, // Stellt eine 10%ige Steigerung dar
    prerequisites: [{generator: GeneratorType.DonerLokal, count: 1}], // Beispiel: Wird freigeschaltet, wenn man ein Döner-Lokal besitzt
    icon: '🚀',
  }
];

// Hilfsfunktion, um eine bestimmte Erweiterung anhand ihrer ID zu erhalten (optional, aber nützlich)
export const getExtensionById = (id: string): Extension | undefined => {
  return extensions.find(ext => ext.id === id);
};