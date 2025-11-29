// src/types/exchange-calculator.types.ts (CORREGIDO)

export type ObjectiveType = "perder" | "ganar" | "mantener"; 

export interface ExchangeCalculatorProps {
  fats: number;
  carbs: number;
  proteins: number;
  objective: ObjectiveType; 
  dynamicPortion: number; 
}