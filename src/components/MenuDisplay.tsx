import type { MenuDisplayProps } from "@/types/menu-display.type";
import { Card } from "@/components/ui/card";

export const MenuDisplay = ({ mealPlan }: MenuDisplayProps) => {
  const menus = Array.isArray(mealPlan?.menus) ? mealPlan.menus : [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">
          Tu Plan de Comidas Personalizado
        </h2>
        <p className="text-gray-700">
          Generado por IA según tus necesidades nutricionales
        </p>
      </div>

      {/* 🟢 Si hay menús */}
      {menus.length > 0 ? (
        menus.map((menu, menuIndex) => (
          <Card
            key={menuIndex}
            className="p-6 border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
          >
            <h3 className="text-2xl font-bold text-primary mb-4">
              {menu.nombre}
            </h3>

            {Object.entries(menu.comidas).map(([nombreComida, ingredientes]) => (
              <div
                key={nombreComida}
                className="mb-6 last:mb-0 p-4 border rounded-lg bg-background/50"
              >
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  {nombreComida}
                </h4>

                <p className="text-sm font-medium text-gray-700 mb-2">
                  Ingredientes y Cantidades:
                </p>

                {Array.isArray(ingredientes) && ingredientes.length > 0 ? (
                  <ul className="list-none space-y-1">
                    {ingredientes.map((item, i) => (
                      <li
                        key={i}
                        className="flex justify-between border-b border-dashed border-gray-300 dark:border-gray-700 pb-1 last:border-b-0 last:pb-0"
                      >
                        <span className="text-foreground text-sm">{item.ingrediente}</span>
                        <span className="font-semibold text-primary text-sm">
                          {item.cantidad}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No hay ingredientes detallados para esta comida.
                  </p>
                )}
              </div>
            ))}

            {menu.postre && menu.postre !== "null" && (
              <div className="mt-4 p-4 border rounded-lg bg-yellow-50/50 dark:bg-yellow-900/20">
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  🍰 Postre
                </h4>
                <p className="text-sm text-gray-700">{menu.postre}</p>
              </div>
            )}
          </Card>
        ))
      ) : (
        // 🟡 Fallback cuando no hay menús
        <p className="text-center text-muted-foreground">
          No se generaron menús.
        </p>
      )}
    </div>
  );
};
