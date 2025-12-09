import type { Env } from "../type/env";
import type { FeedbackPayload } from "../type/feedback.type";
import { getDB } from "../utils/db";

export async function feedbackHandler(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    const body = (await request.json()) as FeedbackPayload;

    const {
      menu,
      comida,
      receta_nombre,
      ingredientes,
      preparacion,
      voto,
      objetivo,
    } = body;

    if (!menu || !comida || !receta_nombre || !voto) {
      return new Response(
        JSON.stringify({ error: "Faltan datos obligatorios" }),
        { status: 400 }
      );
    }

    const fecha = new Date().toISOString();
    const db = getDB(env);

    await db
      .prepare(
        `
      INSERT INTO feedback (menu, comida, receta_nombre, ingredientes, preparacion, voto, objetivo, fecha)
      VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)
      `
      )
      .bind(
        menu,
        comida,
        receta_nombre,
        JSON.stringify(ingredientes),
        JSON.stringify(preparacion),
        voto,
        objetivo,
        fecha
      )
      .run();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Error en /feedback:", err);
    return new Response(JSON.stringify({ error: "Error guardando feedback" }), {
      status: 500,
    });
  }
}
