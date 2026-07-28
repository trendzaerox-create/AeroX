import sharp from "sharp";
import {
  access,
  readdir,
  stat,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const scriptDirectory = path.dirname(scriptPath);

const productsDirectory = path.resolve(
  scriptDirectory,
  "../../uploads/trendz-aerox/products"
);

const supportedImagePattern = /\.(png|jpe?g|webp)$/i;

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function generateCardImages() {
  console.log(`Source folder: ${productsDirectory}`);

  const entries = await readdir(productsDirectory, {
    withFileTypes: true,
  });

  const sourceImages = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => supportedImagePattern.test(name))
    .filter((name) => !name.endsWith("-card.webp"))
    .filter((name) => !name.endsWith("-thumb.webp"));

  console.log(`Source images found: ${sourceImages.length}`);

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (const fileName of sourceImages) {
    const inputPath = path.join(
      productsDirectory,
      fileName
    );

    const outputName = fileName.replace(
      supportedImagePattern,
      "-card.webp"
    );

    const outputPath = path.join(
      productsDirectory,
      outputName
    );

    try {
      if (await fileExists(outputPath)) {
        console.log(`Skipped: ${outputName}`);
        skipped += 1;
        continue;
      }

      await sharp(inputPath, {
        failOn: "none",
      })
        .rotate()
        .resize({
          width: 600,
          height: 600,
          fit: "contain",
          withoutEnlargement: true,
          background: {
            r: 255,
            g: 255,
            b: 255,
            alpha: 1,
          },
        })
        .webp({
          quality: 72,
          effort: 5,
          smartSubsample: true,
        })
        .toFile(outputPath);

      const original = await stat(inputPath);
      const thumbnail = await stat(outputPath);

      console.log(
        `${fileName}: ` +
          `${(original.size / (1024 * 1024)).toFixed(2)} MB -> ` +
          `${outputName}: ` +
          `${(thumbnail.size / 1024).toFixed(1)} KB`
      );

      generated += 1;
    } catch (error) {
      console.error(
        `Failed ${fileName}: ${error.message}`
      );

      failed += 1;
    }
  }

  console.log("");
  console.log("Thumbnail generation finished.");
  console.log(`Generated: ${generated}`);
  console.log(`Skipped:   ${skipped}`);
  console.log(`Failed:    ${failed}`);
}

generateCardImages().catch((error) => {
  console.error(error);
  process.exit(1);
});

