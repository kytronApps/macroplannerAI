import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { MealPlanResponse, GeneratedMenu, Receta } from "@/types/menu-display.type";

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

  pdf.addPage(); // Página nueva

  // =========================
  // 📄 MENÚS
  // =========================
  mealPlan.menus.forEach((menu: GeneratedMenu, index: number) => {
    if (index !== 0) pdf.addPage();

    pdf.setFontSize(18);
    pdf.text(menu.nombre, 15, 20);

    // ======================
    // TABLA DE COMIDAS
    // ======================
    Object.entries(menu.comidas).forEach(([nombreComida, receta]: [string, Receta]) => {
      pdf.setFontSize(14);
      pdf.text(`${nombreComida}: ${receta.nombre}`, 15, pdf.lastAutoTable ? (pdf as any).lastAutoTable.finalY + 15 : 30);

      // TABLA de ingredientes
      autoTable(pdf, {
        startY: (pdf as any).lastAutoTable ? (pdf as any).lastAutoTable.finalY + 22 : 40,
        head: [["Ingrediente", "Cantidad"]],
        body: receta.ingredientes.map((i) => [i.ingrediente, i.cantidad]),
        theme: "grid",
        styles: { fontSize: 11 },
        headStyles: { fillColor: [52, 152, 219], textColor: 255 },
      });

      // PREPARACIÓN
      const refY = (pdf as any).lastAutoTable.finalY + 5;
      pdf.setFontSize(12);
      pdf.text("Preparación:", 15, refY);

      let stepY = refY + 6;
      receta.preparacion.forEach((paso, idx) => {
        pdf.text(`• ${paso}`, 20, stepY);
        stepY += 6;
      });

      (pdf as any)._lastY = stepY;
    });

    // ======================
    // POSTRE COMO RECETA
    // ======================
    if (menu.postre) {
      const y = (pdf as any)._lastY + 10;

      pdf.setFontSize(16);
      pdf.text(`🍰 Postre: ${menu.postre.nombre}`, 15, y);

      // Ingredientes del postre
      autoTable(pdf, {
        startY: y + 8,
        head: [["Ingrediente", "Cantidad"]],
        body: menu.postre.ingredientes.map((i) => [i.ingrediente, i.cantidad]),
        theme: "grid",
        styles: { fontSize: 11 },
        headStyles: { fillColor: [255, 178, 102], textColor: 0 },
      });

      // Preparación del postre
      const prepY = (pdf as any).lastAutoTable.finalY + 6;
      pdf.setFontSize(12);
      pdf.text("Preparación:", 15, prepY);

      let lineY = prepY + 6;
      menu.postre.preparacion.forEach((p) => {
        pdf.text(`• ${p}`, 20, lineY);
        lineY += 6;
      });
    }
  });

  // Descargar PDF
  pdf.save("NutriPlan-Personalizado.pdf");
}
