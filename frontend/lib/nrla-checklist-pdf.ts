import jsPDF from "jspdf";
import { formatFilenameWithLondonDate, getLondonDate } from "./date-utils";
import {
  nrlaChecklistCategories,
  nrlaChecklistData,
  type NrlaCategoryId,
} from "@/data/nrla-checklist";
import { DEFAULT_FORM_LOGO_SRC, loadLogoDataUrl, naturalLogoSize } from "./form-pdf-branding";

/**
 * Downloads the same NRLA checklist shown on the site as a PDF, with ASTA logo at the top left
 * and tick marks reflecting the user's current progress.
 */
export async function downloadNrlaChecklistPdfWithLogo(
  checkedItems: Record<string, boolean>,
  options?: { logoSrc?: string }
): Promise<void> {
  const logoSrc = options?.logoSrc ?? DEFAULT_FORM_LOGO_SRC;
  const [logoDataUrl, dims] = await Promise.all([loadLogoDataUrl(logoSrc), naturalLogoSize(logoSrc)]);

  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 16;
  const maxW = pageW - margin * 2;
  let y = 10;

  const ensureSpace = (neededMm: number) => {
    if (y + neededMm > pageH - 12) {
      doc.addPage();
      y = 14;
    }
  };

  const logoMaxW = 42;
  const logoH = logoMaxW * (dims.h / dims.w);
  doc.addImage(logoDataUrl, "PNG", margin, y, logoMaxW, logoH);
  y += logoH + 5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.text("NRLA Checklist", pageW / 2, y, { align: "center" });
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  const subtitle =
    "Comprehensive checklist for landlords and tenants to ensure compliance and smooth tenancy setup.";
  const subLines = doc.splitTextToSize(subtitle, maxW) as string[];
  for (const line of subLines) {
    ensureSpace(5);
    doc.text(line, pageW / 2, y, { align: "center" });
    y += 4.5;
  }
  y += 2;
  doc.setFontSize(8.5);
  doc.setTextColor(90, 90, 90);
  doc.text(`Generated: ${getLondonDate("display")} (London)`, pageW / 2, y, { align: "center" });
  doc.setTextColor(0, 0, 0);
  y += 8;

  const doneCount = Object.values(checkedItems).filter(Boolean).length;
  const total = nrlaChecklistCategories.reduce(
    (acc, id) =>
      acc + nrlaChecklistData[id].items.reduce((s, sec) => s + sec.items.length, 0),
    0
  );
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(`Progress on export: ${doneCount} / ${total} items marked complete`, margin, y);
  y += 7;

  doc.setLineWidth(0.3);
  doc.line(margin, y, pageW - margin, y);
  y += 6;

  const writeBody = (catId: NrlaCategoryId) => {
    const cat = nrlaChecklistData[catId];
    ensureSpace(14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(cat.title, margin, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const dLines = doc.splitTextToSize(cat.description, maxW) as string[];
    for (const line of dLines) {
      ensureSpace(5);
      doc.text(line, margin, y);
      y += 4.5;
    }
    y += 3;

    for (const section of cat.items) {
      ensureSpace(10);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.text(section.title, margin, y);
      y += 5.5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      section.items.forEach((text, index) => {
        const itemId = `${section.id}-${index}`;
        const mark = checkedItems[itemId] ? "[x]" : "[ ]";
        const block = `${mark} ${text}`;
        const lines = doc.splitTextToSize(block, maxW) as string[];
        for (const ln of lines) {
          ensureSpace(5);
          doc.text(ln, margin, y);
          y += 4.8;
        }
      });
      y += 3;
    }
    y += 4;
  };

  (nrlaChecklistCategories as readonly NrlaCategoryId[]).forEach(writeBody);

  doc.save(formatFilenameWithLondonDate("NRLA-Checklist", "pdf"));
}
