const MAX_ORIGINAL_BYTES = 8 * 1024 * 1024;
const MAX_EDGE_PX = 1400;
const JPEG_QUALITY = 0.82;

/** Resize and compress to JPEG data URL for API payload. */
export function fileToRepairPhotoDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    return Promise.reject(new Error("Please choose an image file."));
  }
  if (file.size > MAX_ORIGINAL_BYTES) {
    return Promise.reject(new Error("Each image must be under 8MB before processing."));
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      try {
        let w = img.naturalWidth;
        let h = img.naturalHeight;
        if (w < 1 || h < 1) {
          reject(new Error("Invalid image dimensions."));
          return;
        }
        if (w > MAX_EDGE_PX) {
          h = Math.round((h * MAX_EDGE_PX) / w);
          w = MAX_EDGE_PX;
        }
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not process image."));
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
        resolve(dataUrl);
      } catch {
        reject(new Error("Could not process image."));
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not read image."));
    };
    img.src = objectUrl;
  });
}
