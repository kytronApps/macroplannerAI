// ========================================================
// 🟢 Ingredientes
// ========================================================
export interface Ingrediente {
  ingrediente: string;
  cantidad: string;
}

// ========================================================
// 🟢 Receta completa para cada comida
// ========================================================
// Ejemplo:
// {
//   nombre: "Tostadas con huevo",
//   ingredientes: [...],
//   preparacion: [...]
// }
export interface Receta {
  nombre: string;
  ingredientes: Ingrediente[];
  preparacion: string[];
}

// ========================================================
// 🟢 Comidas dentro del menú (Desayuno, Comida, Cena…)
// ========================================================
// Cada clave es el nombre de la comida, y el valor es una Receta
export interface ComidasPorMenu {
  [nombreComida: string]: Receta;
}

// ========================================================
// 🟢 Menú generado
// ========================================================
export interface GeneratedMenu {
  nombre: string;
  comidas: ComidasPorMenu;
  postre: string | null;
}

// ========================================================
// 🟢 Respuesta completa del Worker
// ========================================================
export interface MealPlanResponse {
  menus: GeneratedMenu[];
  error?: string;
}

// ========================================================
// 🟢 Props para el componente MenuDisplay
// ========================================================
export interface MenuDisplayProps {
  mealPlan: MealPlanResponse;
}
