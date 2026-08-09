import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";

const uploadsDir = path.join(process.cwd(), "public", "uploads");
const widths = [400, 640, 960, 1440];
const sourcePattern = /\.(?:jpe?g|png|webp)$/i;
const generatedPattern = /-(?:400|640|960|1440|mobile|desktop)\.webp$/i;

const files = await fs.readdir(uploadsDir);
const sourceFiles = files.filter(
  (file) => sourcePattern.test(file) && !generatedPattern.test(file)
);

const byBase = new Map();
for (const file of sourceFiles) {
  const base = file.replace(/\.(?:jpe?g|png|webp)$/i, "");
  const current = byBase.get(base);
  if (!current || file.endsWith(".webp")) {
    byBase.set(base, file);
  }
}

const jobs = [];

for (const [base, file] of byBase) {
  const input = path.join(uploadsDir, file);
  const [metadata, inputStat] = await Promise.all([
    sharp(input).metadata(),
    fs.stat(input),
  ]);
  if (!metadata.width) continue;

  for (const width of widths) {
    if (width > metadata.width) continue;

    const output = path.join(uploadsDir, `${base}-${width}.webp`);
    const outputStat = await fs.stat(output).catch(() => null);

    if (outputStat && outputStat.mtimeMs >= inputStat.mtimeMs) continue;

    jobs.push({ input, output, width });
  }
}

const workerCount = Math.min(4, os.availableParallelism(), jobs.length || 1);
let nextJob = 0;

async function runWorker() {
  while (nextJob < jobs.length) {
    const job = jobs[nextJob];
    nextJob += 1;

    await sharp(job.input)
      .resize({ width: job.width, withoutEnlargement: true })
      .webp({ quality: 72, effort: 4, smartSubsample: true })
      .toFile(job.output);
  }
}

await Promise.all(Array.from({ length: workerCount }, () => runWorker()));

console.log(
  jobs.length
    ? `Generated ${jobs.length} responsive image variants with ${workerCount} workers.`
    : "Responsive image variants are up to date."
);
