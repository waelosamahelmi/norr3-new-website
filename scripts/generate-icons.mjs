/**
 * Regenerates the favicons and app icons: an "N", cropped from the wordmark.
 *
 * Run with `node scripts/generate-icons.mjs` after changing the wordmark artwork.
 *
 * The icons used to be the full wordmark shrunk into a square, which is
 * unreadable below about 128px — five letterforms cannot survive a 16px tab
 * strip. A single letter can, so this crops the "N" the wordmark already draws
 * rather than inventing a separate mark: two polygons taken verbatim from
 * `public/logo-wordmark.svg`, shifted so the letter's own bounding box starts
 * at the origin.
 *
 * White glyph on brand purple, rather than purple on transparent: a
 * transparent icon disappears against whichever colour the browser or OS puts
 * behind it, and both Safari's tab strip and Android's launcher do put
 * something there.
 */
import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const PURPLE = "#7016cb";
const GLYPH_W = 153.29;
const GLYPH_H = 178.45;
const GLYPH = [
  "36.34 178.37 0 178.44 0 0 36.34 0 36.34 178.37",
  "116.78 178.45 53.76 79.89 53.83 16.97 119.18 120.65 119.24 0.01 153.29 0 153.29 178.39 116.78 178.45",
];

/**
 * `inset` is the share of the canvas left as margin around the glyph.
 * Favicons get very little, because at 16px every pixel counts; app icons get
 * more, because a launcher draws them large and may round the corners.
 */
function svg(size, inset, { transparent = false } = {}) {
  const box = size * (1 - inset * 2);
  const scale = Math.min(box / GLYPH_W, box / GLYPH_H);
  const w = GLYPH_W * scale;
  const h = GLYPH_H * scale;
  const x = (size - w) / 2;
  const y = (size - h) / 2;
  const fill = transparent ? PURPLE : "#ffffff";
  const polygons = GLYPH.map((points) => `<polygon fill="${fill}" points="${points}"/>`).join("");
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">` +
      (transparent ? "" : `<rect width="${size}" height="${size}" fill="${PURPLE}"/>`) +
      `<g transform="translate(${x} ${y}) scale(${scale})">${polygons}</g></svg>`
  );
}

const png = (size, inset, opts) => sharp(svg(size, inset, opts)).png({ compressionLevel: 9 }).toBuffer();

/**
 * A .ico containing several sizes, assembled by hand: sharp does not write ICO,
 * and the format is a short header plus one PNG per entry. Browsers pick the
 * size they need, so 16/32/48 covers tab strips, bookmark bars and Windows.
 */
async function ico(sizes, inset) {
  const images = await Promise.all(sizes.map((s) => png(s, inset)));
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(sizes.length, 4);

  let offset = 6 + sizes.length * 16;
  const entries = sizes.map((size, i) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // 0 means 256
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2); // palette size
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(images[i].length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += images[i].length;
    return entry;
  });

  return Buffer.concat([header, ...entries, ...images]);
}

const targets = [
  ["public/favicon-16.png", 16, 0.1],
  ["public/favicon-32.png", 32, 0.12],
  ["public/favicon-48.png", 48, 0.14],
  ["public/icon-180.png", 180, 0.22],
  ["public/icon-192.png", 192, 0.22],
  ["public/icon-512.png", 512, 0.22],
];

for (const [path, size, inset] of targets) {
  await writeFile(path, await png(size, inset));
  console.log(`  ${path} ${size}×${size}`);
}

await writeFile("public/favicon.ico", await ico([16, 32, 48], 0.12));
console.log("  public/favicon.ico 16/32/48");
