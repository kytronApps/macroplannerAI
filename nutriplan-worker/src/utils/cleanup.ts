export function limpiarRespuesta(raw: string) {
  let cleaned = raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const firstBrace = cleaned.search(/\{/);
  const lastBrace = cleaned.search(/\}[^}]*$/);

  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  return cleaned;
}
