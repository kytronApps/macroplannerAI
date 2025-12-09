export type Objective = "perder" | "ganar" | "mantener";

// Verifica si el valor es exactamente un Objective válido
export function isObjective(value: unknown): value is Objective {
  return value === "perder" || value === "ganar" || value === "mantener";
}

// Convierte cualquier input en un Objective seguro
export function normalizarObjetivo(value: unknown): Objective {
  if (isObjective(value)) return value;

  if (typeof value === "string") {
    const v = value.toLowerCase().trim();

    if (v.startsWith("per") || v.includes("bajar")) return "perder";
    if (v.startsWith("gan") || v.includes("subir")) return "ganar";
  }

  return "mantener"; // fallback seguro
}