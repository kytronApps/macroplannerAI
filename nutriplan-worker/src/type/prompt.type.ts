// type/prompt.type.ts
import type { Objective } from './objective.type';

export interface Alimentos {
  hidratos_de_carbono: string[];
  proteinas: string[];
  grasas: string[];
}

export interface MenuPromptParams {
  menuCount: number;
  objective: Objective;
  alimentos: Alimentos;
  meals: string[];
  allergies?: string;
  preferences?: string;
  intolerances?: string;
}