import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

interface MealSelectorProps {
  selectedMeals: string[];
  includeDessert: boolean;
  onMealToggle: (meal: string) => void;
  onDessertToggle: (checked: boolean) => void;
}

const availableMeals = [
  { id: "desayuno", label: "Desayuno" },
  { id: "almuerzo", label: "Almuerzo" },
  { id: "comida", label: "Comida" },
  { id: "merienda", label: "Merienda" },
  { id: "cena", label: "Cena" },
];

export const MealSelector = ({
  selectedMeals,
  includeDessert,
  onMealToggle,
  onDessertToggle,
}: MealSelectorProps) => {
  return (
    <div className="space-y-6">
      <div>
        <Label className="text-lg font-semibold text-foreground mb-4 block">
          Selecciona las comidas del día
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {availableMeals.map((meal) => (
            <div key={meal.id} className="flex items-center space-x-2">
              <Checkbox
                id={meal.id}
                checked={selectedMeals.includes(meal.label)}
                onCheckedChange={() => onMealToggle(meal.label)}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label
                htmlFor={meal.id}
                className="text-sm font-medium cursor-pointer"
              >
                {meal.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
        <Label htmlFor="dessert" className="text-sm font-medium cursor-pointer">
          Incluir postre
        </Label>
        <Switch
          id="dessert"
          checked={includeDessert}
          onCheckedChange={onDessertToggle}
          className="data-[state=checked]:bg-primary"
        />
      </div>
    </div>
  );
};
