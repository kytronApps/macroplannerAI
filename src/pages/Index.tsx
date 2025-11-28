import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NutritionalInput } from "@/components/NutritionalInput";
import { MealSelector } from "@/components/MealSelector";
import { PreferencesForm } from "@/components/PreferencesForm";
import { ExchangeCalculator } from "@/components/ExchangeCalculator";
import { MenuDisplay } from "@/components/MenuDisplay";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ChefHat, Sparkles, FileText } from "lucide-react"; // Importamos FileText para el icono del PDF
import { ObjectiveSelector } from "@/components/ObjectiveSelector";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// ⚠️ Nota: Asume que las interfaces del tipo de respuesta (mealPlan)
// han sido actualizadas según las correcciones previas en MenuDisplay.tsx.

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

  const [objective, setObjective] = useState<"perder" | "ganar" | "mantener">(
    "perder"
  );

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
            objective,
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

  // FUNCIÓN PARA DESCARGAR PDF (AÑADIDA)
  const handleDownloadPDF = async () => {
    // 1. Identificar el contenedor del menú por su ID
    const input = document.getElementById("meal-plan-content");

    if (!input) {
      toast({
        title: "Error de captura",
        description:
          "No se pudo encontrar el contenido del menú para descargar.",
        variant: "destructive",
      });
      return;
    }

    // 2. Convertir el HTML a Canvas (Imagen)
    const canvas = await html2canvas(input, {
      scale: 2, // Mejora la calidad de la imagen
      logging: false,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    // 3. Crear el documento PDF (Formato A4)
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210; // Ancho A4 en mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let position = 0;

    // Lógica para manejar contenido multi-página si el menú es muy largo
    if (imgHeight > 297) {
      // 297 es la altura A4 en mm
      let heightLeft = imgHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= 297;

        if (heightLeft > -1) {
          pdf.addPage();
        }
      }
    } else {
      // Contenido cabe en una sola página
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    }

    // 4. Descargar el archivo
    pdf.save("NutriPlan_Personalizado.pdf");

    toast({
      title: "Descarga completada",
      description: "Tu plan de comidas ha sido descargado como PDF.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ChefHat className="w-12 h-12 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              NutriPlan AI
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Genera planes de comidas personalizados basados en tus necesidades
            nutricionales con el poder de la inteligencia artificial
          </p>
        </div>

        <div className="grid gap-8">
          {/* --- SECCIÓN 0: Objetivo --- */}
          <Card className="p-6 md:p-8 border-2 shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold">0</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground">Objetivo</h2>
            </div>

            <ObjectiveSelector
              objective={objective}
              onObjectiveChange={setObjective}
            />
          </Card>

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
                  objective={objective}
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

          {/* BOTÓN DE GENERACIÓN */}
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

          {/* MENÚ Y BOTÓN DE DESCARGA (CORREGIDO) */}
          {mealPlan && (
            <div className="mt-8">
              {/* Botón de descarga PDF */}
              <div className="flex justify-end mb-4">
                <Button
                  onClick={handleDownloadPDF}
                  variant="outline"
                  className="bg-white hover:bg-gray-100 border-2 border-primary text-primary"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Descargar Plan (PDF)
                </Button>
              </div>

              {/* Contenido a capturar por html2canvas */}
              <div id="meal-plan-content">
                <MenuDisplay mealPlan={mealPlan} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
