import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const uploadsDir = path.join(process.cwd(), "public", "uploads");
const maxDimension = 2400;
const maxSourceBytes = 700 * 1024;
const write = process.argv.includes("--write") || process.env.NETLIFY === "true";
const generatedPattern = /-(?:400|640|960|1440|mobile|desktop)\.(?:jpe?g|webp|avif)$/i;

const files = (await fs.readdir(uploadsDir))
  .filter((file) => /\.jpe?g$/i.test(file) && !generatedPattern.test(file))
  .sort();

const candidates = [];

for (const file of files) {
  const input = path.join(uploadsDir, file);
  const [metadata, inputStat] = await Promise.all([
    sharp(input).metadata(),
    fs.stat(input),
  ]);
  const width = metadata.width || 0;
  const height = metadata.height || 0;

  if (
    Math.max(width, height) <= maxDimension &&
    inputStat.size <= maxSourceBytes
  ) continue;

  candidates.push({ file, input, inputStat, width, height });
}

if (!candidates.length) {
  console.log(
    `All JPEG sources are at or below ${maxDimension}px and ${Math.round(maxSourceBytes / 1024)} KiB.`
  );
  process.exit(0);
}

if (!write) {
  console.log(
    `Found ${candidates.length} oversized JPEG sources. Run npm run optimize:source-images -- --write to optimize them.`
  );
  for (const candidate of candidates) {
    console.log(
      `${candidate.file}: ${candidate.width}x${candidate.height}, ${(candidate.inputStat.size / 1048576).toFixed(2)} MiB`
    );
  }
  process.exitCode = 1;
  process.exit();
}

let bytesBefore = 0;
let bytesAfter = 0;

for (const candidate of candidates) {
  const temporary = `${candidate.input}.optimize-${process.pid}.jpg`;

  try {
    await sharp(candidate.input)
      .rotate()
      .resize({
        width: maxDimension,
        height: maxDimension,
        fit: "inside",
        withoutEnlargement: true,
      })
      .keepMetadata()
      .jpeg({ quality: 82, mozjpeg: true, progressive: true })
      .toFile(temporary);

    const [outputMetadata, outputStat] = await Promise.all([
      sharp(temporary).metadata(),
      fs.stat(temporary),
    ]);

    if (
      !outputMetadata.width ||
      !outputMetadata.height ||
      Math.max(outputMetadata.width, outputMetadata.height) > maxDimension ||
      outputStat.size > maxSourceBytes ||
      outputStat.size >= candidate.inputStat.size
    ) {
      throw new Error(`Optimized output failed validation for ${candidate.file}.`);
    }

    await fs.rename(temporary, candidate.input);
    bytesBefore += candidate.inputStat.size;
    bytesAfter += outputStat.size;
    console.log(
      `${candidate.file}: ${candidate.width}x${candidate.height} → ${outputMetadata.width}x${outputMetadata.height}; ${(candidate.inputStat.size / 1048576).toFixed(2)} → ${(outputStat.size / 1048576).toFixed(2)} MiB`
    );
  } finally {
    await fs.rm(temporary, { force: true });
  }
}

console.log(
  `Optimized ${candidates.length} JPEG sources: ${(bytesBefore / 1048576).toFixed(2)} → ${(bytesAfter / 1048576).toFixed(2)} MiB (${((1 - bytesAfter / bytesBefore) * 100).toFixed(1)}% smaller).`
);
