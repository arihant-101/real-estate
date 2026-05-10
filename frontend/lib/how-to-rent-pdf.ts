import jsPDF from "jspdf";
import { PDFDocument } from "pdf-lib";
import { formatFilenameWithLondonDate, getLondonDate } from "./date-utils";
import { DEFAULT_FORM_LOGO_SRC, fetchUint8, logoPngBytesFromSrc, stampLogoTopLeftEveryPage } from "./form-pdf-branding";

export type HowToRentChecklistExport = {
  beforeStart: boolean;
  lookingForHome: boolean;
  foundPlace: boolean;
  livingInHome: boolean;
  endOfPeriod: boolean;
  thingsGoWrong: boolean;
};

const CHECKLIST_ROWS: { key: keyof HowToRentChecklistExport; label: string }[] = [
  { key: "beforeStart", label: "Before You Start" },
  { key: "lookingForHome", label: "Looking for Your Home" },
  { key: "foundPlace", label: "When You've Found a Place" },
  { key: "livingInHome", label: "Living in Your Rented Home" },
  { key: "endOfPeriod", label: "At the End of the Fixed Period" },
  { key: "thingsGoWrong", label: "If Things Go Wrong" },
];

/**
 * Official How to Rent PDF (England) plus a final page recording sidebar checklist ticks from this site.
 * Logo top-left on every page after merge.
 */
export async function downloadHowToRentBrandedPdf(
  checklist: HowToRentChecklistExport,
  options?: { govPdfUrl?: string; logoSrc?: string }
): Promise<void> {
  const govPdfUrl = options?.govPdfUrl ?? "/asta-forms/how-to-rent-october-2023.pdf";
  const logoSrc = options?.logoSrc ?? DEFAULT_FORM_LOGO_SRC;

  const [govBytes, logoBytes] = await Promise.all([
    fetchUint8(govPdfUrl),
    logoPngBytesFromSrc(logoSrc),
  ]);

  const summary = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = summary.internal.pageSize.getWidth();
  const pageH = summary.internal.pageSize.getHeight();
  const margin = 16;
  const maxW = pageW - 2 * margin;
  let y = margin;

  summary.setFont("helvetica", "bold");
  summary.setFontSize(14);
  summary.text("How to Rent — progress on this site", margin, y);
  y += 7;
  summary.setFont("helvetica", "normal");
  summary.setFontSize(9);
  summary.setTextColor(70, 70, 70);
  summary.text(`Same guide topics as the sidebar. Exported ${getLondonDate("display")} (London).`, margin, y);
  summary.setTextColor(0, 0, 0);
  y += 10;

  CHECKLIST_ROWS.forEach(({ key, label }) => {
    const mark = checklist[key] ? "[x]" : "[ ]";
    const line = `${mark} ${label}`;
    const lines = summary.splitTextToSize(line, maxW) as string[];
    for (const ln of lines) {
      if (y > pageH - 14) {
        summary.addPage();
        y = margin;
      }
      summary.text(ln, margin, y);
      y += 5.5;
    }
  });

  const merged = await PDFDocument.create();
  const govDoc = await PDFDocument.load(govBytes);
  const sumDoc = await PDFDocument.load(new Uint8Array(summary.output("arraybuffer")));

  (await merged.copyPages(govDoc, govDoc.getPageIndices())).forEach((p) => merged.addPage(p));
  (await merged.copyPages(sumDoc, sumDoc.getPageIndices())).forEach((p) => merged.addPage(p));

  await stampLogoTopLeftEveryPage(merged, logoBytes);

  const out = await merged.save();
  const blob = new Blob([out.slice()], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = formatFilenameWithLondonDate("How-to-Rent-England", "pdf");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
