/**
 * Regenerates the favicons and app icons from the logo mark.
 *
 * Run with `node scripts/generate-icons.mjs` after changing public/logo-mark.svg.
 *
 * The icons used to be the wordmark shrunk into a square, which is unreadable
 * below about 128px — five letterforms cannot survive a 16px tab strip. The mark
 * is the shape that does, which is what a mark is for.
 *
 * White mark on brand purple, rather than purple on transparent: a transparent
 * icon disappears against whichever colour the browser or OS puts behind it, and
 * both Safari's tab strip and Android's launcher do put something there.
 */
import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const PURPLE = "#7016cb";
const MARK = "M103 0 206 178.4H0Zm0 64.4-47.23 81.8h94.46Z";

/**
 * `inset` is the share of the canvas left as margin around the mark. Favicons
 * get very little, because at 16px every pixel of the glyph counts; app icons
 * get more, because a launcher draws them large and may round the corners.
 */
function svg(size, inset, { transparent = false } = {}) {
  const box = size * (1 - inset * 2);
  // The mark is wider than it is tall, so height is the limiting dimension only
  // after scaling by the aspect ratio.
  const scale = Math.min(box / 206, box / 178.4);
  const w = 206 * scale;
  const h = 178.4 * scale;
  const x = (size - w) / 2;
  const y = (size - h) / 2;
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">` +
      (transparent ? "" : `<rect width="${size}" height="${size}" fill="${PURPLE}"/>`) +
      `<g transform="translate(${x} ${y}) scale(${scale})">` +
      `<path fill="${transparent ? PURPLE : "#ffffff"}" fill-rule="evenodd" d="${MARK}"/>` +
      `</g></svg>`
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
  ["public/favicon-16.png", 16, 0.06],
  ["public/favicon-32.png", 32, 0.08],
  ["public/favicon-48.png", 48, 0.1],
  ["public/icon-180.png", 180, 0.18],
  ["public/icon-192.png", 192, 0.18],
  ["public/icon-512.png", 512, 0.18],
];

for (const [path, size, inset] of targets) {
  await writeFile(path, await png(size, inset));
  console.log(`  ${path} ${size}×${size}`);
}

await writeFile("public/favicon.ico", await ico([16, 32, 48], 0.08));
console.log("  public/favicon.ico 16/32/48");
