import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  Sparkles,
  Heart,
  HeartCrack,
  Loader2,
  CheckCircle2
} from "lucide-react";

import { enviarFeedback } from "@/api/fetchFeedback";
import { regenerarComida } from "@/utils/regenerarComida";
import { regenerarMenu } from "@/utils/regenerarMenu";

import type { LucideIcon } from "lucide-react";
import type { MenuDisplayProps, Receta } from "@/types/menu-display.type";

// ------------------------------------------------------
// 🔵 Modal Types
// ------------------------------------------------------
type ModalState = {
  isOpen: boolean;
  type: "like" | "dislike" | "regenerate" | "regenerate-menu" | null;
  title: string;
  description: string;
  isLoading: boolean;
};

// ------------------------------------------------------
// 🔵 Íconos según tipo de comida
// ------------------------------------------------------
const iconoComida: Record<string, LucideIcon> = {
  Desayuno: Coffee,
  Comida: Sun,
  Merienda: Cookie,
  Cena: Moon
};

export const MenuDisplay = ({ mealPlan, objective }: MenuDisplayProps) => {
  const [menusState, setMenusState] = useState(mealPlan.menus);
  const [feedbackState, setFeedbackState] = useState<Record<string, "like" | "dislike" | null>>({});
  const [regenerating, setRegenerating] = useState<Record<string, boolean>>({});

  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    type: null,
    title: "",
    description: "",
    isLoading: false
  });

  const menus = menusState ?? [];

  // ------------------------------------------------------
  // 🎨 Modal Config
  // ------------------------------------------------------
  const getModalConfig = (type: ModalState["type"]) => {
    switch (type) {
      case "like":
        return {
          icon: Heart,
          iconColor: "text-green-600",
          bgColor: "bg-green-50",
          buttonColor: "bg-green-600 hover:bg-green-700",
        };
      case "dislike":
        return {
          icon: HeartCrack,
          iconColor: "text-red-600",
          bgColor: "bg-red-50",
          buttonColor: "bg-red-600 hover:bg-red-700",
        };
      case "regenerate":
        return {
          icon: RefreshCw,
          iconColor: "text-blue-600",
          bgColor: "bg-blue-50",
          buttonColor: "bg-blue-600 hover:bg-blue-700",
        };
      case "regenerate-menu":
        return {
          icon: Sparkles,
          iconColor: "text-purple-600",
          bgColor: "bg-purple-50",
          buttonColor: "bg-purple-600 hover:bg-purple-700",
        };
      default:
        return {
          icon: CheckCircle2,
          iconColor: "text-gray-600",
          bgColor: "bg-gray-50",
          buttonColor: "bg-gray-600 hover:bg-gray-700",
        };
    }
  };

  const config = getModalConfig(modalState.type);
  const ModalIcon = config.icon;

  // ------------------------------------------------------
  // 💚 LIKE / DISLIKE
  // ------------------------------------------------------
  const handleFeedback = async (
    menuNombre: string,
    comidaNombre: string,
    receta: Receta,
    tipo: "like" | "dislike"
  ) => {
    const key = `${menuNombre}-${comidaNombre}`;
    const isAlready = feedbackState[key] === tipo;

    setModalState({
      isOpen: true,
      type: tipo,
      title: tipo === "like" ? "¡Genial! 🎉" : "Entendido 👍",
      description:
        tipo === "like"
          ? `Nos alegra que te haya gustado "${receta.nombre}".`
          : `Registramos que "${receta.nombre}" no fue de tu agrado.`,
      isLoading: true,
    });

    setFeedbackState(prev => ({
      ...prev,
      [key]: isAlready ? null : tipo,
    }));

    await enviarFeedback(menuNombre, comidaNombre, receta, tipo, objective);

    setModalState(prev => ({ ...prev, isLoading: false }));
  };

  // ------------------------------------------------------
  // 🟦 REGENERAR UNA COMIDA
  // ------------------------------------------------------
  const handleRegenerar = async (
    menuIndex: number,
    comidaNombre: string,
    recetaActual: Receta
  ) => {
    setModalState({
      isOpen: true,
      type: "regenerate",
      title: "Regenerando receta... 🔄",
      description: `Estamos creando una nueva opción para tu ${comidaNombre}.`,
      isLoading: true,
    });

    const regenKey = `${menuIndex}-${comidaNombre}`;
    setRegenerating(prev => ({ ...prev, [regenKey]: true }));

    try {
      const nuevo = await regenerarComida(
        objective,
        comidaNombre,
        recetaActual,
        Object.keys(menusState[menuIndex]?.comidas ?? {})
      );

      setMenusState(prev => {
        const copy = [...prev];
        copy[menuIndex].comidas[comidaNombre] = nuevo.receta;
        return copy;
      });

      setModalState({
        isOpen: true,
        type: "regenerate",
        title: "¡Receta regenerada! ✨",
        description: `Nueva receta: "${nuevo.receta.nombre}".`,
        isLoading: false,
      });
    } catch (err) {
      console.error("Error regenerando comida:", err);
      setModalState({
        isOpen: true,
        type: "regenerate",
        title: "Error al regenerar",
        description: "No pudimos generar la nueva receta. Intenta otra vez.",
        isLoading: false,
      });
    }

    setRegenerating(prev => ({ ...prev, [regenKey]: false }));
  };

  // ------------------------------------------------------
  // 🟣 REGENERAR MENÚ COMPLETO
  // ------------------------------------------------------
  const handleRegenerarMenu = async (menuIndex: number) => {
    setModalState({
      isOpen: true,
      type: "regenerate-menu",
      title: "Regenerando menú completo... 🍽️",
      description: "Estamos creando un menú totalmente nuevo.",
      isLoading: true,
    });

    const regenKey = `menu-${menuIndex}`;
    setRegenerating(prev => ({ ...prev, [regenKey]: true }));

    try {
      const nuevoMenu = await regenerarMenu(
        objective,
        Object.keys(menusState[menuIndex]?.comidas ?? [])
      );

      setMenusState(prev => {
        const copy = [...prev];
        copy[menuIndex] = nuevoMenu.menus[0];
        return copy;
      });

      setModalState({
        isOpen: true,
        type: "regenerate-menu",
        title: "¡Menú regenerado! 🎊",
        description: "Tu nuevo menú ya está listo.",
        isLoading: false,
      });
    } catch (err) {
      console.error("Error regenerando menú:", err);
      setModalState({
        isOpen: true,
        type: "regenerate-menu",
        title: "Error al regenerar menú",
        description: "No pudimos crear un nuevo menú. Intenta nuevamente.",
        isLoading: false,
      });
    }

    setRegenerating(prev => ({ ...prev, [regenKey]: false }));
  };

  // ------------------------------------------------------
  // 🔵 RENDER PRINCIPAL
  // ------------------------------------------------------
  return (
    <>
      <div className="max-w-5xl mx-auto p-4 space-y-8">
        <h1 className="text-3xl font-bold flex items-center gap-2 justify-center mt-6">
          <Sparkles className="w-8 h-8 text-purple-600" />
          Tu Plan Nutricional
        </h1>

        {menus.map((menu, menuIndex) => {
          const comidas = menu?.comidas ?? {}; // 🔥 FIX ANTI-CRASH

          return (
            <Card
              key={menuIndex}
              className="border-2 border-gray-100 shadow-lg mt-6"
            >
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-5">
                <h2 className="text-xl font-bold">{menu.nombre}</h2>
              </div>

              <div className="p-6 space-y-6">
                {Object.entries(comidas).map(([nombreComida, recetaRaw]) => {
                  // 🔥 FIX: Receta segura aunque venga undefined
                  const receta: Receta = recetaRaw ?? {
                    nombre: "Receta no disponible",
                    ingredientes: [],
                    preparacion: [],
                  };

                  const Icono = iconoComida[nombreComida] || UtensilsCrossed;
                  const regenKey = `${menuIndex}-${nombreComida}`;
                  const isRegenerating = regenerating[regenKey];

                  return (
                    <Card key={nombreComida} className="p-4 border shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <Icono className="w-6 h-6 text-purple-600" />
                        <div>
                          <h3 className="font-semibold">{nombreComida}</h3>
                          <p className="text-sm text-gray-600">
                            {receta.nombre}
                          </p>
                        </div>
                      </div>

                      {/* Ingredientes */}
                      <div>
                        <h4 className="font-semibold mb-2">Ingredientes</h4>
                        <ul className="bg-purple-50 p-3 rounded-lg">
                          {receta.ingredientes.map((ing, i) => (
                            <li key={i} className="flex justify-between text-sm">
                              <span>{ing.ingrediente}</span>
                              <span className="font-semibold">
                                {ing.cantidad}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Preparación */}
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Preparación</h4>
                        <ol className="bg-blue-50 p-3 rounded-lg space-y-1">
                          {receta.preparacion.map((paso, i) => (
                            <li key={i} className="text-sm">
                              <strong>{i + 1}.</strong> {paso}
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Botones de acción */}
                      <div className="mt-4 flex gap-3">
                        <button
                          onClick={() =>
                            handleFeedback(menu.nombre, nombreComida, receta, "like")
                          }
                          className="px-4 py-2 rounded bg-green-600 text-white flex items-center gap-2"
                        >
                          <ThumbsUp className="w-4 h-4" /> Me gustó
                        </button>

                        <button
                          onClick={() =>
                            handleFeedback(menu.nombre, nombreComida, receta, "dislike")
                          }
                          className="px-4 py-2 rounded bg-red-600 text-white flex items-center gap-2"
                        >
                          <ThumbsDown className="w-4 h-4" /> No me gustó
                        </button>

                        <button
                          onClick={() =>
                            handleRegenerar(menuIndex, nombreComida, receta)
                          }
                          disabled={isRegenerating}
                          className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2 disabled:opacity-50"
                        >
                          <RefreshCw
                            className={`w-4 h-4 ${
                              isRegenerating ? "animate-spin" : ""
                            }`}
                          />
                          {isRegenerating ? "Regenerando..." : "Regenerar"}
                        </button>
                      </div>
                    </Card>
                  );
                })}

                {/* Regenerar menú completo */}
                <div className="flex justify-end pt-4">
                  <button
                    onClick={() => handleRegenerarMenu(menuIndex)}
                    disabled={regenerating[`menu-${menuIndex}`]}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2"
                  >
                    <RefreshCw
                      className={`w-5 h-5 ${
                        regenerating[`menu-${menuIndex}`]
                          ? "animate-spin"
                          : ""
                      }`}
                    />
                    {regenerating[`menu-${menuIndex}`]
                      ? "Regenerando..."
                      : "Regenerar menú completo"}
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* MODAL */}
      <AlertDialog
        open={modalState.isOpen}
        onOpenChange={(open) =>
          setModalState((prev) => ({ ...prev, isOpen: open }))
        }
      >
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <div
              className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${config.bgColor}`}
            >
              {modalState.isLoading ? (
                <Loader2
                  className={`h-8 w-8 animate-spin ${config.iconColor}`}
                />
              ) : (
                <ModalIcon className={`h-8 w-8 ${config.iconColor}`} />
              )}
            </div>
            <AlertDialogTitle className="text-center text-xl">
              {modalState.title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              {modalState.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogAction
              className={`${config.buttonColor} text-white px-8`}
              disabled={modalState.isLoading}
            >
              {modalState.isLoading ? "Procesando..." : "Aceptar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};