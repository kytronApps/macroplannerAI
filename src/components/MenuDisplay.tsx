import { enviarFeedback } from "@/api/fetchFeedback";
import { regenerarMenu } from "@/utils/regenerarMenu";
import { regenerarComida } from "@/utils/regenerarComida";
import type { Receta,MenuDisplayProps } from "@/types/menu-display.type";
import { Card } from "@/components/ui/card";
import {
  ChefHat,
  UtensilsCrossed,
  ListChecks,
  ThumbsUp,
  ThumbsDown,
  RefreshCw
} from "lucide-react";

export const MenuDisplay = ({ mealPlan, objective }: MenuDisplayProps) => {
  const menus = Array.isArray(mealPlan?.menus) ? mealPlan.menus : [];

  async function handleLike(menu: string, comida: string, receta: Receta) {
    await enviarFeedback(menu, comida, receta, "like", objective);
  }

  async function handleDislike(menu: string, comida: string, receta: Receta) {
    await enviarFeedback(menu, comida, receta, "dislike", objective);
  }

  return (
    <div className="space-y-6">
      {menus.map((menu, menuIndex) => (
        <Card key={menuIndex}>
          
          {Object.entries(menu.comidas).map(
            ([nombreComida, receta]: [string, Receta]) => (
              <div key={nombreComida}>
                
                {/* Botones */}
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() =>
                      handleLike(menu.nombre, nombreComida, receta)
                    }
                  >
                    👍 Me gustó
                  </button>

                  <button
                    onClick={() =>
                      handleDislike(menu.nombre, nombreComida, receta)
                    }
                  >
                    👎 No me gustó
                  </button>

                  <button
                    onClick={() =>
                      regenerarComida(menu.nombre, nombreComida, receta)
                    }
                  >
                    🔄 Regenerar
                  </button>
                </div>

              </div>
            )
          )}

          {/* Botón regenerar menú completo */}
          <button
            className="mt-4"
            onClick={() => regenerarMenu(menu.nombre)}
          >
            🔄 Regenerar menú completo
          </button>

        </Card>
      ))}
    </div>
  );
};
