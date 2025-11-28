import { Card } from "@/components/ui/card";
import { ExchangeCalculatorProps } from "@/types/exchange-calculator.types";


export const ExchangeCalculator = ({
  fats,
  carbs,
  proteins,
  objective,
}: ExchangeCalculatorProps) => {
  const fatExchangeLoss = fats / 5;
  const carbExchangeLoss = carbs / 15;
  const proteinExchangeLoss = proteins / 7;
  const totalLoss = fatExchangeLoss + carbExchangeLoss + proteinExchangeLoss;

  const portion = 28;

  const fatExchangeGain = ((fats / 100) * portion) / 5;
  const carbExchangeGain = ((carbs / 100) * portion) / 15;
  const proteinExchangeGain = ((proteins / 100) * portion) / 7;
  const totalGain = fatExchangeGain + carbExchangeGain + proteinExchangeGain;

  const isGain = objective === "ganar";

  const fat = isGain ? fatExchangeGain : fatExchangeLoss;
  const carb = isGain ? carbExchangeGain : carbExchangeLoss;
  const prot = isGain ? proteinExchangeGain : proteinExchangeLoss;
  const total = isGain ? totalGain : totalLoss;

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

      {/* Mensaje introductorio inteligente */}
      {isGain ? (
        <p className="text-sm text-muted-foreground mb-4">
          Estás en modo <strong>ganar masa</strong>. Los valores introducidos
          son por <strong>100g</strong> del producto y se convierten usando una
          porción estándar de <strong>28g</strong>.
        </p>
      ) : (
        <p className="text-sm text-muted-foreground mb-4">
          Estás en modo <strong>perder grasa</strong>. Estos valores representan{" "}
          <strong>lo que consumirás realmente</strong>.
        </p>
      )}

      {/* Números base */}
      <div className="space-y-3">
        <div className="flex justify-between p-3 bg-background/50 rounded-lg">
          <span>Intercambios de Grasas:</span>
          <span className="font-bold text-primary">{fat.toFixed(2)}</span>
        </div>

        <div className="flex justify-between p-3 bg-background/50 rounded-lg">
          <span>Intercambios de Carbohidratos:</span>
          <span className="font-bold text-secondary">{carb.toFixed(2)}</span>
        </div>

        <div className="flex justify-between p-3 bg-background/50 rounded-lg">
          <span>Intercambios de Proteínas:</span>
          <span className="font-bold text-accent">{prot.toFixed(2)}</span>
        </div>

        {/* Total */}
        <div className="flex justify-between p-4 bg-background rounded-lg border-2 border-primary mt-4">
          <span className="text-base font-semibold">
            Total de Intercambios:
          </span>
          <span
            className={`text-xl font-bold ${
              total >= 0.9 && total <= 1.1 ? "text-primary" : "text-destructive"
            }`}
          >
            {total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Advertencia solo en modo ganar */}
      {isGain && (total < 0.9 || total > 1.1) && (
        <p className="text-sm text-destructive text-center mt-2">
          ⚠️ Para ganar masa con porciones de 28g, el total debe ser cercano a
          1.00
        </p>
      )}

      {/* =======================================
          🔥 INTERPRETACIÓN HUMANA + PORCIONES
          ======================================= */}
      <div className="mt-6 p-4 bg-background/50 rounded-lg border">
        <h4 className="font-semibold mb-3">¿Qué significa esto?</h4>

        <ul className="space-y-2 text-sm">
          <li>
            🥑 <strong>Grasas:</strong> {renderPortions(fat, "🥑")}
            <span className="text-muted-foreground ml-1">
              ({Math.round(fat)} porciones de 10g)
            </span>
          </li>
          <li>
            🍞 <strong>Carbohidratos:</strong> {renderPortions(carb, "🍞")}
            <span className="text-muted-foreground ml-1">
              ({Math.round(carb)} porciones de 15g)
            </span>
          </li>
          <li>
            🍗 <strong>Proteínas:</strong> {renderPortions(prot, "🍗")}
            <span className="text-muted-foreground ml-1">
              ({Math.round(prot)} porciones de 7g)
            </span>
          </li>
        </ul>

        <p className="text-sm text-muted-foreground mt-4">
          Estas porciones serán utilizadas para generar tus menús según tu
          objetivo:
          <strong> {isGain ? "ganar masa muscular" : "perder grasa"}</strong>.
        </p>
      </div>
    </Card>
  );
};
