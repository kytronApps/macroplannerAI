# macroplannerAI

## Resumen

`macroplannerAI` es un proyecto que proporciona generación automática de menús nutricionales personalizados. La solución combina un frontend (React + Vite) con un servicio backend desplegado en Cloudflare Workers (`nutriplan-worker`) que usa un modelo de lenguaje (vía `groq-sdk`) para construir menús en formato JSON a partir de listas de alimentos locales.

## Objetivo

- Generar menús saludables y adaptados por objetivo (pérdida de grasa, ganancia de masa o mantenimiento).
- Permitir integración con aplicaciones web/móviles mediante un endpoint REST (Worker).

## Componentes

- Frontend: Aplicación React (carpeta `src/`) que envía solicitudes al Worker y muestra menús.
- Worker: `nutriplan-worker/` — Cloudflare Worker que procesa peticiones, construye prompts restringidos y llama a la API LLM usando `groq-sdk`.
- Datos: `nutriplan-worker/src/data/*.json` — listas de alimentos por macronutriente y objetivo.

## Arquitectura y flujo de datos

1. El frontend prepara un `MealRequest` con macronutrientes, número de menús, comidas seleccionadas y restricciones.
2. Se realiza un POST al Worker.
3. El Worker selecciona la lista de alimentos según `objective` (perder/ganar/mezcla), genera un prompt estricto y pide al modelo que devuelva únicamente JSON.
4. El Worker limpia la salida del modelo, intenta parsearla y responde con JSON estándar (`{ menus: [...] }`).

## Detalles técnicos del Worker

- Archivo principal: `nutriplan-worker/src/index.ts`.
- Interfaz de entrada: `MealRequest` (ver `nutriplan-worker/src/type/index.type.ts`). Campos principales:
  - `calories`, `fats`, `carbs`, `proteins` (number)
  - `meals` (string[])
  - `includeDessert` (boolean)
  - `menuCount` (number)
  - `objective` (opcional: 'perder' | 'ganar' | undefined)
- Dependencia para llamadas LLM: `groq-sdk`.
- CORS: por defecto el Worker permite peticiones desde `https://macroplannerai.web.app` (configurable en `src/index.ts`).
- Variable sensible: `GROQ_API_KEY` — debe configurarse como secret en Cloudflare.

## Formato de request y ejemplo

- Método: POST
- Headers: `Content-Type: application/json`
- Body ejemplo:

```json
{
  "calories": 2000,
  "fats": 70,
  "carbs": 250,
  "proteins": 110,
  "meals": ["Desayuno", "Comida", "Merienda", "Cena"],
  "includeDessert": false,
  "allergies": "",
  "preferences": "",
  "intolerances": "",
  "menuCount": 3,
  "objective": "perder"
}
```

Respuesta (ejemplo simplificado)

```json
{
  "menus": [
    {
      "nombre": "Menú 1",
      "comidas": {
        "Desayuno": [
          { "ingrediente": "150g patata (cruda o cocida)", "cantidad": "150g" }
        ],
        "Comida": [],
        "Merienda": [],
        "Cena": []
      },
      "postre": null
    }
  ]
}
```

## Cómo ejecutar y desplegar

Worker (Cloudflare):

1. Ir al directorio del worker e instalar dependencias:

```bash
cd nutriplan-worker
npm install
```

2. Configurar el secret `GROQ_API_KEY`:

```bash
wrangler secret put GROQ_API_KEY
```

3. Desplegar:

```bash
npm run deploy    # ejecuta `wrangler deploy`
```

Frontend:

1. Instalar dependencias e iniciar servidor de desarrollo:

```bash
npm install
npm run dev
```

2. Generar build de producción:

```bash
npm run build
```

## Buenas prácticas

- Mantener `GROQ_API_KEY` en secretos — nunca en el código.
- Ajustar `allowedOrigin` en `nutriplan-worker/src/index.ts` según dominio de producción.
- Revisar y actualizar los archivos JSON en `nutriplan-worker/src/data/` si cambian los alimentos o raciones.
- Añadir validaciones adicionales en el frontend para evitar peticiones con datos no válidos.

## Archivos importantes

- `nutriplan-worker/src/index.ts` — Lógica principal del Worker y llamadas al LLM.
- `nutriplan-worker/src/type/index.type.ts` — Tipado de `MealRequest`.
- `nutriplan-worker/src/data/*.json` — Listados de alimentos por objetivo.
- `nutriplan-worker/wrangler.toml` — Configuración de despliegue Wrangler.

## Contacto y contribución

- Para contribuciones, abrir un issue o un pull request.
- Añade pruebas unitarias en `nutriplan-worker/test/` para validar parsing y comportamiento del worker.

## Licencia

- Añade aquí la licencia (p. ej. MIT) si procede.

Fecha de la documentación: 2025-11-30
