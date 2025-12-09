import type { Ingrediente, Receta } from '../../../src/types/menu-display.type';

export interface FeedbackPayload {
	menu: string;
	comida: string;
	receta_nombre: string;
	ingredientes: Ingrediente[];
	preparacion: string[];
	voto: 'like' | 'dislike';
	objetivo: 'perder' | 'ganar' | 'mantener';
}
