export interface Ingrediente {
  ingrediente: string;
  cantidad: string;
}

export interface Comida {
  [key: string]: Ingrediente[];
}

export interface GeneratedMenu {
  nombre: string;
  comidas: Comida;
  postre: string | null;
}

export interface MealPlanResponse {
  menus: GeneratedMenu[];
  error?: string;
}

export interface MenuDisplayProps {
  mealPlan: MealPlanResponse;
}
