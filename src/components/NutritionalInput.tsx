import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface NutritionalInputProps {
  calories: string;
  fats: string;
  carbs: string;
  proteins: string;
  onCaloriesChange: (value: string) => void;
  onFatsChange: (value: string) => void;
  onCarbsChange: (value: string) => void;
  onProteinsChange: (value: string) => void;
}

export const NutritionalInput = ({
  calories,
  fats,
  carbs,
  proteins,
  onCaloriesChange,
  onFatsChange,
  onCarbsChange,
  onProteinsChange,
}: NutritionalInputProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="calories" className="text-foreground font-medium">
          Calorías (kcal)
        </Label>
        <Input
          id="calories"
          type="number"
          value={calories}
          onChange={(e) => onCaloriesChange(e.target.value)}
          placeholder="2000"
          className="border-2 focus:ring-primary"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="fats" className="text-foreground font-medium">
          Grasas (g)
        </Label>
        <Input
          id="fats"
          type="number"
          value={fats}
          onChange={(e) => onFatsChange(e.target.value)}
          placeholder="67"
          className="border-2 focus:ring-primary"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="carbs" className="text-foreground font-medium">
          Carbohidratos (g)
        </Label>
        <Input
          id="carbs"
          type="number"
          value={carbs}
          onChange={(e) => onCarbsChange(e.target.value)}
          placeholder="250"
          className="border-2 focus:ring-primary"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="proteins" className="text-foreground font-medium">
          Proteínas (g)
        </Label>
        <Input
          id="proteins"
          type="number"
          value={proteins}
          onChange={(e) => onProteinsChange(e.target.value)}
          placeholder="100"
          className="border-2 focus:ring-primary"
        />
      </div>
    </div>
  );
};
