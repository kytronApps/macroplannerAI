import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PreferencesFormProps {
  allergies: string;
  preferences: string;
  intolerances: string;
  onAllergiesChange: (value: string) => void;
  onPreferencesChange: (value: string) => void;
  onIntolerancesChange: (value: string) => void;
}

export const PreferencesForm = ({
  allergies,
  preferences,
  intolerances,
  onAllergiesChange,
  onPreferencesChange,
  onIntolerancesChange,
}: PreferencesFormProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="allergies" className="text-foreground font-medium">
          Alergias
        </Label>
        <Textarea
          id="allergies"
          value={allergies}
          onChange={(e) => onAllergiesChange(e.target.value)}
          placeholder="Ej: frutos secos, mariscos..."
          className="min-h-[80px] border-2 focus:ring-primary resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="preferences" className="text-foreground font-medium">
          Preferencias alimentarias
        </Label>
        <Textarea
          id="preferences"
          value={preferences}
          onChange={(e) => onPreferencesChange(e.target.value)}
          placeholder="Ej: vegetariano, bajo en sodio, comida mediterránea..."
          className="min-h-[80px] border-2 focus:ring-primary resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="intolerances" className="text-foreground font-medium">
          Intolerancias
        </Label>
        <Textarea
          id="intolerances"
          value={intolerances}
          onChange={(e) => onIntolerancesChange(e.target.value)}
          placeholder="Ej: lactosa, gluten..."
          className="min-h-[80px] border-2 focus:ring-primary resize-none"
        />
      </div>
    </div>
  );
};
