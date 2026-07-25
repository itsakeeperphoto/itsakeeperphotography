import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const sourceDirectory = path.resolve(
  ".artifacts/branding-drive-audit/thumbs",
);
const outputPath = path.resolve(
  ".artifacts/branding-drive-audit/contact-sheet.png",
);
const files = (await fs.readdir(sourceDirectory))
  .filter((file) => /\.(jpe?g|png)$/i.test(file) && !file.startsWith("test-"))
  .sort();

const columns = 5;
const cellWidth = 280;
const cellHeight = 350;
const imageWidth = 252;
const imageHeight = 286;
const rows = Math.ceil(files.length / columns);
const width = columns * cellWidth;
const height = rows * cellHeight;

const composites = [];

for (const [index, file] of files.entries()) {
  const column = index % columns;
  const row = Math.floor(index / columns);
  const left = column * cellWidth;
  const top = row * cellHeight;
  const input = path.join(sourceDirectory, file);

  const image = await sharp(input)
    .rotate()
    .resize(imageWidth, imageHeight, {
      fit: "contain",
      background: "#281E10",
    })
    .jpeg({ quality: 84 })
    .toBuffer();

  composites.push({
    input: image,
    left: left + 14,
    top: top + 12,
  });

  const label = file
    .replace(/\.(jpe?g|png)$/i, "")
    .replace(/^(\d{4}-\d{2}-\d{2})-(\d{2})-/, "$1 · $2 · ");
  const safeLabel = label
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

  composites.push({
    input: Buffer.from(`
      <svg width="${cellWidth}" height="52" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#F2E8D7"/>
        <text x="14" y="23" fill="#281E10" font-family="Arial, sans-serif" font-size="13">
          ${safeLabel.slice(0, 38)}
        </text>
        <text x="14" y="41" fill="#604A31" font-family="Arial, sans-serif" font-size="11">
          ${safeLabel.slice(38, 76)}
        </text>
      </svg>
    `),
    left,
    top: top + 298,
  });

  composites.push({
    input: Buffer.from(`
      <svg width="${cellWidth}" height="${cellHeight}" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.5" y="0.5" width="${cellWidth - 1}" height="${cellHeight - 1}"
          fill="none" stroke="#71674E" stroke-width="1"/>
      </svg>
    `),
    left,
    top,
  });
}

await sharp({
  create: {
    width,
    height,
    channels: 3,
    background: "#F2E8D7",
  },
})
  .composite(composites)
  .png()
  .toFile(outputPath);

console.log(`${files.length} thumbnails → ${outputPath}`);
