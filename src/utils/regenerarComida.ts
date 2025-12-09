import type { Receta } from "@/types/menu-display.type";
import type { Objective } from "@/types/objective.type";

export async function regenerarComida(
  objective: Objective,
  comida: string,
  receta_actual: Receta,
  meals: string[]
) {
  const response = await fetch(
    "https://nutriplan-worker.kytronapps.workers.dev/regenerar/comida",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        comida,
        receta_actual,
        objective,
        meals
      })
    }
  );

  if (!response.ok) {
    throw new Error("Error regenerando comida");
  }

  return response.json();
}