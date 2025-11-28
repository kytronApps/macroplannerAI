import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// 1. Define el tipo literal que incluye todos los valores posibles
type ObjectiveType = "perder" | "ganar" | "mantener";

interface ObjectiveSelectorProps {
  // 2. Usa el tipo estricto para la prop 'objective'
  objective: ObjectiveType;
  
  // 3. Usa el tipo estricto para la función de cambio
  onObjectiveChange: (value: ObjectiveType) => void;
}

export const ObjectiveSelector = ({
  objective,
  onObjectiveChange
}: ObjectiveSelectorProps) => {
  return (
    <div className="space-y-4">
      <Label className="text-lg font-semibold text-foreground">
        Objetivo
      </Label>

      <RadioGroup
        value={objective}
        // onValueChange automáticamente pasa un ObjectiveType
        onValueChange={onObjectiveChange} 
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {/* Los valores aquí ("perder", "ganar", "mantener") ahora coinciden con ObjectiveType */}
        <div className="flex items-center space-x-2 p-3 border rounded-lg bg-background/50 hover:bg-background transition cursor-pointer">
          <RadioGroupItem value="perder" id="perder" />
          <Label htmlFor="perder" className="cursor-pointer">
            🔥 Perder grasa
          </Label>
        </div>

        <div className="flex items-center space-x-2 p-3 border rounded-lg bg-background/50 hover:bg-background transition cursor-pointer">
          <RadioGroupItem value="ganar" id="ganar" />
          <Label htmlFor="ganar" className="cursor-pointer">
            💪 Ganar masa
          </Label>
        </div>

        <div className="flex items-center space-x-2 p-3 border rounded-lg bg-background/50 hover:bg-background transition cursor-pointer">
          <RadioGroupItem value="mantener" id="mantener" />
          <Label htmlFor="mantener" className="cursor-pointer">
            ⚖️ Mantener
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};