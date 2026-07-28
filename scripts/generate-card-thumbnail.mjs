import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const inputArgument = process.argv[2];
const outputArgument = process.argv[3];

if (!inputArgument || !outputArgument) {
  console.error(
    "Usage: node generate-card-thumbnail.mjs <input> <output>"
  );
  process.exit(1);
}

const inputPath = path.resolve(inputArgument);
const outputPath = path.resolve(outputArgument);

try {
  await fs.mkdir(path.dirname(outputPath), {
    recursive: true,
  });

  await sharp(inputPath)
    .rotate()
    .resize({
      width: 640,
      height: 640,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({
      quality: 72,
      effort: 4,
    })
    .toFile(outputPath);

  const inputStats = await fs.stat(inputPath);
  const outputStats = await fs.stat(outputPath);

  console.log(`Input:  ${inputPath}`);
  console.log(`Output: ${outputPath}`);
  console.log(
    `Original: ${(inputStats.size / 1024 / 1024).toFixed(2)} MB`
  );
  console.log(
    `Card: ${(outputStats.size / 1024).toFixed(0)} KB`
  );
} catch (error) {
  console.error(
    "Thumbnail generation failed:",
    error.message
  );

  process.exit(1);
}
