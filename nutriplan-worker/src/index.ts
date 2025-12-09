import type { Env } from './type/env';
import type { MealRequest } from './type/index.type';

import { Groq } from 'groq-sdk';
import { getCorsHeaders } from './utils/cors';
import { seleccionarListado } from './utils/seleccionarListado';
import { limpiarRespuesta } from './utils/cleanup';
import { generarMenuPrompt } from './prompts/generarMenuPrompt';
import { feedbackHandler } from './handlers/feedbackHandler';
import { normalizarObjetivo } from './utils/objective';
import type { Objective } from './type/objective.type';
import { regenerarComidaHandler } from './handlers/regenerarComida';
import { regenerarMenuHandler } from './handlers/regenerarMenu';
import { getFeedbackContext } from './utils/getFeedbackContext'; // ⬅️ IMPORTAR

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);
		const origin = request.headers.get('Origin') || undefined;

		// 🟦 CORS PREFLIGHT
		if (request.method === 'OPTIONS') {
			const headers = getCorsHeaders(origin);
			return new Response(null, {
				status: 204,
				headers,
			});
		}

		// 🟪 ROUTES DEL WORKER
		if (url.pathname === '/feedback' && request.method === 'POST') {
			return await feedbackHandler(request, env);
		}

		if (url.pathname === '/regenerar/comida' && request.method === 'POST') {
			return await regenerarComidaHandler(request, env);
		}

		if (url.pathname === '/regenerar/menu' && request.method === 'POST') {
			return await regenerarMenuHandler(request, env);
		}

		// 🟥 SOLO POST permitido para ruta principal
		if (request.method !== 'POST') {
			const headers = getCorsHeaders(origin);
			return new Response('Method Not Allowed', {
				status: 405,
				headers,
			});
		}

		// 🟧 GENERACIÓN DE MENÚ NORMAL
		try {
			const body = (await request.json()) as MealRequest;

			const objetivoSeguro: Objective = normalizarObjetivo(body.objective);
			const alimentos = seleccionarListado(objetivoSeguro);
			
			// ⬅️ OBTENER CONTEXTO DE FEEDBACK
			const feedbackContext = await getFeedbackContext(
				env,
				objetivoSeguro,
				body.meals
			);

			const prompt = generarMenuPrompt({
				menuCount: body.menuCount,
				objective: objetivoSeguro,
				alimentos,
				meals: body.meals,
				allergies: body.allergies,
				preferences: body.preferences,
				intolerances: body.intolerances,
				feedbackContext, // ⬅️ PASAR CONTEXTO
			});

			const groq = new Groq({ apiKey: env.GROQ_API_KEY });

			const completion = await groq.chat.completions.create({
				model: 'llama-3.1-8b-instant',
				messages: [{ role: 'user', content: prompt }],
				temperature: 0.7,
			});

			const raw = completion.choices?.[0]?.message?.content ?? '{}';
			const cleaned = limpiarRespuesta(raw);

			const json = JSON.parse(cleaned);

			const headers = {
				'Content-Type': 'application/json',
				...getCorsHeaders(origin),
			};

			return new Response(JSON.stringify(json), {
				status: 200,
				headers,
			});
		} catch (err) {
			console.error('💥 ERROR GENERAL:', err);

			const headers = {
				'Content-Type': 'application/json',
				...getCorsHeaders(origin),
			};

			return new Response(JSON.stringify({ menus: [], error: String(err) }), {
				status: 500,
				headers,
			});
		}
	},
};