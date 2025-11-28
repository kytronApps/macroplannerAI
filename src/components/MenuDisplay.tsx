import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge"; // Ya no se usa la Badge

// Las interfaces han sido actualizadas para coincidir con la respuesta del Worker
interface MenuComidas {
  [key: string]: string | null; 
}

interface GeneratedMenu {
  nombre: string;
  comidas: MenuComidas; 
  postre: string | null;
}

interface MealPlanResponse {
  menus: GeneratedMenu[]; 
  error?: string; 
  // ⚠️ Si la API no devuelve 'totalNutrition', debes asegurar que esta sección se maneje correctamente 
  // o eliminar la interfaz 'MealPlan' antigua. Dejo la estructura simple aquí.
}

interface MenuDisplayProps {
  mealPlan: MealPlanResponse;
}

export const MenuDisplay = ({ mealPlan }: MenuDisplayProps) => {

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 🟢 CORRECCIÓN VISIBILIDAD 1: Título principal a color sólido oscuro */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900"> {/* Texto negro sólido para PDF */}
          Tu Plan de Comidas Personalizado
        </h2>
        <p className="text-gray-700"> {/* Texto gris oscuro en lugar de muted-foreground */}
          Generado por IA según tus necesidades nutricionales
        </p>
      </div>

      {mealPlan.menus.map((menu, menuIndex) => (
        <Card
          key={menuIndex}
          className="p-6 border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
        >
          <h3 className="text-2xl font-bold text-primary mb-4">
            {menu.nombre}
          </h3>

          {/* Mapeo sobre el objeto 'comidas' */}
          {Object.entries(menu.comidas)
            .filter(([key]) => key !== 'postre') // Filtrar la propiedad 'postre' si está dentro de 'comidas'
            .map(
            ([nombreComida, descripcionComida]) => (
              <div key={nombreComida} className="mb-6 last:mb-0">
                <div className="flex items-start justify-between mb-3">
                  {/* 🟢 CORRECCIÓN VISIBILIDAD 2: Título de la comida a color oscuro */}
                  <h4 className="text-xl font-semibold text-gray-900">
                    {nombreComida}
                  </h4>
                  {/* <Badge> eliminada ya que no hay datos de nutrición detallados por plato */}
                </div>

                <div className="space-y-3">
                  {/* Mostrar la descripción/texto de la comida */}
                  <div className="bg-secondary/10 p-4 rounded-lg">
                    {/* 🟢 CORRECCIÓN VISIBILIDAD 3: Etiquetas a color sólido */}
                    <p className="text-sm font-medium text-gray-900 mb-2">
                      Detalle:
                    </p>
                    {/* 🟢 CORRECCIÓN VISIBILIDAD 4: Descripción a color sólido */}
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {descripcionComida}
                    </p>
                  </div>
                </div>
              </div>
            )
          )}

          {/* Mostrar el postre si está separado (o dentro de comidas con clave 'postre') */}
          {menu.postre && menu.postre !== "null" && (
            <div className="mt-4 p-4 border rounded-lg bg-yellow-50/50 dark:bg-yellow-900/20">
              {/* 🟢 CORRECCIÓN VISIBILIDAD 5: Título del Postre a color oscuro */}
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                🍰 Postre
              </h4>
              {/* 🟢 CORRECCIÓN VISIBILIDAD 6: Descripción del Postre a color oscuro */}
              <p className="text-sm text-gray-700">{menu.postre}</p>
            </div>
          )}
        </Card>
      ))}

      {/* ⚠️ Nota sobre Resumen Nutricional: Este bloque se mantiene comentado ya que la IA no lo está devolviendo actualmente. */}
      {/* ... */}
    </div>
  );
};