import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Dish {
  name: string;
  ingredients: string[];
  nutrition: {
    calories: number;
    fats: number;
    carbs: number;
    proteins: number;
    fatExchange?: number;
    carbExchange?: number;
    proteinExchange?: number;
  };
  instructions: string;
}

interface Meal {
  name: string;
  dishes: Dish[];
}

interface MealPlan {
  meals: Meal[];
  totalNutrition: {
    calories: number;
    fats: number;
    carbs: number;
    proteins: number;
    fatExchange?: number;
    carbExchange?: number;
    proteinExchange?: number;
  };
  notes?: string;
}

interface MenuDisplayProps {
  mealPlan: MealPlan;
}

export const MenuDisplay = ({ mealPlan }: MenuDisplayProps) => {
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

      {mealPlan.meals.map((meal, mealIndex) => (
        <Card
          key={mealIndex}
          className="p-6 border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
        >
          <h3 className="text-2xl font-bold text-primary mb-4">{meal.name}</h3>
          
          {meal.dishes.map((dish, dishIndex) => (
            <div key={dishIndex} className="mb-6 last:mb-0">
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-xl font-semibold text-foreground">{dish.name}</h4>
                <Badge variant="secondary" className="ml-2">
                  {dish.nutrition.calories} kcal
                </Badge>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Ingredientes:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {dish.ingredients.map((ingredient, i) => (
                      <li key={i} className="text-foreground">{ingredient}</li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">Grasas</p>
                    <p className="text-lg font-bold text-primary">{dish.nutrition.fats}g</p>
                    {dish.nutrition.fatExchange && (
                      <p className="text-xs text-muted-foreground">
                        {dish.nutrition.fatExchange.toFixed(2)} int.
                      </p>
                    )}
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">Carbohidratos</p>
                    <p className="text-lg font-bold text-secondary">{dish.nutrition.carbs}g</p>
                    {dish.nutrition.carbExchange && (
                      <p className="text-xs text-muted-foreground">
                        {dish.nutrition.carbExchange.toFixed(2)} int.
                      </p>
                    )}
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">Proteínas</p>
                    <p className="text-lg font-bold text-accent">{dish.nutrition.proteins}g</p>
                    {dish.nutrition.proteinExchange && (
                      <p className="text-xs text-muted-foreground">
                        {dish.nutrition.proteinExchange.toFixed(2)} int.
                      </p>
                    )}
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">Calorías</p>
                    <p className="text-lg font-bold text-foreground">{dish.nutrition.calories}</p>
                  </div>
                </div>

                <div className="bg-secondary/10 p-4 rounded-lg">
                  <p className="text-sm font-medium text-foreground mb-2">
                    Instrucciones:
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {dish.instructions}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Card>
      ))}

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
          <div className="text-center p-4 bg-background rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Grasas</p>
            <p className="text-2xl font-bold text-primary">
              {mealPlan.totalNutrition.fats}g
            </p>
            {mealPlan.totalNutrition.fatExchange && (
              <p className="text-xs text-muted-foreground mt-1">
                {mealPlan.totalNutrition.fatExchange.toFixed(2)} intercambios
              </p>
            )}
          </div>
          <div className="text-center p-4 bg-background rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Carbohidratos</p>
            <p className="text-2xl font-bold text-secondary">
              {mealPlan.totalNutrition.carbs}g
            </p>
            {mealPlan.totalNutrition.carbExchange && (
              <p className="text-xs text-muted-foreground mt-1">
                {mealPlan.totalNutrition.carbExchange.toFixed(2)} intercambios
              </p>
            )}
          </div>
          <div className="text-center p-4 bg-background rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Proteínas</p>
            <p className="text-2xl font-bold text-accent">
              {mealPlan.totalNutrition.proteins}g
            </p>
            {mealPlan.totalNutrition.proteinExchange && (
              <p className="text-xs text-muted-foreground mt-1">
                {mealPlan.totalNutrition.proteinExchange.toFixed(2)} intercambios
              </p>
            )}
          </div>
        </div>
        
        {mealPlan.notes && (
          <div className="mt-6 p-4 bg-background/50 rounded-lg">
            <p className="text-sm font-medium text-foreground mb-2">Notas:</p>
            <p className="text-sm text-muted-foreground">{mealPlan.notes}</p>
          </div>
        )}
      </Card>
    </div>
  );
};
