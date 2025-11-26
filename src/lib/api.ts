export async function generateMealPlan(payload: any) {
  const response = await fetch("https://nutriplan-worker.kytronapps.workers.dev", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`HTTP Error ${response.status}`);
  }

  return response.json();
}
