import { PDFDocument } from "pdf-lib";
import { formatFilenameWithLondonDate } from "./date-utils";
import {
  DEFAULT_FORM_LOGO_SRC,
  fetchUint8,
  logoPngBytesFromSrc,
  stampLogoTopLeftEveryPage,
} from "./form-pdf-branding";

/**
 * Downloads an existing PDF from the site with the ASTA logo stamped top-left on every page.
 */
export async function downloadStaticPdfWithTopLeftLogo(
  pdfUrl: string,
  filenameBase: string,
  logoSrc: string = DEFAULT_FORM_LOGO_SRC
): Promise<void> {
  const [pdfBytes, logoBytes] = await Promise.all([fetchUint8(pdfUrl), logoPngBytesFromSrc(logoSrc)]);
  const doc = await PDFDocument.load(pdfBytes);
  await stampLogoTopLeftEveryPage(doc, logoBytes);
  const out = await doc.save();
  const blob = new Blob([out.slice()], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = formatFilenameWithLondonDate(filenameBase, "pdf");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
