import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { NutritionalInputProps } from "@/types/nutritional-punt.type";

export const NutritionalInput = ({
  // 🟢 Propiedad de visualización de kcal totales
  totalKcalDisplay, 
  fats,
  carbs,
  proteins,
  height,
  weight,
  // 🔴 REMOVIDO: onCaloriesChange
  onFatsChange,
  onCarbsChange,
  onProteinsChange,
  onHeightChange,
  onWeightChange,
}: NutritionalInputProps) => {
  return (
    <div className="space-y-6">
      
      {/* 🟢 MENSAJE FIJO CON EL PROCEDIMIENTO */}
      <div className="p-4 bg-blue-100/50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-lg">
        <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">
          PROCEDIMIENTO DE ENTRADA:
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
          Introduce SIEMPRE los valores nutricionales por **100g de producto** (Kcal totales, Kcal de Grasas, Kcal de Hidratos, Kcal de Proteínas) que encuentras en el etiquetado.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> 
        
        {/* Campo: Peso */}
        <div className="space-y-2">
          <Label htmlFor="weight" className="text-foreground font-medium">
            Peso (kg)
          </Label>
          <Input
            id="weight"
            type="number"
            value={weight}
            onChange={(e) => onWeightChange(e.target.value)}
            placeholder="75"
            className="border-2 focus:ring-primary"
          />
        </div>

        {/* Campo: Altura */}
        <div className="space-y-2">
          <Label htmlFor="height" className="text-foreground font-medium">
            Altura (cm)
          </Label>
          <Input
            id="height"
            type="number"
            value={height}
            onChange={(e) => onHeightChange(e.target.value)}
            placeholder="170"
            className="border-2 focus:ring-primary"
          />
        </div>

        {/* 🔴 CAMPO CERRADO: Calorías (Suma de macros) */}
        <div className="space-y-2">
          <Label htmlFor="calories" className="text-foreground font-medium">
            Calorías (kcal)
          </Label>
          <Input
            id="calories"
            type="text" // Cambiado a text para mejor visualización de decimales si es necesario
            value={totalKcalDisplay} // 🟢 Muestra el total calculado
            placeholder="0"
            disabled // 🔴 DESHABILITADO
            readOnly // 🔴 SOLO LECTURA
            className="border-2 focus:ring-primary bg-gray-100 dark:bg-gray-700 font-semibold"
          />
        </div>

        {/* 🟢 Campo: Grasas (kcal) */}
        <div className="space-y-2">
          <Label htmlFor="fats" className="text-foreground font-medium">
            Grasas (kcal)
          </Label>
          <Input
            id="fats"
            type="number"
            value={fats}
            onChange={(e) => onFatsChange(e.target.value)}
            placeholder="16"
            className="border-2 focus:ring-primary"
          />
        </div>

        {/* 🟢 Campo: Carbohidratos (kcal) */}
        <div className="space-y-2">
          <Label htmlFor="carbs" className="text-foreground font-medium">
            Carbohidratos (kcal)
          </Label>
          <Input
            id="carbs"
            type="number"
            value={carbs}
            onChange={(e) => onCarbsChange(e.target.value)}
            placeholder="285"
            className="border-2 focus:ring-primary"
          />
        </div>

        {/* 🟢 Campo: Proteínas (kcal) */}
        <div className="space-y-2">
          <Label htmlFor="proteins" className="text-foreground font-medium">
            Proteínas (kcal)
          </Label>
          <Input
            id="proteins"
            type="number"
            value={proteins}
            onChange={(e) => onProteinsChange(e.target.value)}
            placeholder="50"
            className="border-2 focus:ring-primary"
          />
        </div>
      </div>
    </div>
  );
};