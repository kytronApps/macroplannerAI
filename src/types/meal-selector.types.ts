
export interface MealSelectorProps {
  selectedMeals: string[];
  includeDessert: boolean;
  menuCount: number;
  onMealToggle: (meal: string) => void;
  onDessertToggle: (checked: boolean) => void;
  onMenuCountChange: (value: number) => void;
}