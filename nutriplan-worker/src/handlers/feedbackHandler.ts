import type { Env } from '../type/env';
import type { FeedbackPayload } from '../type/feedback.type';
import { getDB } from '../utils/db';
import { getCorsHeaders } from '../utils/cors';

export async function feedbackHandler(request: Request, env: Env): Promise<Response> {
	try {
		const body = (await request.json()) as FeedbackPayload;

		const { menu, comida, receta_nombre, ingredientes, preparacion, vote, objetivo } = body;

		if (!menu || !comida || !receta_nombre || !vote) {
			return new Response(JSON.stringify({ error: 'Faltan datos obligatorios' }), { status: 400 });
		}

		const fecha = new Date().toISOString();
		const db = getDB(env);

		await db
			.prepare(
				`
      INSERT INTO feedback (menu, comida, receta_nombre, ingredientes, preparacion, vote, objetivo, fecha)
      VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)
      `
			)
			.bind(menu, comida, receta_nombre, JSON.stringify(ingredientes), JSON.stringify(preparacion), vote, objetivo, fecha)
			.run();

		return new Response(JSON.stringify({ success: true }), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
				...getCorsHeaders((request.headers.get('Origin') as string) || undefined),
			},
		});
	} catch (err) {
		console.error('❌ Error en /feedback:', err);
		return new Response(JSON.stringify({ error: 'Error guardando feedback' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
				...getCorsHeaders((request.headers.get('Origin') as string) || undefined),
			},
		});
	}
}
