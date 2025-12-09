import type { Receta } from "@/types/menu-display.type";

export async function enviarFeedback(
  menu: string,
  comida: string,
  receta: Receta,
  voto: "like" | "dislike",
  objective: "perder" | "ganar" | "mantener"
) {
  const response = await fetch(
    "https://nutriplan-worker.kytronapps.workers.dev/feedback",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        menu,
        comida,
        receta_nombre: receta.nombre, // ✔ obligatorio
        ingredientes: receta.ingredientes, // ✔ obligatorio
        preparacion: receta.preparacion, // ✔ obligatorio
        voto,
        objetivo: objective, // ✔ obligatorio
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ Error en /feedback:", errorText);
    throw new Error("Error enviando feedback: " + errorText);
  }

  return response.json();
}