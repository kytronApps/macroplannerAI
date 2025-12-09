export const allowedOrigin = 'https://macroplannerai.web.app';

const devAllowlist = [
	'http://localhost:5173',
	'http://localhost:3000',
	'http://localhost:8080',
	'http://localhost:8081',
	'http://127.0.0.1:5173',
	'http://127.0.0.1:3000',
	'http://127.0.0.1:8080',
	'http://127.0.0.1:8081',
];

export function getCorsHeaders(requestOrigin?: string) {
	const origin = requestOrigin || '';

	// Si el origin coincide con el dominio de producción permitido, usarlo.
	if (origin === allowedOrigin) {
		return {
			'Access-Control-Allow-Origin': allowedOrigin,
			'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
		};
	}

	// Permitir localhost durante desarrollo si viene en la lista.
	if (devAllowlist.includes(origin)) {
		return {
			'Access-Control-Allow-Origin': origin,
			'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
		};
	}

	// Fallback estricto: exponer sólo el origin de producción.
	return {
		'Access-Control-Allow-Origin': allowedOrigin,
		'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type',
	};
}
