Servicios y Conexiones — macroplannerAI

## Resumen

Este documento describe las conexiones externas y los servicios que utiliza el proyecto, cómo configurarlos y las variables de entorno necesarias.

## Servicios principales

1. LLM (via Groq / groq-sdk)

   - Uso: `nutriplan-worker` llama al modelo con `groq-sdk` para generar menús a partir de un prompt.
   - Variable necesaria: `GROQ_API_KEY` (secret en Cloudflare).
   - Notas: Mantener el `apiKey` en los secrets de Wrangler / Cloudflare.

2. Cloudflare Workers

   - Uso: Alberga `nutriplan-worker` que expone el endpoint REST.
   - Archivos de configuración: `nutriplan-worker/wrangler.toml`, `wrangler.jsonc`.
   - Despliegue: `wrangler deploy` (ejecutado a través de `npm run deploy` en `nutriplan-worker`).

3. Frontend (Vite + React)
   - Uso: Interfaz de usuario que consume el endpoint del Worker.
   - Comando dev: `npm run dev` en la raíz.

## Variables de entorno y configuración

- `GROQ_API_KEY` (REQUIRED): clave para autenticación con la API de Groq/llamadas al modelo.
  - Configuración local / desarrollo: `wrangler secret put GROQ_API_KEY`
  - Configuración CI/producción: añadir secret en el dashboard de Cloudflare o en el proveedor CI.

## CORS

- El worker define `allowedOrigin` en `nutriplan-worker/src/index.ts` como `https://macroplannerai.web.app` por defecto. Cambiarlo por tu dominio de producción si es necesario.

## Endpoints y rutas

- POST / (Root del worker): recibe `MealRequest` y devuelve JSON con `menus`.

## Ejemplo de uso (curl)

```bash
curl -X POST https://<TU_WORKER>.workers.dev \
  -H 'Content-Type: application/json' \
  -d '{
    "calories": 2000,
    "fats": 70,
    "carbs": 250,
    "proteins": 110,
    "meals": ["Desayuno","Comida","Merienda","Cena"],
    "includeDessert": false,
    "allergies": "",
    "preferences": "",
    "intolerances": "",
    "menuCount": 3,
    "objective": "perder"
  }'
```

## Manejo de errores

- Si el LLM devuelve texto no-JSON o contiene texto adicional, el Worker intenta limpiar y parsear. Si falla, responde `{ menus: [], error: "..." }` con status 500 (o 200 si la petición fue procesada pero el JSON no era válido).

## Buenas prácticas

- Proteger `GROQ_API_KEY` como secret.
- Controlar CORS adecuadamente en `allowedOrigin`.
- Testear las respuestas del Worker con casos edge (ingredientes no permitidos, respuestas no JSON).

## Registro y observabilidad

- `wrangler.jsonc` tiene `observability.enabled = true`; usar Cloudflare Logs / observability para monitorizar invocaciones y errores.

## Notas finales

- Las listas de alimentos están en `nutriplan-worker/src/data/`. Estas listas son la fuente autorizada de ingredientes; actualizarlas según requisitos nutricionales.
