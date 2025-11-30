import type { MenuDisplayProps } from "@/types/menu-display.type";
import { Card } from "@/components/ui/card";
import { CheckCircle, ChefHat, UtensilsCrossed, ListChecks } from "lucide-react";

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

      {menus.length > 0 ? (
        menus.map((menu, menuIndex) => (
          <Card
            key={menuIndex}
            className="p-6 border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
          >
            <h3 className="text-2xl font-bold text-primary mb-6">
              {menu.nombre}
            </h3>

            {/* COMIDAS */}
            {Object.entries(menu.comidas).map(([nombreComida, data]) => (
              <div
                key={nombreComida}
                className="mb-8 p-5 border rounded-lg bg-background/50"
              >
                <div className="flex items-center gap-2 mb-3">
                  <ChefHat className="w-5 h-5 text-primary" />
                  <h4 className="text-xl font-semibold text-gray-900">
                    {nombreComida}
                  </h4>
                </div>

                {/* Nombre de la receta */}
                <p className="text-lg font-semibold text-gray-800 mb-3">
                  {data?.nombre}
                </p>

                {/* INGREDIENTES */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <UtensilsCrossed className="w-4 h-4 text-primary" />
                    <p className="text-sm font-medium text-gray-700">Ingredientes:</p>
                  </div>

                  {data?.ingredientes?.length > 0 ? (
                    <ul className="list-none space-y-1 ml-1">
                      {data.ingredientes.map((item, i) => (
                        <li
                          key={i}
                          className="flex justify-between border-b border-dashed border-gray-300 dark:border-gray-700 pb-1 last:border-b-0 last:pb-0"
                        >
                          <span className="text-sm">{item.ingrediente}</span>
                          <span className="text-sm font-semibold text-primary">
                            {item.cantidad}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">Sin ingredientes.</p>
                  )}
                </div>

                {/* PREPARACION */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <ListChecks className="w-4 h-4 text-primary" />
                    <p className="text-sm font-medium text-gray-700">Preparación:</p>
                  </div>

                  {data?.preparacion?.length > 0 ? (
                    <ol className="list-decimal ml-6 space-y-1 text-sm text-gray-700">
                      {data.preparacion.map((paso, i) => (
                        <li key={i}>{paso}</li>
                      ))}
                    </ol>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No hay pasos de preparación.
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* POSTRE COMO RECETA COMPLETA */}
            {menu.postre && (
              <div className="mt-4 p-4 border rounded-lg bg-yellow-50/70 dark:bg-yellow-900/20">
                <h4 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  🍰 Postre: {menu.postre.nombre}
                </h4>

                {/* Ingredientes del postre */}
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <UtensilsCrossed className="w-4 h-4 text-primary" />
                    <p className="text-sm font-medium text-gray-700">Ingredientes:</p>
                  </div>

                  <ul className="list-none space-y-1 ml-1">
                    {menu.postre.ingredientes.map((item, i) => (
                      <li
                        key={i}
                        className="flex justify-between border-b border-dashed border-gray-300 pb-1 last:border-b-0"
                      >
                        <span className="text-sm">{item.ingrediente}</span>
                        <span className="text-sm font-semibold text-primary">
                          {item.cantidad}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Preparación del postre */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <ListChecks className="w-4 h-4 text-primary" />
                    <p className="text-sm font-medium text-gray-700">Preparación:</p>
                  </div>

                  <ol className="list-decimal ml-6 space-y-1 text-sm text-gray-700">
                    {menu.postre.preparacion.map((paso, i) => (
                      <li key={i}>{paso}</li>
                    ))}
                  </ol>
                </div>
              </div>
            )}
          </Card>
        ))
      ) : (
        <p className="text-center text-muted-foreground">No se generaron menús.</p>
      )}
    </div>
  );
};
