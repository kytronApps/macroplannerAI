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
}

export default {
  async fetch(request: Request, env: { GROQ_API_KEY: string }): Promise<Response> {
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
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
      } = body;

      const groq = new Groq({
        apiKey: env.GROQ_API_KEY,
      });

      const prompt = `
Genera ${menuCount || 1} menús saludables y completos basados en:
- Calorías: ${calories}
- Grasas: ${fats}g
- Carbohidratos: ${carbs}g
- Proteínas: ${proteins}g
- Comidas del día: ${meals.join(", ")}
- Postre: ${includeDessert ? "Sí" : "No"}
- Alergias: ${allergies || "ninguna"}
- Preferencias: ${preferences || "ninguna"}
- Intolerancias: ${intolerances || "ninguna"}

Devuelve SOLO JSON válido siguiendo esta estructura EXACTA:

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

      const completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.6,
      });

      const text = completion.choices[0]?.message?.content || "{}";
      const json = JSON.parse(text);

      return new Response(JSON.stringify(json), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });

   } catch (err) {
  const message =
    err instanceof Error ? err.message : "Unknown error occurred";

  return new Response(
    JSON.stringify({ error: message }),
    {
      status: 500,
      headers: { "Content-Type": "application/json" },
    }
  );
}
  },
};
