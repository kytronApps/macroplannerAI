export interface MealRequest {
  calories: number;
  fats: number;
  carbs: number;
  proteins: number;
  meals: string[];
  includeDessert: boolean;
  allergies: string;
  preferences: string;
  intolerances: string;
  menuCount: number;
  objective?: string;
}
