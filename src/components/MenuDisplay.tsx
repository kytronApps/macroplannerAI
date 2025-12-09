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

// Tipos simulados
type Ingrediente = {
  ingrediente: string;
  cantidad: string;
};

type Receta = {
  nombre: string;
  ingredientes: Ingrediente[];
  preparacion: string[];
};

type Menu = {
  nombre: string;
  comidas: Record<string, Receta>;
  postre?: Receta;
};

// Datos de ejemplo
const ejemploMenu: Menu[] = [
  {
    nombre: "Menú Saludable 1",
    comidas: {
      Desayuno: {
        nombre: "Avena ligera con frutas",
        ingredientes: [
          { ingrediente: "Avena", cantidad: "50g" },
          { ingrediente: "Leche desnatada", cantidad: "200ml" },
          { ingrediente: "Plátano", cantidad: "1 unidad" }
        ],
        preparacion: [
          "Calentar la leche en una olla",
          "Añadir la avena y cocinar 5 minutos",
          "Servir con plátano en rodajas"
        ]
      },
      Comida: {
        nombre: "Salmón con brócoli y arroz integral",
        ingredientes: [
          { ingrediente: "Salmón", cantidad: "150g" },
          { ingrediente: "Brócoli", cantidad: "200g" },
          { ingrediente: "Arroz integral", cantidad: "80g" }
        ],
        preparacion: [
          "Cocinar el arroz según instrucciones",
          "Hornear el salmón a 180°C durante 15 minutos",
          "Cocer el brócoli al vapor 8 minutos"
        ]
      },
      Merienda: {
        nombre: "Yogur griego con frutos secos",
        ingredientes: [
          { ingrediente: "Yogur griego", cantidad: "150g" },
          { ingrediente: "Nueces", cantidad: "30g" },
          { ingrediente: "Miel", cantidad: "1 cucharadita" }
        ],
        preparacion: [
          "Servir el yogur en un bol",
          "Añadir las nueces troceadas",
          "Agregar un toque de miel"
        ]
      },
      Cena: {
        nombre: "Chile relleno de pollo",
        ingredientes: [
          { ingrediente: "Pimiento", cantidad: "2 unidades" },
          { ingrediente: "Pechuga de pollo", cantidad: "100g" },
          { ingrediente: "Tomate", cantidad: "2 unidades" }
        ],
        preparacion: [
          "Asar los pimientos y pelarlos",
          "Cocinar el pollo desmenuzado con tomate",
          "Rellenar los pimientos y gratinar"
        ]
      }
    },
    postre: {
      nombre: "Papilla de avena con plátano",
      ingredientes: [
        { ingrediente: "Avena", cantidad: "30g" },
        { ingrediente: "Plátano maduro", cantidad: "1 unidad" },
        { ingrediente: "Canela", cantidad: "1 pizca" }
      ],
      preparacion: [
        "Triturar el plátano con la avena",
        "Añadir canela al gusto",
        "Servir frío o tibio"
      ]
    }
  }
];

