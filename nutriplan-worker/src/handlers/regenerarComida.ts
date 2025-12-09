import type { RegenerarComidaBody } from '../type/regenerar-comida.type';
import { seleccionarListado } from '../utils/seleccionarListado';
import { limpiarRespuesta } from '../utils/cleanup';
import { Groq } from 'groq-sdk';
import { Env } from '../type/env';
import { getCorsHeaders } from '../utils/cors';

export async function regenerarComidaHandler(request: Request, env: Env): Promise<Response> {
	try {
		const body = (await request.json()) as RegenerarComidaBody;

		const { comida, objective } = body;

		const alimentos = seleccionarListado(objective);

		const prompt = `
Genera solo la receta correspondiente a la comida "${comida}".
Devuelve SOLO este JSON:

{
  "receta": {
    "nombre": "Nombre",
    "ingredientes": [
      { "ingrediente": "x", "cantidad": "xxg" }
    ],
    "preparacion": ["Paso 1", "Paso 2"]
  }
}

Reglas:
- No repitas la receta anterior.
- Usa alimentos del listado permitido.
- Mantén coherencia con el objetivo “${objective}”.

ALIMENTOS PERMITIDOS:
HIDRATOS: ${alimentos.hidratos_de_carbono.join(', ')}
PROTEÍNAS: ${alimentos.proteinas.join(', ')}
GRASAS: ${alimentos.grasas.join(', ')}
`;

		const groq = new Groq({ apiKey: env.GROQ_API_KEY });

		const completion = await groq.chat.completions.create({
			model: 'llama-3.1-8b-instant',
			messages: [{ role: 'user', content: prompt }],
			temperature: 0.8,
		});

		const raw = completion.choices?.[0]?.message?.content ?? '{}';
		const cleaned = limpiarRespuesta(raw);

		let json;
		try {
			json = JSON.parse(cleaned);
		} catch {
			json = { error: 'Formato inválido', raw };
		}

		return new Response(JSON.stringify(json), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
				...getCorsHeaders((request.headers.get('Origin') as string) || undefined),
			},
		});
	} catch (err) {
		return new Response(JSON.stringify({ error: String(err) }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
				...getCorsHeaders((request.headers.get('Origin') as string) || undefined),
			},
		});
	}
}
