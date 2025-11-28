import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MenuComidas {
  [key: string]: string; // "Desayuno": "texto", "Comida": "texto", etc.
  postre: string | null;
}

interface GeneratedMenu {
  nombre: string;
  comidas: MenuComidas; // Es un objeto
  postre: string | null;
}

interface MealPlanResponse {
  menus: GeneratedMenu[]; // Array de menús
  error?: string; // Para manejar errores
}

interface MenuDisplayProps {
  mealPlan: MealPlanResponse; // Cambia el tipo aquí
}

export const MenuDisplay = ({ mealPlan }: MenuDisplayProps) => {
 // En tu archivo MenuDisplay.tsx, dentro de la función MenuDisplay:

return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Tu Plan de Comidas Personalizado
        </h2>
        <p className="text-muted-foreground">
          Generado por IA según tus necesidades nutricionales
        </p>
      </div>

      {/* ⚠️ CORRECCIÓN 1: Mapear sobre el array 'menus' */}
      {mealPlan.menus.map((menu, menuIndex) => (
        <Card
          key={menuIndex}
          className="p-6 border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
        >
          <h3 className="text-2xl font-bold text-primary mb-4">{menu.nombre}</h3>
          
          {/* ⚠️ CORRECCIÓN 2: Usar Object.entries() para mapear el objeto 'comidas' */}
          {Object.entries(menu.comidas).map(([nombreComida, descripcionComida]) => (
            <div key={nombreComida} className="mb-6 last:mb-0">
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-xl font-semibold text-foreground">{nombreComida}</h4>
                {/* ⚠️ CORRECCIÓN 3: Aquí no hay calorías por plato, solo texto. La badge debe eliminarse o adaptarse. */}
                {/* <Badge variant="secondary" className="ml-2">
                  {dish.nutrition.calories} kcal
                </Badge> */}
              </div>

              <div className="space-y-3">
                {/* Mostrar la descripción/texto de la comida */}
                <div className="bg-secondary/10 p-4 rounded-lg">
                  <p className="text-sm font-medium text-foreground mb-2">
                    Detalle:
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {descripcionComida}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Mostrar el postre si está separado */}
          {menu.postre && menu.postre !== "null" && (
              <div className="mt-4 p-4 border rounded-lg bg-yellow-50/50 dark:bg-yellow-900/20">
                  <h4 className="text-xl font-semibold text-foreground mb-2">🍰 Postre</h4>
                  <p className="text-sm text-muted-foreground">{menu.postre}</p>
              </div>
          )}
        </Card>
      ))}

      {/* ⚠️ CORRECCIÓN 4: Si el Worker no devuelve 'totalNutrition' con esa estructura, 
         esta sección fallará. La dejo COMENTADA por seguridad, a menos que tu 
         IA garantice la inclusión de "totalNutrition" y "notes" en la respuesta.
         
      <Card className="p-6 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-2 border-primary">
        <h3 className="text-xl font-bold text-foreground mb-4">
          Resumen Nutricional Total
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-background rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Calorías</p>
            <p className="text-2xl font-bold text-foreground">
              {mealPlan.totalNutrition.calories}
            </p>
          </div>
          ... (Resto del resumen)
        </div>
        
        {mealPlan.notes && (
          <div className="mt-6 p-4 bg-background/50 rounded-lg">
            <p className="text-sm font-medium text-foreground mb-2">Notas:</p>
            <p className="text-sm text-muted-foreground">{mealPlan.notes}</p>
          </div>
        )}
      </Card>
      */}
    </div>
  );
};
