// utils/getFeedbackContext.ts
import type { Env } from '../type/env';
import { getDB } from './db';




function isFeedbackRow(row: unknown): row is FeedbackRow {
  if (typeof row !== "object" || row === null) return false;

  const r = row as Record<string, unknown>;

  return (
    typeof r.receta_nombre === "string" &&
    typeof r.ingredientes === "string" &&
    typeof r.preparacion === "string" &&
    typeof r.comida === "string"
  );
}





interface FeedbackRow {
  receta_nombre: string;
  ingredientes: string;
  preparacion: string;
  comida: string;
}

export async function getFeedbackContext(
  env: Env,
  objective: string,
  meals: string[]
): Promise<string> {
  const db = getDB(env);

  // Obtener recetas con feedback positivo similar al contexto actual
  const positiveRecipes = await db
    .prepare(
      `
      SELECT receta_nombre, ingredientes, preparacion, comida
      FROM feedback
      WHERE vote = 'like'
        AND objetivo = ?
        AND comida IN (${meals.map(() => '?').join(',')})
      ORDER BY fecha DESC
      LIMIT 10
    `
    )
    .bind(objective, ...meals)
    .all();

  // Obtener recetas con feedback negativo para evitarlas
  const negativeRecipes = await db
    .prepare(
      `
      SELECT receta_nombre, ingredientes, preparacion, comida
      FROM feedback
      WHERE vote = 'dislike'
        AND objetivo = ?
      ORDER BY fecha DESC
      LIMIT 5
    `
    )
    .bind(objective)
    .all();

  let context = '';

if (positiveRecipes.results?.length) {
  context += "\n📊 RECETAS QUE GUSTARON AL USUARIO:\n";

  for (const row of positiveRecipes.results) {
    if (isFeedbackRow(row)) {
      context += `- ${row.comida}: "${row.receta_nombre}"\n`;
    }
  }
}

if (negativeRecipes.results?.length) {
  context += "\n⛔ EVITAR RECETAS SIMILARES A:\n";

  for (const row of negativeRecipes.results) {
    if (isFeedbackRow(row)) {
      context += `- "${row.receta_nombre}"\n`;
    }
  }
}


  return context;
}