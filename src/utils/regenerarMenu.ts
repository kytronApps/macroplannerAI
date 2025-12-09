import type { Objective } from "@/types/objective.type";


export async function regenerarMenu(
  objective: Objective,
  meals: string[]
) {
  const response = await fetch(
    "https://nutriplan-worker.kytronapps.workers.dev/regenerar/menu",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        objective,
        meals
      })
    }
  );

  if (!response.ok) {
    throw new Error("Error regenerando menú");
  }

  return response.json();
}