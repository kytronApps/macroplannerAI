import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  UtensilsCrossed,
  ListChecks,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Coffee,
  Sun,
  Cookie,
  Moon,
  Cake,
  Sparkles
} from "lucide-react";

import { enviarFeedback } from "@/api/fetchFeedback";
import { regenerarComida } from "@/utils/regenerarComida";
import { regenerarMenu } from "@/utils/regenerarMenu";

import type { LucideIcon } from "lucide-react";
import type { MenuDisplayProps, Receta } from "@/types/menu-display.type";

export const MenuDisplay = ({ mealPlan, objective }: MenuDisplayProps) => {
  const [feedbackState, setFeedbackState] = useState<
    Record<string, "like" | "dislike" | null>
  >({});

  const [regenerating, setRegenerating] = useState<Record<string, boolean>>({});
  const [menusState, setMenusState] = useState(mealPlan.menus); // 🔥 menú editable

  const menus = Array.isArray(menusState) ? menusState : [];

  const iconoComida: Record<string, LucideIcon> = {
  Desayuno: Coffee,
  Comida: Sun,
  Merienda: Cookie,
  Cena: Moon
};

  // ======================================================
  // 🟣 LIKE / DISLIKE
  // ======================================================
  const handleFeedback = async (
    menuNombre: string,
    comidaNombre: string,
    receta: Receta,
    tipo: "like" | "dislike"
  ) => {
    const key = `${menuNombre}-${comidaNombre}`;

    setFeedbackState(prev => ({
      ...prev,
      [key]: prev[key] === tipo ? null : tipo
    }));

    await enviarFeedback(menuNombre, comidaNombre, receta, tipo, objective);
  };

  // ======================================================
  // 🔵 REGENERAR SOLO UNA COMIDA
  // ======================================================
  const handleRegenerar = async (
    menuIndex: number,
    comidaNombre: string,
    recetaActual: Receta
  ) => {
    const key = `${menuIndex}-${comidaNombre}`;
    setRegenerating(prev => ({ ...prev, [key]: true }));

    try {
      const nuevo = await regenerarComida(
        objective,
        comidaNombre,
        recetaActual,
        Object.keys(menusState[menuIndex].comidas)
      );

      // 🔥 Actualizamos SOLO esa receta dentro del menú
      setMenusState(prev => {
        const copy = [...prev];
        copy[menuIndex].comidas[comidaNombre] = nuevo.receta;
        return copy;
      });
    } catch (e) {
      console.error("Error regenerando comida", e);
    }

    setRegenerating(prev => ({ ...prev, [key]: false }));
  };

  // ======================================================
  // 🟠 REGENERAR MENÚ COMPLETO
  // ======================================================
  const handleRegenerarMenu = async (menuIndex: number) => {
    setRegenerating(prev => ({ ...prev, [`menu-${menuIndex}`]: true }));

    try {
      const nuevoMenu = await regenerarMenu(
        objective,
        Object.keys(menusState[menuIndex].comidas)
      );

      // Sustituimos TODO el menú
      setMenusState(prev => {
        const copy = [...prev];
        copy[menuIndex] = nuevoMenu.menus[0];
        return copy;
      });
    } catch (err) {
      console.error("Error regenerando menú completo", err);
    }

    setRegenerating(prev => ({ ...prev, [`menu-${menuIndex}`]: false }));
  };

  // ======================================================
  // 🟢 RENDER
  // ======================================================
  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8 text-purple-600" />
          Tu Plan Nutricional
        </h1>
        <p className="text-gray-600">Menús personalizados para alcanzar tus objetivos</p>
      </div>

      {menus.map((menu, menuIndex) => (
        <Card
          key={menuIndex}
          className="overflow-hidden border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
            <h2 className="text-2xl font-bold">{menu.nombre}</h2>
          </div>

          <div className="p-6 space-y-6">
            {/* ======== COMIDAS ======== */}
            {Object.entries(menu.comidas).map(
              ([nombreComida, receta]: [string, Receta]) => {
                const IconoComida = iconoComida[nombreComida] || UtensilsCrossed;

                const feedbackKey = `${menu.nombre}-${nombreComida}`;
                const feedback = feedbackState[feedbackKey];

                const regenKey = `${menuIndex}-${nombreComida}`;
                const isRegenerating = regenerating[regenKey];

                return (
                  <Card
                    key={nombreComida}
                    className="border border-gray-200 hover:border-purple-300 transition-colors duration-200 overflow-hidden"
                  >
                    <div className="bg-gradient-to-r from-gray-50 to-white p-4 border-b">
                      <div className="flex items-center gap-3">
                        <div className="bg-purple-100 p-2 rounded-lg">
                          <IconoComida className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{nombreComida}</h3>
                          <p className="text-sm text-gray-600">{receta.nombre}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 space-y-4">
                      {/* INGREDIENTES */}
                      <div>
                        <div className="flex items-center gap-2 text-purple-700">
                          <UtensilsCrossed className="w-5 h-5" />
                          <span className="font-semibold text-sm uppercase tracking-wide">
                            Ingredientes
                          </span>
                        </div>

                        <div className="bg-purple-50 rounded-lg p-3">
                          <ul className="space-y-1.5">
                            {receta.ingredientes.map((ing, i) => (
                              <li key={i} className="flex justify-between text-sm">
                                <span>{ing.ingrediente}</span>
                                <span className="font-semibold text-purple-700">
                                  {ing.cantidad}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* PREPARACION */}
                      <div>
                        <div className="flex items-center gap-2 text-blue-700">
                          <ListChecks className="w-5 h-5" />
                          <span className="font-semibold text-sm uppercase tracking-wide">
                            Preparación
                          </span>
                        </div>

                        <div className="bg-blue-50 rounded-lg p-3">
                          <ol className="space-y-2 text-sm">
                            {receta.preparacion.map((paso, i) => (
                              <li key={i} className="flex gap-3">
                                <span className="font-bold text-blue-600">{i + 1}.</span>
                                {paso}
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>

                      {/* BOTONES */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {/* LIKE */}
                        <button
                          className={`flex-1 min-w-[120px] px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                            feedback === "like"
                              ? "bg-green-600 text-white shadow-lg scale-105"
                              : "bg-white border-2 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-400"
                          }`}
                          onClick={() =>
                            handleFeedback(menu.nombre, nombreComida, receta, "like")
                          }
                        >
                          <ThumbsUp className="w-4 h-4" /> Me gustó
                        </button>

                        {/* DISLIKE */}
                        <button
                          className={`flex-1 min-w-[120px] px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                            feedback === "dislike"
                              ? "bg-red-600 text-white shadow-lg scale-105"
                              : "bg-white border-2 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-400"
                          }`}
                          onClick={() =>
                            handleFeedback(menu.nombre, nombreComida, receta, "dislike")
                          }
                        >
                          <ThumbsDown className="w-4 h-4" /> No me gustó
                        </button>

                        {/* REGENERAR */}
                        <button
                          className="flex-1 min-w-[120px] px-4 py-2.5 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
                          onClick={() =>
                            handleRegenerar(menuIndex, nombreComida, receta)
                          }
                          disabled={isRegenerating}
                        >
                          <RefreshCw
                            className={`w-4 h-4 ${
                              isRegenerating ? "animate-spin" : ""
                            }`}
                          />
                          {isRegenerating ? "Regenerando..." : "Regenerar"}
                        </button>
                      </div>
                    </div>
                  </Card>
                );
              }
            )}

            {/* BOTÓN REGENERAR MENÚ */}
            <div className="flex justify-end pt-4">
              <button
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 disabled:opacity-50"
                onClick={() => handleRegenerarMenu(menuIndex)}
                disabled={regenerating[`menu-${menuIndex}`]}
              >
                <RefreshCw
                  className={`w-5 h-5 ${
                    regenerating[`menu-${menuIndex}`] ? "animate-spin" : ""
                  }`}
                />
                {regenerating[`menu-${menuIndex}`]
                  ? "Regenerando..."
                  : "Regenerar menú completo"}
              </button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};