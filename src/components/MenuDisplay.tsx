import { enviarFeedback } from "@/api/fetchFeedback";
import { regenerarMenu } from "@/utils/regenerarMenu";
import { regenerarComida } from "@/utils/regenerarComida";

import type { Receta, MenuDisplayProps } from "@/types/menu-display.type";

import { Card } from "@/components/ui/card";
import {
  ChefHat,
  UtensilsCrossed,
  ListChecks,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
} from "lucide-react";

export const MenuDisplay = ({ mealPlan, objective }: MenuDisplayProps) => {
  const menus = Array.isArray(mealPlan?.menus) ? mealPlan.menus : [];

  const iconoComida: Record<string, string> = {
    Desayuno: "🥞",
    Comida: "🍛",
    Merienda: "🍪",
    Cena: "🍽️",
  };

  return (
    <div className="space-y-10">
      {menus.map((menu, idx) => (
        <Card key={idx} className="p-6 border shadow-sm space-y-8">
          {/* HEADER DEL MENÚ */}
          <h2 className="text-2xl font-bold text-primary">
            {menu.nombre}
          </h2>

          {/* BLOQUES DE COMIDAS */}
          {Object.entries(menu.comidas).map(
            ([nombreComida, receta]: [string, Receta]) => (
              <Card
                key={nombreComida}
                className="p-5 border rounded-lg bg-white shadow-sm space-y-3"
              >
                {/* TÍTULO DE LA COMIDA */}
                <div className="flex items-center gap-2">
                  <span className="text-xl">{iconoComida[nombreComida] ?? "🍽️"}</span>
                  <h3 className="text-xl font-semibold">{nombreComida}</h3>
                </div>

                {/* NOMBRE DE LA RECETA */}
                <p className="text-lg font-bold text-gray-800">
                  {receta.nombre}
                </p>

                {/* INGREDIENTES */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <UtensilsCrossed className="w-4 h-4 text-primary" />
                    <span className="font-medium">Ingredientes</span>
                  </div>

                  <ul className="text-sm text-gray-700 ml-4 list-disc">
                    {receta.ingredientes.map((ing, i) => (
                      <li key={i}>
                        {ing.ingrediente} —{" "}
                        <span className="font-semibold">{ing.cantidad}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* PREPARACIÓN */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <ListChecks className="w-4 h-4 text-primary" />
                    <span className="font-medium">Preparación</span>
                  </div>

                  <ol className="text-sm text-gray-700 ml-4 list-decimal">
                    {receta.preparacion.map((paso, i) => (
                      <li key={i}>{paso}</li>
                    ))}
                  </ol>
                </div>

                {/* BOTONES DE ACCIÓN */}
                <div className="flex justify-end gap-3 pt-3">
                  {/* LIKE */}
                  <button
                    className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-1 text-sm"
                    onClick={() =>
                      enviarFeedback(menu.nombre, nombreComida, receta, "like", objective)
                    }
                  >
                    <ThumbsUp className="w-4 h-4" /> Me gustó
                  </button>

                  {/* DISLIKE */}
                  <button
                    className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-1 text-sm"
                    onClick={() =>
                      enviarFeedback(menu.nombre, nombreComida, receta, "dislike", objective)
                    }
                  >
                    <ThumbsDown className="w-4 h-4" /> No me gustó
                  </button>

                  {/* REGENERAR */}
                  <button
                    className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-1 text-sm"
                    onClick={() =>
                      regenerarComida(objective, nombreComida, receta)
                    }
                  >
                    <RefreshCw className="w-4 h-4" /> Regenerar
                  </button>
                </div>
              </Card>
            )
          )}

          {/* POSTRE */}
          {menu.postre && (
            <Card className="p-5 bg-yellow-50 border rounded-lg space-y-2">
              <h3 className="text-xl font-semibold">🍰 Postre: {menu.postre.nombre}</h3>

              <ul className="list-disc ml-4 text-sm text-gray-700">
                {menu.postre.ingredientes.map((ing, i) => (
                  <li key={i}>
                    {ing.ingrediente} — <span className="font-semibold">{ing.cantidad}</span>
                  </li>
                ))}
              </ul>

              <ol className="list-decimal ml-4 text-sm text-gray-700">
                {menu.postre.preparacion.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ol>
            </Card>
          )}

          {/* REGENERAR TODO EL MENÚ */}
          <div className="flex justify-end">
            <button
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center gap-2"
              onClick={() =>
                regenerarMenu(objective, Object.keys(menu.comidas))
              }
            >
              <RefreshCw className="w-4 h-4" /> Regenerar menú completo
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
};