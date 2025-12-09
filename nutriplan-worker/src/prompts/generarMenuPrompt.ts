// prompts/generarMenuPrompt.ts
import type { MenuPromptParams } from '../type/prompt.type';

export function generarMenuPrompt({ 
  menuCount, 
  objective, 
  alimentos, 
  meals,
  allergies,
  preferences,
  intolerances,
  feedbackContext 
}: MenuPromptParams & { feedbackContext?: string }): string {
	
	const restricciones: string[] = [];
	
	if (allergies) {
		restricciones.push(`⛔ ALERGIAS (PROHIBIDO TOTALMENTE): ${allergies}`);
	}
	
	if (intolerances) {
		restricciones.push(`⚠️ INTOLERANCIAS (EVITAR): ${intolerances}`);
	}
	
	if (preferences) {
		restricciones.push(`🌱 PREFERENCIAS ALIMENTARIAS: ${preferences}`);
	}

	const restriccionesTexto = restricciones.length > 0 
		? `\n\n⚡ RESTRICCIONES CRÍTICAS DEL USUARIO:\n${restricciones.join('\n')}\n`
		: '';

	return `
Actúa como un CHEF PROFESIONAL y NUTRICIONISTA DE ALTO NIVEL especializado en:

- cocina saludable,
- menús equilibrados,
- nutrición deportiva,
- control de peso,
- recetas variadas y apetitosas.

Tu misión es generar menús REALISTAS y DELICIOSOS, manteniendo siempre
la calidad culinaria, el equilibrio nutricional y el uso EXCLUSIVO de los alimentos permitidos.
${restriccionesTexto}

⚠️ IMPORTANTE SOBRE RESTRICCIONES:
${allergies ? `- Si el usuario es alérgico a "${allergies}", NO USES NINGÚN ALIMENTO de esa categoría.` : ''}
${intolerances ? `- Si el usuario es intolerante a "${intolerances}", EVITA alimentos que contengan estos ingredientes (por ejemplo, si es intolerante a la lactosa, NO uses lácteos como queso, yogurt, leche).` : ''}

${preferences?.toLowerCase().includes('vegetariano') ? `
- 🛑 REGLA ESTRICTA VEGETARIANA:
  ❌ PROHIBIDO absolutamente usar carne, pescado, mariscos o aves.
  ❌ No generes ninguna receta que incluya salmón, pollo, atún, cerdo, marisco o cualquier producto animal que sea carne o pescado.
  ✔ Solo usa vegetales, legumbres, granos, tofu, huevo y derivados lácteos (si no hay intolerancia).
  ⚠️ Si generas una receta que no cumpla esto, DEBES corregirla automáticamente antes de devolver la respuesta. 
` : ''}




${preferences?.toLowerCase().includes('vegano') ? '- MODO VEGANO: NO uses ningún producto animal (carnes, pescados, huevos, lácteos, miel).' : ''}

${feedbackContext ? `\n${feedbackContext}\n` : ''}

SOLO puedes usar los siguientes alimentos:

HIDRATOS: ${alimentos.hidratos_de_carbono.join(', ')}
PROTEÍNAS: ${alimentos.proteinas.join(', ')}
GRASAS: ${alimentos.grasas.join(', ')}

VERDURAS PERMITIDAS (variedad obligatoria):
- judía verde, espinacas, brócoli, coliflor, zanahoria, calabacín, puerro,
  espárragos, alcachofa, berenjena, pimiento, cebolla, champiñón.

REGLAS CRÍTICAS:
- ⛔ RESPETA TODAS LAS RESTRICCIONES DEL USUARIO (alergias, intolerancias, preferencias).
- Si hay historial de feedback, prioriza recetas similares a las que gustaron.
- PROHIBIDO repetir recetas entre menús.
- PROHIBIDO repetir la misma técnica de cocción.
- PROHIBIDO usar la misma verdura en dos menús distintos.
- Las recetas deben ser APETITOSAS y profesionales.
- Cada comida debe tener:
  • nombre
  • ingredientes (con cantidades exactas en gramos)
  • preparación (mínimo 2 pasos detallados)
- Deben aparecer SOLO las comidas seleccionadas: ${meals.join(', ')}.
${preferences?.toLowerCase().includes('vegetariano') ? `
- ⛔ Si el usuario es VEGETARIANO, está TOTALMENTE PROHIBIDO generar recetas con carnes o pescados.
- Si accidentalmente generas una receta prohibida, DEBES reescribirla antes de devolver el JSON.
` : ''}
POSTRE:
- Cada menú debe incluir un postre distinto.
- El postre es una RECETA COMPLETA.
- NO repitas postres.
- El postre debe respetar las mismas restricciones del usuario.

FORMATO EXACTO:
{
  "menus": [
    {
      "nombre": "Menú 1",
      "comidas": {
        "Desayuno": {
          "nombre": "Nombre del plato",
          "ingredientes": [
            {"ingrediente": "avena", "cantidad": "50g"},
            {"ingrediente": "plátano", "cantidad": "1 unidad"}
          ],
          "preparacion": [
            "Paso 1 detallado",
            "Paso 2 detallado"
          ]
        }
      },
      "postre": {
        "nombre": "Nombre del postre",
        "ingredientes": [...],
        "preparacion": [...]
      }
    }
  ]
}

NO añadas nada fuera del JSON.
Devuelve SOLO JSON válido.
`;
}