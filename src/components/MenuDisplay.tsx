import { useState, useEffect } from "react";
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
  Sparkles,
  Heart,
  HeartCrack,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import { enviarFeedback } from "@/api/fetchFeedback";
import { regenerarComida } from "@/utils/regenerarComida";
import { regenerarMenu } from "@/utils/regenerarMenu";

import type { LucideIcon } from "lucide-react";
import type {
  GeneratedMenu,
  MenuDisplayProps,
  Receta,
} from "@/types/menu-display.type";

type ModalState = {
  isOpen: boolean;
  type: "like" | "dislike" | "regenerate" | "regenerate-menu" | null;
  title: string;
  description: string;
  isLoading: boolean;
};

export const MenuDisplay = ({ mealPlan, objective }: MenuDisplayProps) => {
  console.log("[MenuDisplay] mealPlan prop:", mealPlan);

  const getRawMenus = (plan: unknown): unknown => {
    if (!plan || typeof plan !== "object") return [];
    const p = plan as Record<string, unknown>;
    return p.menus ?? p.menu ?? p.plan ?? [];
  };

  // ======================================================
  // 🔧 FUNCIÓN NORMALIZAR RECETA (MEJORADA)
  // ======================================================
  function normalizeReceta(r: unknown): Receta | null {
    if (!r || typeof r !== "object") return null;

    const rr = r as Record<string, unknown>;
    const nombre: string =
      (rr.nombre as string) ||
      (rr.Nombre as string) ||
      (rr.titulo as string) ||
      (rr.name as string) ||
      "";

    // preparacion puede venir como 'preparacion' o 'preparación'
    const preparacionRaw: unknown =
      rr.preparacion ?? rr["preparación"] ?? rr.preparación ?? [];
    const preparacion: string[] = Array.isArray(preparacionRaw)
      ? (preparacionRaw as unknown[]).map((p) => String(p))
      : [];

    // ingredientes puede venir como array de objetos o de strings
    const ingredientesRaw: unknown = rr.ingredientes ?? rr.Ingredientes ?? [];
    const ingredientes = Array.isArray(ingredientesRaw)
      ? (ingredientesRaw as unknown[]).map((ing) => {
          if (!ing) return { ingrediente: "", cantidad: "" };
          if (typeof ing === "string") {
            const s = ing as string;
            // Patrón mejorado: "150g patata (cocida)" o "10ml (1 cuchara) aceite"
            const m = s.match(
              /^\s*([0-9]+(?:\.[0-9]+)?[a-zA-Z]*(?:\s*\([^)]+\))?)\s+(.+)$/
            );
            if (m) return { ingrediente: m[2].trim(), cantidad: m[1].trim() };

            // Patrón alternativo: "2 huevos"
            const m2 = s.match(/^\s*([0-9]+(?:\.[0-9]+)?)\s+(.+)$/);
            if (m2)
              return { ingrediente: m2[2].trim(), cantidad: m2[1].trim() };

            // Si no coincide con ningún patrón, usar todo como ingrediente
            return { ingrediente: s, cantidad: "" };
          }
          // objeto ya formado
          const io = ing as Record<string, unknown>;
          return {
            ingrediente:
              (io.ingrediente as string) ?? (io.name as string) ?? "",
            cantidad: (io.cantidad as string) ?? (io.qty as string) ?? "",
          };
        })
      : [];

    return {
      nombre,
      ingredientes,
      preparacion,
    } as Receta;
  }

  // ======================================================
  // 🔧 FUNCIÓN NORMALIZAR COMIDAS (MEJORADA)
  // ======================================================
  function normalizeComidas(menu: Record<string, unknown>) {
    const rawComidas =
      (menu.comidas as unknown) ??
      (menu.Comidas as unknown) ??
      (menu.meals as unknown) ??
      (menu.platos as unknown) ??
      null;

    if (rawComidas && typeof rawComidas === "object") {
      if (Array.isArray(rawComidas)) {
        return rawComidas.reduce((acc, item, idx) => {
          if (!item || typeof item !== "object") return acc;
          const itemObj = item as Record<string, unknown>;
          const nombre =
            (itemObj.comida as string) ||
            (itemObj.nombre as string) ||
            `Comida ${idx + 1}`;
          const receta = (itemObj.receta as unknown) ?? itemObj;
          acc[nombre] = receta;
          return acc;
        }, {} as Record<string, unknown>);
      }
      return rawComidas as Record<string, unknown>;
    }

    // Algunos modelos devuelven las comidas como claves sueltas en el menú
    const knownKeys = [
      "Desayuno",
      "Comida",
      "Almuerzo",
      "Merienda",
      "Cena",
      "Snack",
      "Colacion",
      "Colación",
      "Brunch",
    ];

    const result: Record<string, unknown> = {};

    knownKeys.forEach((key) => {
      const value = (menu as Record<string, unknown>)[key];
      if (value) {
        const normalizedKey = key === "Almuerzo" ? "Comida" : key;
        result[normalizedKey] = value;
      }
    });

    // Si no encontramos ninguna comida con las claves conocidas,
    // buscar cualquier propiedad que parezca una receta
    if (Object.keys(result).length === 0) {
      Object.entries(menu).forEach(([key, value]) => {
        // Ignorar campos meta
        if (
          key === "nombre" ||
          key === "titulo" ||
          key === "postre" ||
          key === "Postre"
        ) {
          return;
        }
        if (value && typeof value === "object") {
          const valueObj = value as Record<string, unknown>;
          if (
            valueObj.ingredientes ||
            valueObj.preparacion ||
            valueObj["preparación"] ||
            valueObj.nombre
          ) {
            result[key] = value;
          }
        }
      });
    }

    return result;
  }

  // ======================================================
  // 🔧 FUNCIÓN NORMALIZAR MENÚS
  // ======================================================
  function normalizeMenus(rawMenus: unknown): GeneratedMenu[] {
    if (!Array.isArray(rawMenus)) {
      if (rawMenus && typeof rawMenus === "object") {
        return normalizeMenus([rawMenus]);
      }
      return [];
    }

    return rawMenus.map((menuRaw, idx) => {
      const menu = (menuRaw ?? {}) as Record<string, unknown>;
      const comidasRaw = normalizeComidas(menu);

      const comidas: Record<string, Receta> = {};
      Object.entries(comidasRaw).forEach(([nombre, recetaRaw]) => {
        const receta = normalizeReceta(recetaRaw);
        if (receta) comidas[nombre] = receta;
      });

      const postre = normalizeReceta(
        (menu.postre as unknown) ??
          (menu.Postre as unknown) ??
          (menu.postres as unknown)
      );

      return {
        nombre:
          (menu.nombre as string) ||
          (menu.titulo as string) ||
          `Menú ${idx + 1}`,
        comidas,
        postre: postre ?? null,
      };
    });
  }

  const [feedbackState, setFeedbackState] = useState<
    Record<string, "like" | "dislike" | null>
  >({});

  const [regenerating, setRegenerating] = useState<Record<string, boolean>>({});
  const [menusState, setMenusState] = useState<GeneratedMenu[]>(() =>
    normalizeMenus(getRawMenus(mealPlan))
  );

  // Sincroniza el estado interno con el prop cada vez que cambian los menús
  useEffect(() => {
    setMenusState(normalizeMenus(getRawMenus(mealPlan)));
  }, [mealPlan]);

  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    type: null,
    title: "",
    description: "",
    isLoading: false,
  });

  if (!mealPlan) {
    console.error("MenuDisplay: mealPlan inválido:", mealPlan);
    return null;
  }

  const menus = Array.isArray(menusState) ? menusState : [];

  if (menus.length === 0) {
    console.warn(
      "MenuDisplay: menús vacíos en este momento, renderizando espacio vacío mientras llegan…"
    );
  }

  const iconoComida: Record<string, LucideIcon> = {
    Desayuno: Coffee,
    Comida: Sun,
    Merienda: Cookie,
    Cena: Moon,
  };

  // ======================================================
  // 🎨 CONFIGURACIÓN DEL MODAL SEGÚN TIPO
  // ======================================================
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
    const isAlreadySelected = feedbackState[key] === tipo;

    setModalState({
      isOpen: true,
      type: tipo,
      title: tipo === "like" ? "¡Genial! 🎉" : "Entendido 👍",
      description:
        tipo === "like"
          ? `Nos alegra que te haya gustado "${receta.nombre}". Usaremos esta información para mejorar tus próximas recomendaciones.`
          : `Tomaremos nota de que "${receta.nombre}" no fue de tu agrado. Te ofreceremos mejores opciones en el futuro.`,
      isLoading: true,
    });

    setFeedbackState((prev) => ({
      ...prev,
      [key]: isAlreadySelected ? null : tipo,
    }));

    console.log("[handleFeedback] Enviando datos:", {
      menuNombre,
      comidaNombre,
      receta,
      tipo,
      objective,
    });
    await enviarFeedback(menuNombre, comidaNombre, receta, tipo, objective);

    setModalState((prev) => ({ ...prev, isLoading: false }));
  };

  // ======================================================
  // 🔵 REGENERAR SOLO UNA COMIDA
  // ======================================================
  const handleRegenerar = async (
    menuIndex: number,
    comidaNombre: string,
    recetaActual: Receta
  ) => {
    setModalState({
      isOpen: true,
      type: "regenerate",
      title: "Regenerando receta... 🔄",
      description: `Estamos creando una nueva opción para tu ${comidaNombre.toLowerCase()}. Esto tomará solo unos segundos.`,
      isLoading: true,
    });

    const key = `${menuIndex}-${comidaNombre}`;
    setRegenerating((prev) => ({ ...prev, [key]: true }));

    try {
      console.log("[handleRegenerar] Enviando datos:", {
        objective,
        comidaNombre,
        recetaActual,
        contextoComidas: Object.keys(menusState[menuIndex]?.comidas || {}),
      });
      const nuevo = await regenerarComida(
        objective,
        comidaNombre,
        recetaActual,
        Object.keys(menusState[menuIndex]?.comidas || {})
      );

      const recetaNormalizada = normalizeReceta(nuevo.receta) ?? recetaActual;

      setMenusState((prev) => {
        const copy = [...prev];
        if (!copy[menuIndex]) return prev;
        copy[menuIndex] = {
          ...copy[menuIndex],
          comidas: {
            ...(copy[menuIndex].comidas || {}),
            [comidaNombre]: recetaNormalizada,
          },
        };
        return copy;
      });

      setModalState({
        isOpen: true,
        type: "regenerate",
        title: "¡Receta regenerada! ✨",
        description: `Tu nueva opción de ${comidaNombre.toLowerCase()} está lista: "${
          nuevo.receta.nombre
        }"`,
        isLoading: false,
      });
    } catch (e) {
      console.error("Error regenerando comida", e);
      setModalState({
        isOpen: true,
        type: "regenerate",
        title: "Error al regenerar",
        description:
          "Hubo un problema al generar la nueva receta. Por favor, intenta de nuevo.",
        isLoading: false,
      });
    }

    setRegenerating((prev) => ({ ...prev, [key]: false }));
  };

  // ======================================================
  // 🟠 REGENERAR MENÚ COMPLETO
  // ======================================================
  const handleRegenerarMenu = async (menuIndex: number) => {
    setModalState({
      isOpen: true,
      type: "regenerate-menu",
      title: "Regenerando menú completo... 🍽️",
      description:
        "Estamos creando un menú completamente nuevo para ti. Esto puede tomar unos momentos.",
      isLoading: true,
    });

    setRegenerating((prev) => ({ ...prev, [`menu-${menuIndex}`]: true }));

    try {
      console.log("[handleRegenerarMenu] Enviando datos:", {
        objective,
        contextoComidas: Object.keys(menusState[menuIndex]?.comidas || {}),
      });
      const nuevoMenu = await regenerarMenu(
        objective,
        Object.keys(menusState[menuIndex]?.comidas || {})
      );

      const menuNormalizado = normalizeMenus(
        (nuevoMenu.menus as unknown) ??
          (nuevoMenu.menu as unknown) ??
          (nuevoMenu.plan as unknown) ??
          []
      )[0];

      setMenusState((prev) => {
        const copy = [...prev];
        if (!copy[menuIndex] || !menuNormalizado) return prev;
        copy[menuIndex] = menuNormalizado;
        return copy;
      });

      setModalState({
        isOpen: true,
        type: "regenerate-menu",
        title: "¡Menú regenerado exitosamente! 🎊",
        description:
          "Tu nuevo menú está listo con recetas frescas y deliciosas.",
        isLoading: false,
      });
    } catch (err) {
      console.error("Error regenerando menú completo", err);
      setModalState({
        isOpen: true,
        type: "regenerate-menu",
        title: "Error al regenerar menú",
        description:
          "Hubo un problema al generar el nuevo menú. Por favor, intenta de nuevo.",
        isLoading: false,
      });
    }

    setRegenerating((prev) => ({ ...prev, [`menu-${menuIndex}`]: false }));
  };

  const config = getModalConfig(modalState.type);
  const ModalIcon = config.icon;

  // ======================================================
  // 🟢 RENDER
  // ======================================================
  return (
    <>
      <div className="max-w-5xl mx-auto p-4 space-y-8">
        {/* CABECERA */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-purple-600" />
            Tu Plan Nutricional
          </h1>
          <p className="text-gray-600">
            Menús personalizados para alcanzar tus objetivos
          </p>
        </div>

        {menus.map((menu, menuIndex) => {
          const comidasEntries = Object.entries(menu.comidas || {});

          return (
            <Card
              key={menuIndex}
              className="overflow-hidden border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
                <h2 className="text-2xl font-bold">{menu.nombre}</h2>
              </div>

              <div className="p-6 space-y-6">
                {/* Si no hay comidas */}
                {comidasEntries.length === 0 && (
                  <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-900">
                    Este menú llegó sin recetas. Pulsa "Regenerar menú completo"
                    para obtener opciones nuevas.
                  </div>
                )}

                {/* LISTA DE COMIDAS */}
                {comidasEntries.map(
                  ([nombreComida, receta]: [string, Receta | undefined]) => {
                    if (!receta) return null;
                    const recetaSafe = normalizeReceta(receta);
                    if (!recetaSafe) return null;

                    const IconoComida =
                      iconoComida[nombreComida] || UtensilsCrossed;

                    const feedbackKey = `${menu.nombre}-${nombreComida}`;
                    const feedback = feedbackState[feedbackKey];

                    const regenKey = `${menuIndex}-${nombreComida}`;
                    const isRegenerating = regenerating[regenKey];

                    return (
                      <Card
                        key={nombreComida}
                        className="border border-gray-200 hover:border-purple-300 transition-colors duration-200 overflow-hidden"
                      >
                        {/* TÍTULO DE LA COMIDA */}
                        <div className="bg-gradient-to-r from-gray-50 to-white p-4 border-b">
                          <div className="flex items-center gap-3">
                            <div className="bg-purple-100 p-2 rounded-lg">
                              <IconoComida className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold">
                                {nombreComida}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {recetaSafe.nombre}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* CONTENIDO */}
                        <div className="p-5 space-y-4">
                          {/* Ingredientes */}
                          <div>
                            <div className="flex items-center gap-2 text-purple-700 mb-2">
                              <UtensilsCrossed className="w-5 h-5" />
                              <span className="font-semibold text-sm uppercase tracking-wide">
                                Ingredientes
                              </span>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-3">
                              <ul className="space-y-1.5">
                                {recetaSafe.ingredientes.map((ing, i) => (
                                  <li
                                    key={i}
                                    className="flex justify-between text-sm"
                                  >
                                    <span>{ing.ingrediente}</span>
                                    <span className="font-semibold text-purple-700">
                                      {ing.cantidad}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Preparación */}
                          <div>
                            <div className="flex items-center gap-2 text-blue-700 mb-2">
                              <ListChecks className="w-5 h-5" />
                              <span className="font-semibold text-sm uppercase tracking-wide">
                                Preparación
                              </span>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-3">
                              <ol className="space-y-2 text-sm">
                                {recetaSafe.preparacion.map((paso, i) => (
                                  <li key={i} className="flex gap-3">
                                    <span className="font-bold text-blue-600">
                                      {i + 1}.
                                    </span>
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
                                handleFeedback(
                                  menu.nombre,
                                  nombreComida,
                                  recetaSafe,
                                  "like"
                                )
                              }
                            >
                              <ThumbsUp
                                className={`w-4 h-4 ${
                                  feedback === "like" ? "fill-current" : ""
                                }`}
                              />
                              Me gustó
                            </button>

                            {/* DISLIKE */}
                            <button
                              className={`flex-1 min-w-[120px] px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                                feedback === "dislike"
                                  ? "bg-red-600 text-white shadow-lg scale-105"
                                  : "bg-white border-2 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-400"
                              }`}
                              onClick={() =>
                                handleFeedback(
                                  menu.nombre,
                                  nombreComida,
                                  recetaSafe,
                                  "dislike"
                                )
                              }
                            >
                              <ThumbsDown
                                className={`w-4 h-4 ${
                                  feedback === "dislike" ? "fill-current" : ""
                                }`}
                              />
                              No me gustó
                            </button>

                            {/* REGENERAR COMIDA */}
                            <button
                              className="flex-1 min-w-[120px] px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium text-sm hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
                              onClick={() =>
                                handleRegenerar(
                                  menuIndex,
                                  nombreComida,
                                  recetaSafe
                                )
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

                {/* REGENERAR MENÚ COMPLETO */}
                <div className="flex justify-end pt-4">
                  <button
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
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
