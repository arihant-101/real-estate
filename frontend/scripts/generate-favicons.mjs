/**
 * Builds app/icon.png and app/apple-icon.png from public brand assets.
 * Run: node scripts/generate-favicons.mjs
 */
import sharp from "sharp";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

/** Transparent canvas so the favicon matches the PNGs (no solid fill behind the mark). */
const BG = { r: 0, g: 0, b: 0, alpha: 0 };

async function buildSquare(size, logoMaxH, textMaxH, gap) {
  const logoBuf = await sharp(join(root, "public", "asta-logo.png"))
    .resize({ width: size - 24, height: logoMaxH, fit: "inside" })
    .toBuffer();
  const textBuf = await sharp(join(root, "public", "asta-text.png"))
    .resize({ width: size - 28, height: textMaxH, fit: "inside" })
    .toBuffer();

  const lm = await sharp(logoBuf).metadata();
  const tm = await sharp(textBuf).metadata();
  const total = lm.height + gap + tm.height;
  const y0 = Math.max(Math.floor(size * 0.06), Math.floor((size - total) / 2));
  const lx = Math.floor((size - lm.width) / 2);
  const tx = Math.floor((size - tm.width) / 2);

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: BG,
    },
  })
    .composite([
      { input: logoBuf, left: lx, top: y0 },
      { input: textBuf, left: tx, top: y0 + lm.height + gap },
    ])
    .png();
}

await (await buildSquare(512, 240, 100, 20)).toFile(join(root, "app", "icon.png"));
await (await buildSquare(180, 86, 36, 8)).toFile(join(root, "app", "apple-icon.png"));

console.log("Wrote app/icon.png and app/apple-icon.png");
