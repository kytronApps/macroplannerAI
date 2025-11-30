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
// 🔵 Seleccionar alimentos según objetivo
// -------------------------------------------------------
function seleccionarListado(objective: string) {
  if (objective === "perder") {
    console.log("📉 Usando listado de PÉRDIDA DE GRASA");
    return perdidaGrasa;
  }
  if (objective === "ganar") {
    console.log("💪 Usando listado de GANANCIA DE MASA");
    return gananciaMasa;
  }

  console.log("⚖️ Usando mezcla para mantener peso");
  return {
    hidratos_de_carbono: [
      ...perdidaGrasa.hidratos_de_carbono.slice(0, 20),
      ...gananciaMasa.hidratos_de_carbono.slice(0, 20),
    ],
    proteinas: [
      ...perdidaGrasa.proteinas.slice(0, 20),
      ...gananciaMasa.proteinas.slice(0, 20),
    ],
    grasas: [
      ...perdidaGrasa.grasas.slice(0, 20),
      ...gananciaMasa.grasas.slice(0, 20),
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

      const alimentos = seleccionarListado(objective);
      console.log("🍎 ALIMENTOS SELECCIONADOS:", alimentos);

      // -------------------------------------------------------
      // 🔥 PROMPT PROFESIONAL (Mini-recetas reales)
      // -------------------------------------------------------
      const prompt = `
Eres un generador experto de menús reales. Devuelve SOLO JSON válido.

Genera exactamente ${menuCount} menús saludables para el objetivo "${objective}".

SOLO puedes usar los siguientes alimentos:

HIDRATOS: ${alimentos.hidratos_de_carbono.join(", ")}
PROTEÍNAS: ${alimentos.proteinas.join(", ")}
GRASAS: ${alimentos.grasas.join(", ")}

FORMATO EXACTO a devolver:

{
  "menus": [
    {
      "nombre": "Menú 1",
      "comidas": {
        "Desayuno": {
          "nombre": "Nombre de la receta",
          "ingredientes": [
            { "ingrediente": "x", "cantidad": "50g" }
          ],
          "preparacion": ["Paso 1", "Paso 2"]
        },
        "Comida": { ... },
        "Merienda": { ... },
        "Cena": { ... }
      },
      "postre": "postre saludable"
    }
  ]
}

INSTRUCCIONES PARA GENERAR LAS RECETAS:
- Cada comida debe ser una *mini-receta*, igual en estilo a las del PDF proporcionado:
  • Nombre apetitoso (ej: "Curry japonés ligero", "Poke bowl simple", "Ramen rápido").
  • 2–4 ingredientes permitidos.
  • Cantidades realistas: “80g arroz cocido”, “120g pollo”, “10ml AOVE”.
  • 1–3 pasos de preparación muy breves y claros.
- NO generes comidas aburridas como "patata" o "yogur". Deben ser platos reales.

REGLAS:
- Usa únicamente los alimentos del listado permitido o verduras/hierbas libres.
- Las comidas generadas deben ser SOLO: ${meals.join(", ")}
- Cada menú debe tener un postre DIFERENTE (NO repetir).
- Los INGREDIENTES pueden repetirse entre comidas, las recetas NO.
- Los nombres de los menús deben ser únicos.
- No añadas nada fuera del JSON.
`;

      console.log("📝 PROMPT ENVIADO:", prompt);

      // -------------------------------------------------------
      // 🔥 Llamada al modelo
      // -------------------------------------------------------
      const completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });

      const raw = completion.choices?.[0]?.message?.content || "{}";
      console.log("🟣 RAW DE GROQ:", raw);

      // LIMPIEZA DE MARKDOWN
      let cleaned = raw
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      const firstBrace = cleaned.search(/\{/);
      const lastBrace = cleaned.search(/\}[^}]*$/);

      if (firstBrace !== -1 && lastBrace !== -1) {
        cleaned = cleaned.substring(firstBrace, lastBrace + 1);
      }

      console.log("🟢 JSON CANDIDATE:", cleaned);

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
