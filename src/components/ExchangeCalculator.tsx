import { Card } from "@/components/ui/card";

interface ExchangeCalculatorProps {
  fats: number;
  carbs: number;
  proteins: number;
}

export const ExchangeCalculator = ({ fats, carbs, proteins }: ExchangeCalculatorProps) => {
  const fatExchange = fats / 5;
  const carbExchange = carbs / 15;
  const proteinExchange = proteins / 7;
  const total = fatExchange + carbExchange + proteinExchange;

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Cálculo de Intercambios Nutricionales
      </h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
          <span className="text-sm font-medium">Intercambios de Grasas:</span>
          <span className="text-lg font-bold text-primary">
            {fatExchange.toFixed(2)}
          </span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
          <span className="text-sm font-medium">Intercambios de Carbohidratos:</span>
          <span className="text-lg font-bold text-secondary">
            {carbExchange.toFixed(2)}
          </span>
        </div>
        
        <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
          <span className="text-sm font-medium">Intercambios de Proteínas:</span>
          <span className="text-lg font-bold text-accent">
            {proteinExchange.toFixed(2)}
          </span>
        </div>
        
        <div className="flex justify-between items-center p-4 bg-background rounded-lg border-2 border-primary mt-4">
          <span className="text-base font-semibold">Total de Intercambios:</span>
          <span className={`text-xl font-bold ${
            total >= 0.98 && total <= 1.02 ? 'text-primary' : 'text-destructive'
          }`}>
            {total.toFixed(2)}
          </span>
        </div>
        
        {(total < 0.98 || total > 1.02) && (
          <p className="text-sm text-destructive text-center mt-2">
            ⚠️ El total debe estar cerca de 1.00
          </p>
        )}
      </div>
    </Card>
  );
};
