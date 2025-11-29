import { Card } from "@/components/ui/card";
import { ExchangeCalculatorProps } from "@/types/exchange-calculator.types";

export const ExchangeCalculator = ({
  fats,
  carbs,
  proteins,
  objective,
  dynamicPortion,
}: ExchangeCalculatorProps) => {
  const fatExchangeLoss = fats / 5;
  const carbExchangeLoss = carbs / 15;
  const proteinExchangeLoss = proteins / 7;
  const totalLoss = fatExchangeLoss + carbExchangeLoss + proteinExchangeLoss;

  const portionToUse = dynamicPortion > 0 ? dynamicPortion : 28;

  const fatExchangeGain = ((fats / 100) * portionToUse) / 5;
  const carbExchangeGain = ((carbs / 100) * portionToUse) / 15;
  const proteinExchangeGain = ((proteins / 100) * portionToUse) / 7;
  const totalGain = fatExchangeGain + carbExchangeGain + proteinExchangeGain;

  const isGain = objective === "ganar";
  const isMaintain = objective === "mantener";

  const fat = isGain ? fatExchangeGain : fatExchangeLoss;
  const carb = isGain ? carbExchangeGain : carbExchangeLoss;
  const prot = isGain ? proteinExchangeGain : proteinExchangeLoss;

  const fatKcal = fat * 9;
  const carbKcal = carb * 4;
  const protKcal = prot * 4;

  const renderPortions = (count: number, emoji: string) => {
    return Array(Math.max(1, Math.round(count)))
      .fill(emoji)
      .join(" ");
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20">
      <h3 className="text-xl font-bold mb-4">
        Cálculo de Intercambios Nutricionales
      </h3>

      <div className="mt-6 p-4 bg-background/50 rounded-lg border">
        <h4 className="font-semibold mb-3">Intercambios por Kcal</h4>

        <ul className="space-y-2 text-sm">
          <li>
            🥑 <strong>Grasas:</strong> {renderPortions(fat, "🥑")}
            <span className="text-muted-foreground ml-1">
              ({fatKcal.toFixed(0)} kcal)
            </span>
          </li>
          <li>
            🍞 <strong>Carbohidratos:</strong> {renderPortions(carb, "🍞")}
            <span className="text-muted-foreground ml-1">
              ({carbKcal.toFixed(0)} kcal)
            </span>
          </li>
          <li>
            🍗 <strong>Proteínas:</strong> {renderPortions(prot, "🍗")}
            <span className="text-muted-foreground ml-1">
              ({protKcal.toFixed(0)} kcal)
            </span>
          </li>
        </ul>

        <p className="text-sm text-muted-foreground mt-4">
          Estas porciones serán utilizadas para generar tus menús según tu
          objetivo:
          <strong>
            {" "}
            {isGain
              ? "ganar masa muscular"
              : isMaintain
              ? "mantener peso"
              : "perder grasa"}
          </strong>
          .
        </p>
      </div>
    </Card>
  );
};
