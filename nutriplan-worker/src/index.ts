import { Groq } from "groq-sdk";
import type { MealRequest } from "./type/index.type";

// 🟢 IMPORTACIÓN DIRECTA DE JSONS
import perdidaGrasa from "./data/perdida-grasa.json";
import gananciaMasa from "./data/ganancia-masa.json";

const allowedOrigin = "https://macroplannerai.web.app";

const corsHeaders = {
  "Access-Control-Allow-Origin": allowedOrigin,
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// -------------------------------------------------------
// 🔵 Seleccionar automáticamente el JSON según objetivo
// -------------------------------------------------------
function seleccionarListado(objective: string) {
  if (objective === "perder") {
    console.log("📉 Usando listado de PÉRDIDA DE GRASA");
    return perdidaGrasa; // :contentReference[oaicite:2]{index=2}
  }
  if (objective === "ganar") {
    console.log("💪 Usando listado de GANANCIA DE MASA");
    return gananciaMasa; // :contentReference[oaicite:3]{index=3}
  }

  console.log("⚖️ Usando mezcla para mantener peso");
  return {
    hidratos_de_carbono: [
      ...perdidaGrasa.hidratos_de_carbono.slice(0, 15),
      ...gananciaMasa.hidratos_de_carbono.slice(0, 15),
    ],
    proteinas: [
      ...perdidaGrasa.proteinas.slice(0, 15),
      ...gananciaMasa.proteinas.slice(0, 15),
    ],
    grasas: [
      ...perdidaGrasa.grasas.slice(0, 15),
      ...gananciaMasa.grasas.slice(0, 15),
    ],
  };
}

// ===================================================================
// 🟣 WORKER PRINCIPAL
// ===================================================================

export default {
  async fetch(request: Request, env: { GROQ_API_KEY: string }): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: corsHeaders,
      });
    }

    try {
      const body = (await request.json()) as MealRequest;
      console.log("📥 BODY RECIBIDO:", body);

      const {
        calories,
        fats,
        carbs,
        proteins,
        meals,
        includeDessert,
        allergies,
        preferences,
        intolerances,
        menuCount,
        objective,
      } = body;

      const groq = new Groq({ apiKey: env.GROQ_API_KEY });

      // 🔵 Selección de alimentos según objetivo
      const alimentos = seleccionarListado(objective);
      console.log("🍎 ALIMENTOS SELECCIONADOS:", alimentos);

      // -------------------------------------------------------
      // 🔥 Prompt ultra limpio usando tus JSON directamente
      // -------------------------------------------------------
      const prompt = `
Eres un generador de menús. Devuelve SOLO JSON válido. No escribas nada fuera del JSON.

Genera exactamente ${menuCount} menús saludables adecuados para el objetivo: "${objective}".

SOLO puedes usar los siguientes alimentos (no inventes ingredientes):

HIDRATOS: ${alimentos.hidratos_de_carbono.join(", ")}
PROTEÍNAS: ${alimentos.proteinas.join(", ")}
GRASAS: ${alimentos.grasas.join(", ")}

Estructura EXACTA que debes devolver:

{
  "menus": [
    {
      "nombre": "Menú 1",
      "comidas": {
        "Desayuno": [ { "ingrediente": "x", "cantidad": "50g" } ],
        "Comida": [],
        "Merienda": [],
        "Cena": []
      },
      "postre": ${includeDessert ? `"un postre permitido"` : "null"}
    }
  ]
}

Reglas:
- Las comidas deben usar ingredientes EXCLUSIVAMENTE del listado permitido (o equivalentes directos del mismo grupo nutricional).
- Los INGREDIENTES pueden repetirse entre comidas o menús sin problema.
- Los NOMBRES de los menús deben ser distintos entre sí ("Menú 1", "Menú 2", etc.).
- Deben aparecer ÚNICAMENTE las comidas seleccionadas por el usuario: ${meals.join(", ")}
- No incluir alimentos prohibidos ni inventados.
- No añadir texto fuera del JSON.
`;

      console.log("📝 PROMPT ENVIADO:", prompt);

      // -------------------------------------------------------
      // 🔥 Llamada al modelo
      // -------------------------------------------------------
      const completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
      });

      const raw = completion.choices?.[0]?.message?.content || "{}";
      console.log("🟣 RAW DE GROQ:", raw);

      // LIMPIAR
      let cleaned = raw
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      console.log("🟡 CLEANED:", cleaned);

      const firstBrace = cleaned.search(/\{/);
      const lastBrace = cleaned.search(/\}[^}]*$/);

      if (firstBrace !== -1 && lastBrace !== -1) {
        cleaned = cleaned.substring(firstBrace, lastBrace + 1);
      }

      console.log("🟢 JSON CANDIDATE:", cleaned);

      // PARSEAR
      let json;
      try {
        json = JSON.parse(cleaned);
        console.log("✅ JSON PARSEADO:", json);
      } catch (e) {
        console.log("❌ ERROR PARSE JSON:", e);
        json = { menus: [], error: "JSON parse error", raw };
      }

      if (!Array.isArray(json.menus)) {
        json.menus = [];
      }

      return new Response(JSON.stringify(json), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    } catch (err) {
      console.log("💥 ERROR GENERAL:", err);

      return new Response(JSON.stringify({ menus: [], error: String(err) }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }
  },
};
