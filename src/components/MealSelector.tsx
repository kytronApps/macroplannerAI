import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

// Importación desde tu carpeta types
import { MealSelectorProps } from "@/types/meal-selector.types";

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
  menuCount,
  onMealToggle,
  onDessertToggle,
  onMenuCountChange,
}: MealSelectorProps) => {
  return (
    <div className="space-y-6">
      {/* SELECCIÓN DE COMIDAS */}
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

      {/* NUEVA SECCIÓN: MENÚS A GENERAR */}
      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
        <Label className="text-sm font-medium">
          ¿Cuántos menús generar? (1–4)
        </Label>

        <Select
          onValueChange={(v) => onMenuCountChange(Number(v))}
          defaultValue={String(menuCount)}
        >
          <SelectTrigger className="w-28">
            <SelectValue placeholder="1" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="4">4</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* POSTRE */}
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