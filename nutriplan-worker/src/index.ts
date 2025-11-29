import { Groq } from 'groq-sdk';
import type { MealRequest } from './type/index.type';

const allowedOrigin = 'https://macroplannerai.web.app';

const corsHeaders = {
	'Access-Control-Allow-Origin': allowedOrigin,
	'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
	async fetch(request: Request, env: { GROQ_API_KEY: string }): Promise<Response> {
		// 1) Preflight
		if (request.method === 'OPTIONS') {
			return new Response(null, { status: 204, headers: corsHeaders });
		}

		// 2) Solo POST
		if (request.method !== 'POST') {
			return new Response('Method Not Allowed', {
				status: 405,
				headers: corsHeaders,
			});
		}

		try {
			// 3) Body → MealRequest
			const body = (await request.json()) as MealRequest;

			const { calories, fats, carbs, proteins, meals, includeDessert, allergies, preferences, intolerances, menuCount, objective } = body;

			const groq = new Groq({ apiKey: env.GROQ_API_KEY });

			// 4) Prompt limpio
			const prompt = `
Genera ${menuCount || 1} menús saludables basados en:
- Objetivo: ${objective || 'no especificado'}
- Calorías: ${calories}
- Grasas: ${fats}g
- Carbohidratos: ${carbs}g
- Proteínas: ${proteins}g
- Comidas del día: ${meals.join(', ')}
- Alergias: ${allergies || 'ninguna'}
- Intolerancias: ${intolerances || 'ninguna'}
- Preferencias: ${preferences || 'ninguna'}

${
	includeDessert
		? `INSTRUCCIÓN CRÍTICA: Cada menú debe incluir un postre detallado en el campo "postre" y NO en las comidas.`
		: `INSTRUCCIÓN CRÍTICA: El campo "postre" debe ser null.`
}

${menuCount > 1 ? `Los nombres de CADA menú deben ser únicos (ej: "Menú 1", "Menú 2").` : ''}

INSTRUCCIÓN CLAVE: El valor de CADA comida (Desayuno, Comida, etc.) debe ser SIEMPRE un ARRAY DE OBJETOS [{ "ingrediente": "x", "cantidad": "y" }], incluso si está vacío.

Devuelve SOLO JSON válido EXACTO con el siguiente formato:
{
  "menus": [
    {
      "nombre": "Menú 1",
      "comidas": {
        "Desayuno": [
          { "ingrediente": "alimento", "cantidad": "50g" }
        ],
        "Comida": [],
        "Merienda": [],
        "Cena": []
      },
      "postre": "texto o null"
    }
  ]
}
`;

			// 5) Llamada al modelo
			const completion = await groq.chat.completions.create({
				model: 'llama-3.1-8b-instant',
				messages: [{ role: 'user', content: prompt }],
				temperature: 0.6,
			});

			const raw = completion.choices?.[0]?.message?.content || '{}';

			// 🟢 CORRECCIÓN 1: Limpieza del Markdown/bloques de código antes de parsear (Ya lo tienes implementado)
			let cleaned = raw
				.replace(/```json/g, '')
				.replace(/```/g, '')
				.replace(/^\s+|\s+$/g, '');

			// Intenta extraer JSON real aunque venga rodeado de texto
			const firstBrace = cleaned.indexOf('{');
			const lastBrace = cleaned.lastIndexOf('}');

			if (firstBrace !== -1 && lastBrace !== -1) {
				cleaned = cleaned.substring(firstBrace, lastBrace + 1);
			}

			let json;
			try {
				json = JSON.parse(cleaned);
			} catch {
				json = { menus: [], error: 'JSON parse error', raw };
			}

			if (!json.menus || !Array.isArray(json.menus)) {
				json.menus = [];
			}

			// 7) Respuesta final
			return new Response(JSON.stringify(json), {
				status: 200,
				headers: {
					'Content-Type': 'application/json',
					...corsHeaders,
				},
			});
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Unknown error';

			return new Response(JSON.stringify({ menus: [], error: message }), {
				status: 500,
				headers: {
					'Content-Type': 'application/json',
					...corsHeaders,
				},
			});
		}
	},
};
