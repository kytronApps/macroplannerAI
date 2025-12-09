import type { Env } from './type/env';
import type { MealRequest } from './type/index.type';

import { Groq } from 'groq-sdk';
import { corsHeaders } from './utils/cors';
import { seleccionarListado } from './utils/seleccionarListado';
import { limpiarRespuesta } from './utils/cleanup';
import { generarMenuPrompt } from './prompts/generarMenuPrompt';
import { feedbackHandler } from './handlers/feedbackHandler';
import { normalizarObjetivo } from './utils/objective';
import type { Objective } from './type/objective.type';

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);

		if (url.pathname === '/feedback' && request.method === 'POST') {
			return feedbackHandler(request, env);
		}

		if (request.method === 'OPTIONS') {
			return new Response(null, { status: 204, headers: corsHeaders });
		}

		if (request.method !== 'POST') {
			return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
		}

		try {
			const body = (await request.json()) as MealRequest;

			const groq = new Groq({ apiKey: env.GROQ_API_KEY });
			const objetivoSeguro: Objective = normalizarObjetivo(body.objective);
			const alimentos = seleccionarListado(objetivoSeguro);

			const prompt = generarMenuPrompt({
				menuCount: body.menuCount,
				objective: objetivoSeguro,
				alimentos,
				meals: body.meals,
			});

			const completion = await groq.chat.completions.create({
				model: 'llama-3.1-8b-instant',
				messages: [{ role: 'user', content: prompt }],
				temperature: 0.7,
			});

			const raw = completion.choices?.[0]?.message?.content || '{}';
			const cleaned = limpiarRespuesta(raw);

			const json = JSON.parse(cleaned);

			return new Response(JSON.stringify(json), {
				status: 200,
				headers: {
					'Content-Type': 'application/json',
					...corsHeaders,
				},
			});
		} catch (err) {
			console.error('💥 ERROR GENERAL:', err);
			return new Response(JSON.stringify({ menus: [], error: String(err) }), {
				status: 500,
				headers: {
					'Content-Type': 'application/json',
					...corsHeaders,
				},
			});
		}
	},
};
