import type { Objective } from "./objective.type";

export interface MenuPromptParams {
  menuCount: number;
  objective: Objective;
  alimentos: {
    hidratos_de_carbono: string[];
    proteinas: string[];
    grasas: string[];
  };
  meals: string[];
}
