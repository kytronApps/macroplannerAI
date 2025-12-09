import type { MenuPromptParams } from "../type/prompt.type";
import perdidaGrasa from "../data/perdida-grasa.json";
import gananciaMasa from "../data/ganancia-masa.json";

export function seleccionarListado(
  objective: "perder" | "ganar" | "mantener"
): MenuPromptParams["alimentos"] {
  if (objective === "perder") return perdidaGrasa;
  if (objective === "ganar") return gananciaMasa;

  return {
    hidratos_de_carbono: [
      ...perdidaGrasa.hidratos_de_carbono.slice(0, 20),
      ...gananciaMasa.hidratos_de_carbono.slice(0, 20),
    ],
    proteinas: [
      ...perdidaGrasa.proteinas.slice(0, 20),
      ...gananciaMasa.proteinas.slice(0, 20),
    ],
    grasas: [
      ...perdidaGrasa.grasas.slice(0, 20),
      ...gananciaMasa.grasas.slice(0, 20),
    ],
  };
}
