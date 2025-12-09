import type { Receta } from "@/types/menu-display.type";

export async function enviarFeedback(
  menu: string,
  comida: string,
  receta: Receta,
  voto: "like" | "dislike",
  objective: "perder" | "ganar" | "mantener"
) {
  await fetch("https://nutriplan-worker.kytronapps.workers.dev/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      menu,
      comida,
      receta_nombre: receta.nombre,
      ingredientes: receta.ingredientes,
      preparacion: receta.preparacion,
      voto,
      objetivo: objective, // Ahora SI funciona
    }),
  });

  alert("Gracias por tu valoración ❤️");
}
