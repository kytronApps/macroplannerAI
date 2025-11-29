import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { MealPlanResponse, GeneratedMenu } from "@/types/menu-display.type";

export function generateMealPlanPDF(mealPlan: MealPlanResponse) {
  const pdf = new jsPDF("p", "mm", "a4");

  const title = "NutriPlan AI – Plan Personalizado";
  const date = new Date().toLocaleDateString();

  // =========================
  // 📘 PORTADA
  // =========================
  pdf.setFontSize(22);
  pdf.text(title, 105, 30, { align: "center" });

  pdf.setFontSize(14);
  pdf.text(`Fecha de generación: ${date}`, 105, 45, { align: "center" });

  pdf.setFontSize(12);
  pdf.text(
    "Plan nutricional generado por IA según tus preferencias.",
    105,
    60,
    { align: "center" }
  );

  pdf.addPage(); // Página nueva para los menús

  // =========================
  // 📄 MENÚS (uno por página)
  // =========================
  mealPlan.menus.forEach((menu: GeneratedMenu, index: number) => {
    if (index !== 0) pdf.addPage();

    pdf.setFontSize(18);
    pdf.text(menu.nombre, 15, 20);

    // Convertir comidas a filas de tabla
    let rows: any[] = [];

    Object.entries(menu.comidas).forEach(([comida, ingredientes]) => {
      if (ingredientes.length > 0) {
        ingredientes.forEach((item) => {
          rows.push([
            comida,
            item.ingrediente,
            item.cantidad
          ]);
        });
      } else {
        rows.push([comida, "—", "—"]);
      }
    });

    autoTable(pdf, {
      startY: 30,
      head: [["Comida", "Ingrediente", "Cantidad"]],
      body: rows,
      theme: "grid",
      styles: {
        fontSize: 11,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [52, 152, 219], // Azul profesional
        textColor: 255,
        halign: "center",
      },
      bodyStyles: {
        halign: "center",
      },
    });

    // Postre
    if (menu.postre && menu.postre !== "null") {
      const y = (pdf as any).lastAutoTable.finalY + 10;
      pdf.setFontSize(14);
      pdf.text("🍰 Postre", 15, y);

      pdf.setFontSize(12);
      pdf.text(menu.postre, 15, y + 8);
    }
  });

  // Descargar PDF
  pdf.save("NutriPlan-Personalizado.pdf");
}
