import type { RegenerarMenuBody } from "../type/regenerar-menu.type";
import { seleccionarListado } from "../utils/seleccionarListado";
import { generarMenuPrompt } from "../prompts/generarMenuPrompt";
import { limpiarRespuesta } from "../utils/cleanup";
import { Groq } from "groq-sdk";
import { Env } from "../type/env";







export async function regenerarMenuHandler(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    const body = (await request.json()) as RegenerarMenuBody;

    const { objective, meals } = body;

    const alimentos = seleccionarListado(objective);

    const prompt = generarMenuPrompt({
      menuCount: 1,
      objective,
      alimentos,
      meals,
    });

    const groq = new Groq({ apiKey: env.GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const raw = completion.choices?.[0]?.message?.content ?? "{}";
    const cleaned = limpiarRespuesta(raw);

    let json;
    try {
      json = JSON.parse(cleaned);
    } catch {
      json = { menus: [], error: "JSON inválido" };
    }

    return new Response(JSON.stringify(json), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
    });
  }
}