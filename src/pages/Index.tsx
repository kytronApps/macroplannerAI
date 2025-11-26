import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NutritionalInput } from "@/components/NutritionalInput";
import { MealSelector } from "@/components/MealSelector";
import { PreferencesForm } from "@/components/PreferencesForm";
import { ExchangeCalculator } from "@/components/ExchangeCalculator";
import { MenuDisplay } from "@/components/MenuDisplay";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ChefHat, Sparkles } from "lucide-react";

const Index = () => {
  const [calories, setCalories] = useState("");
  const [fats, setFats] = useState("");
  const [carbs, setCarbs] = useState("");
  const [proteins, setProteins] = useState("");
  const [selectedMeals, setSelectedMeals] = useState<string[]>([
    "Desayuno",
    "Comida",
    "Cena",
  ]);
  const [includeDessert, setIncludeDessert] = useState(false);
  const [allergies, setAllergies] = useState("");
  const [preferences, setPreferences] = useState("");
  const [intolerances, setIntolerances] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mealPlan, setMealPlan] = useState(null);
  const [menuCount, setMenuCount] = useState(1);
  const { toast } = useToast();

  const handleMealToggle = (meal: string) => {
    setSelectedMeals((prev) =>
      prev.includes(meal) ? prev.filter((m) => m !== meal) : [...prev, meal]
    );
  };

  const handleGenerateMealPlan = async () => {
    if (!calories || !fats || !carbs || !proteins) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa todos los valores nutricionales",
        variant: "destructive",
      });
      return;
    }

    if (selectedMeals.length === 0) {
      toast({
        title: "Sin comidas seleccionadas",
        description: "Por favor selecciona al menos una comida del día",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setMealPlan(null);

    try {
      const response = await fetch(
        "https://nutriplan-worker.kytronapps.workers.dev",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            calories: parseFloat(calories),
            fats: parseFloat(fats),
            carbs: parseFloat(carbs),
            proteins: parseFloat(proteins),
            meals: selectedMeals,
            includeDessert,
            allergies,
            preferences,
            intolerances,
            menuCount,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      setMealPlan(data);

      toast({
        title: "¡Plan generado!",
        description: "Tu plan de comidas personalizado está listo",
      });
    } catch (err) {
      console.error("Error:", err);
      toast({
        title: "Error",
        description:
          "No se pudo generar el plan de comidas. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ChefHat className="w-12 h-12 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              NutriPlan AI
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Genera planes de comidas personalizados basados en tus necesidades
            nutricionales con el poder de la inteligencia artificial
          </p>
        </div>

        <div className="grid gap-8">
          {/* --- SECCIÓN 1 --- */}
          <Card className="p-6 md:p-8 border-2 shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold">1</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Valores Nutricionales
              </h2>
            </div>

            <NutritionalInput
              calories={calories}
              fats={fats}
              carbs={carbs}
              proteins={proteins}
              onCaloriesChange={setCalories}
              onFatsChange={setFats}
              onCarbsChange={setCarbs}
              onProteinsChange={setProteins}
            />

            {calories && fats && carbs && proteins && (
              <div className="mt-6">
                <ExchangeCalculator
                  fats={parseFloat(fats)}
                  carbs={parseFloat(carbs)}
                  proteins={parseFloat(proteins)}
                />
              </div>
            )}
          </Card>

          {/* --- SECCIÓN 2 --- */}
          <Card className="p-6 md:p-8 border-2 shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                <span className="text-secondary font-bold">2</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Comidas del Día
              </h2>
            </div>

            <MealSelector
              selectedMeals={selectedMeals}
              includeDessert={includeDessert}
              menuCount={menuCount}
              onMealToggle={handleMealToggle}
              onDessertToggle={setIncludeDessert}
              onMenuCountChange={setMenuCount}
            />
          </Card>

          {/* --- SECCIÓN 3 --- */}
          <Card className="p-6 md:p-8 border-2 shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                <span className="text-accent font-bold">3</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                Preferencias y Restricciones
              </h2>
            </div>

            <PreferencesForm
              allergies={allergies}
              preferences={preferences}
              intolerances={intolerances}
              onAllergiesChange={setAllergies}
              onPreferencesChange={setPreferences}
              onIntolerancesChange={setIntolerances}
            />
          </Card>

          {/* BOTÓN */}
          <div className="flex justify-center">
            <Button
              onClick={handleGenerateMealPlan}
              disabled={isLoading}
              size="lg"
              className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generando tu plan...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generar Plan de Comidas
                </>
              )}
            </Button>
          </div>

          {mealPlan && (
            <div className="mt-8">
              <MenuDisplay mealPlan={mealPlan} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
