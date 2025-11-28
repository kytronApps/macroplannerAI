
export type ObjectiveType = "perder" | "ganar" | "mantener"; 

export interface ExchangeCalculatorProps {
  fats: number;
  carbs: number;
  proteins: number;
  objective: ObjectiveType; 
}