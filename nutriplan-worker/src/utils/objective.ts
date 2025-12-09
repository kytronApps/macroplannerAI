import type { Objective } from "../type/objective.type";

export function normalizarObjetivo(value: string | undefined): Objective {
  if (value === "perder" || value === "ganar" || value === "mantener") {
    return value;
  }
  return "mantener";
}
