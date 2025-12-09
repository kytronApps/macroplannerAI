export interface Ingrediente {
  ingrediente: string;
  cantidad: string;
}

export interface Receta {
  nombre: string;
  ingredientes: Ingrediente[];
  preparacion: string[];
}