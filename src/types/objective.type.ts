/**
 * Objetivos válidos del plan nutricional
 */
export type Objective = "perder" | "ganar" | "mantener";

/**
 * Comprobador de tipo
 */
export function isObjective(value: unknown): value is Objective {
  return value === "perder" || value === "ganar" || value === "mantener";
}

/**
 * Normaliza cualquier valor recibido para convertirlo en un Objective válido.
 * Si no coincide, se asigna "mantener" como fallback seguro.
 */
export function normalizarObjetivo(value: unknown): Objective {
  if (isObjective(value)) return value;
  if (typeof value === "string") {
    const v = value.toLowerCase().trim();
    if (v === "perder" || v === "perdida" || v === "bajar") return "perder";
    if (v === "ganar" || v === "subir" || v === "masa") return "ganar";
  }
  return "mantener";
}