import { PDFDocument } from "pdf-lib";

export const DEFAULT_FORM_LOGO_SRC = "/asta-logo.png";

export async function fetchUint8(url: string): Promise<Uint8Array> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return new Uint8Array(await res.arrayBuffer());
}

export async function loadLogoDataUrl(src: string): Promise<string> {
  const res = await fetch(src);
  if (!res.ok) throw new Error("Could not load logo");
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result as string);
    fr.onerror = reject;
    fr.readAsDataURL(blob);
  });
}

export function naturalLogoSize(src: string): Promise<{ w: number; h: number }> {
  return new Promise((resolve, reject) => {
    const im = new Image();
    im.onload = () => resolve({ w: im.naturalWidth, h: im.naturalHeight });
    im.onerror = () => reject(new Error("Logo image failed to load"));
    im.src = src;
  });
}

/** Logo top-left on every page of an existing PDF (pdf-lib). */
export async function stampLogoTopLeftEveryPage(
  pdfDoc: PDFDocument,
  logoPngBytes: Uint8Array
): Promise<void> {
  const logo = await pdfDoc.embedPng(logoPngBytes);
  const logoW = 40;
  const logoH = logoW * (logo.height / logo.width);

  for (let i = 0; i < pdfDoc.getPageCount(); i++) {
    const page = pdfDoc.getPage(i);
    const { height } = page.getSize();
    page.drawImage(logo, {
      x: 14,
      y: height - logoH - 14,
      width: logoW,
      height: logoH,
    });
  }
}

export async function logoPngBytesFromSrc(logoSrc: string): Promise<Uint8Array> {
  const dataUrl = await loadLogoDataUrl(logoSrc);
  const res = await fetch(dataUrl);
  return new Uint8Array(await res.arrayBuffer());
}
