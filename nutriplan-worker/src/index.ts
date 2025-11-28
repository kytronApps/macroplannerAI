import { Groq } from "groq-sdk";

interface MealRequest {
  calories: number;
  fats: number;
  carbs: number;
  proteins: number;
  meals: string[];
  includeDessert: boolean;
  allergies: string;
  preferences: string;
  intolerances: string;
  menuCount: number;
  objective?: string;
}

// ===============================
//   🔥 CORS CONFIG
// ===============================
const allowedOrigin = "https://macroplannerai.web.app";

const corsHeaders = {
  "Access-Control-Allow-Origin": allowedOrigin,
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request: Request, env: { GROQ_API_KEY: string }): Promise<Response> {

    // 1️⃣ OPTIONS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // 2️⃣ Solo POST permitido
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: corsHeaders,
      });
    }

    try {
      const body = (await request.json()) as MealRequest;

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

      // 3️⃣ Prompt
      const prompt = `
Genera ${menuCount || 1} menús saludables y completos basados en:
- Objetivo: ${objective || "no especificado"}
- Calorías: ${calories}
- Grasas: ${fats}g
- Carbohidratos: ${carbs}g
- Proteínas: ${proteins}g
- Comidas del día: ${meals.join(", ")}
- Postre: ${includeDessert ? "Sí" : "No"}
- Alergias: ${allergies || "ninguna"}
- Preferencias: ${preferences || "ninguna"}
- Intolerancias: ${intolerances || "ninguna"}

Devuelve SOLO JSON válido EXACTO:
{
  "menus": [
    {
      "nombre": "Menú 1",
      "comidas": {
        "Desayuno": "texto",
        "Comida": "texto",
        "Merienda": "texto",
        "Cena": "texto"
      },
      "postre": "texto o null"
    }
  ]
}
`;

      // 4️⃣ Llamada al modelo
      const completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.6,
      });

      const text = completion.choices[0]?.message?.content || "{}";

      // 5️⃣ Parseo SEGURO (esto evita crasheos)
      let json;
      try {
        json = JSON.parse(text);
      } catch (e) {
        json = { menus: [] }; // fallback seguro
      }

      // Si el modelo no devuelve "menus"
      if (!json.menus || !Array.isArray(json.menus)) {
        json.menus = [];
      }

      // 6️⃣ Respuesta final
      return new Response(JSON.stringify(json), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });

    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";

      return new Response(JSON.stringify({ menus: [], error: message }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }
  },
};
