import type { MenuPromptParams } from '../type/prompt.type';

export function generarMenuPrompt({ menuCount, objective, alimentos, meals }: MenuPromptParams): string {
	return `
Actúa como un CHEF PROFESIONAL y NUTRICIONISTA DE ALTO NIVEL especializado en:

- cocina saludable,
- menús equilibrados,
- nutrición deportiva,
- control de peso,
- recetas variadas y apetitosas.

Tu misión es generar menús REALISTAS y DELICIOSOS, manteniendo siempre
la calidad culinaria, el equilibrio nutricional y el uso EXCLUSIVO de los alimentos permitidos.

Devuelve SOLO JSON válido. No escribas nada fuera del JSON.

Genera exactamente ${menuCount} menús saludables adecuados para el objetivo: "${objective}".

SOLO puedes usar los siguientes alimentos:

HIDRATOS: ${alimentos.hidratos_de_carbono.join(', ')}
PROTEÍNAS: ${alimentos.proteinas.join(', ')}
GRASAS: ${alimentos.grasas.join(', ')}

VERDURAS PERMITIDAS (variedad obligatoria):
- judía verde, espinacas, brócoli, coliflor, zanahoria, calabacín, puerro,
  espárragos, alcachofa, berenjena, pimiento, cebolla, champiñón.

REGLAS CRÍTICAS:
- PROHIBIDO repetir recetas entre menús.
- PROHIBIDO repetir la misma técnica de cocción.
- PROHIBIDO usar la misma verdura en dos menús distintos.
- Las recetas deben ser APETITOSAS y profesionales.
- Cada comida debe tener:
  • nombre
  • ingredientes
  • preparación (mínimo 2 pasos)
- Deben aparecer SOLO las comidas seleccionadas: ${meals.join(', ')}.

POSTRE:
- Cada menú debe incluir un postre distinto.
- El postre es una RECETA COMPLETA.
- NO repitas postres.

FORMATO EXACTO:
{
  "menus": [...]
}

NO añadas nada fuera del JSON.
`;
}
