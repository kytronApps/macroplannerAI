export interface NutritionalInputProps {
// 🔴 REMOVIDO: calories: string; y onCaloriesChange
  // 🟢 NUEVO: Campo de visualización de calorías totales
  totalKcalDisplay: string; 
  fats: string;
  carbs: string;
  proteins: string;
  // 🟢 Nuevos campos de biometría
  height: string; 
  weight: string;
  onFatsChange: (value: string) => void;
  onCarbsChange: (value: string) => void;
  onProteinsChange: (value: string) => void;
  // 🟢 Nuevos handlers
  onHeightChange: (value: string) => void; 
  onWeightChange: (value: string) => void;
}