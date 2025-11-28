import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ObjectiveSelectorProps {
  objective: string;
  onObjectiveChange: (value: string) => void;
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
        onValueChange={onObjectiveChange}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
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