const MenuDisplay = () => {
  const [feedbackState, setFeedbackState] = useState<Record<string, 'like' | 'dislike' | null>>({});
  const [regenerating, setRegenerating] = useState<Record<string, boolean>>({});

  const iconoComida: Record<string, any> = {
    Desayuno: Coffee,
    Comida: Sun,
    Merienda: Cookie,
    Cena: Moon,
  };

  const handleFeedback = (menuNombre: string, comidaNombre: string, tipo: 'like' | 'dislike') => {
    const key = `${menuNombre}-${comidaNombre}`;
    setFeedbackState(prev => ({
      ...prev,
      [key]: prev[key] === tipo ? null : tipo
    }));
    // Aquí iría la llamada a enviarFeedback
  };

  const handleRegenerar = (key: string) => {
    setRegenerating(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setRegenerating(prev => ({ ...prev, [key]: false }));
    }, 1500);
    // Aquí iría la llamada a regenerarComida
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8">
      {/* Header Principal */}
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8 text-purple-600" />
          Tu Plan Nutricional
        </h1>
        <p className="text-gray-600">Menús personalizados para alcanzar tus objetivos</p>
      </div>

      {ejemploMenu.map((menu, idx) => (
        <Card key={idx} className="overflow-hidden border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
          {/* Header del Menú con gradiente */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
            <h2 className="text-2xl font-bold">{menu.nombre}</h2>
            <p className="text-purple-100 text-sm mt-1">Plan completo del día</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Bloques de Comidas */}
            {Object.entries(menu.comidas).map(([nombreComida, receta]) => {
              const IconoComida = iconoComida[nombreComida] || UtensilsCrossed;
              const feedbackKey = `${menu.nombre}-${nombreComida}`;
              const feedback = feedbackState[feedbackKey];
              const isRegenerating = regenerating[feedbackKey];

              return (
                <Card
                  key={nombreComida}
                  className="border border-gray-200 hover:border-purple-300 transition-colors duration-200 overflow-hidden"
                >
                  {/* Header de la comida con color de fondo suave */}
                  <div className="bg-gradient-to-r from-gray-50 to-white p-4 border-b">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <IconoComida className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{nombreComida}</h3>
                        <p className="text-sm text-gray-600">{receta.nombre}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-4">
                    {/* Ingredientes */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-purple-700">
                        <UtensilsCrossed className="w-5 h-5" />
                        <span className="font-semibold text-sm uppercase tracking-wide">Ingredientes</span>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3">
                        <ul className="space-y-1.5">
                          {receta.ingredientes.map((ing, i) => (
                            <li key={i} className="text-sm text-gray-700 flex justify-between">
                              <span>{ing.ingrediente}</span>
                              <span className="font-semibold text-purple-700">{ing.cantidad}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Preparación */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-blue-700">
                        <ListChecks className="w-5 h-5" />
                        <span className="font-semibold text-sm uppercase tracking-wide">Preparación</span>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <ol className="space-y-2">
                          {receta.preparacion.map((paso, i) => (
                            <li key={i} className="text-sm text-gray-700 flex gap-3">
                              <span className="font-bold text-blue-600 min-w-6">{i + 1}.</span>
                              <span>{paso}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      <button
                        className={`flex-1 min-w-[120px] px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                          feedback === 'like'
                            ? 'bg-green-600 text-white shadow-lg scale-105'
                            : 'bg-white border-2 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-400'
                        }`}
                        onClick={() => handleFeedback(menu.nombre, nombreComida, 'like')}
                      >
                        <ThumbsUp className={`w-4 h-4 ${feedback === 'like' ? 'fill-current' : ''}`} />
                        Me gustó
                      </button>

                      <button
                        className={`flex-1 min-w-[120px] px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                          feedback === 'dislike'
                            ? 'bg-red-600 text-white shadow-lg scale-105'
                            : 'bg-white border-2 border-red-200 text-red-700 hover:bg-red-50 hover:border-red-400'
                        }`}
                        onClick={() => handleFeedback(menu.nombre, nombreComida, 'dislike')}
                      >
                        <ThumbsDown className={`w-4 h-4 ${feedback === 'dislike' ? 'fill-current' : ''}`} />
                        No me gustó
                      </button>

                      <button
                        className="flex-1 min-w-[120px] px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium text-sm hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
                        onClick={() => handleRegenerar(feedbackKey)}
                        disabled={isRegenerating}
                      >
                        <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
                        {isRegenerating ? 'Regenerando...' : 'Regenerar'}
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}

            {/* Postre */}
            {menu.postre && (
              <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 overflow-hidden">
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-yellow-200 p-2 rounded-lg">
                      <Cake className="w-6 h-6 text-yellow-700" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Postre: {menu.postre.nombre}
                    </h3>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold text-sm text-gray-700 mb-2">Ingredientes:</p>
                      <ul className="space-y-1">
                        {menu.postre.ingredientes.map((ing, i) => (
                          <li key={i} className="text-sm text-gray-700 flex justify-between">
                            <span>{ing.ingrediente}</span>
                            <span className="font-semibold">{ing.cantidad}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="font-semibold text-sm text-gray-700 mb-2">Preparación:</p>
                      <ol className="space-y-1">
                        {menu.postre.preparacion.map((p, i) => (
                          <li key={i} className="text-sm text-gray-700 flex gap-2">
                            <span className="font-bold">{i + 1}.</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Botón Regenerar Menú Completo */}
            <div className="flex justify-end pt-4">
              <button
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
                onClick={() => handleRegenerar(`menu-${idx}`)}
              >
                <RefreshCw className={`w-5 h-5 ${regenerating[`menu-${idx}`] ? 'animate-spin' : ''}`} />
                Regenerar menú completo
              </button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MenuDisplay;