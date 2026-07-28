import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const publicDirectory = path.resolve(
  "./aerox_frontend/public"
);

const jobs = [
  {
    input: "images/banners/Home/home-hero-banner-1-desktop.png",
    width: 1920,
    quality: 78,
  },
  {
    input: "images/banners/Home/home-hero-banner-2-desktop.png",
    width: 1920,
    quality: 78,
  },
  {
    input: "images/banners/Home/home-hero-banner-3-desktop.png",
    width: 1920,
    quality: 78,
  },
  {
    input: "images/banners/Home/home-hero-banner-4-desktop.png",
    width: 1920,
    quality: 78,
  },
  {
    input: "images/banners/Home/home-hero-banner-5-desktop.png",
    width: 1920,
    quality: 78,
  },
  {
    input: "images/banners/Home/home-hero-banner-6-desktop.png",
    width: 1920,
    quality: 78,
  },
  {
    input: "images/banners/Home/home-hero-banner-1-mobile.png",
    width: 900,
    quality: 75,
  },
  {
    input: "images/banners/Home/home-hero-banner-2-mobile.png",
    width: 900,
    quality: 75,
  },
  {
    input: "images/banners/Home/home-hero-banner-3-mobile.png",
    width: 900,
    quality: 75,
  },
  {
    input: "images/banners/Home/home-hero-banner-4-mobile.png",
    width: 900,
    quality: 75,
  },
  {
    input: "images/banners/Home/home-hero-banner-5-mobile.png",
    width: 900,
    quality: 75,
  },
  {
    input: "images/banners/Home/home-hero-banner-6-mobile.png",
    width: 900,
    quality: 75,
  },
  {
    input: "images/banners/Category/Category-bottom-Banner.png",
    width: 1920,
    quality: 78,
  },
  {
    input: "images/logo/TrendzAeroXLogo.png",
    width: 600,
    quality: 82,
  },
];

async function optimise(job) {
  const inputPath = path.join(
    publicDirectory,
    job.input
  );

  const parsed = path.parse(inputPath);

  const outputPath = path.join(
    parsed.dir,
    `${parsed.name}.webp`
  );

  await sharp(inputPath)
    .rotate()
    .resize({
      width: job.width,
      withoutEnlargement: true,
    })
    .webp({
      quality: job.quality,
      effort: 6,
    })
    .toFile(outputPath);

  const original = await fs.stat(inputPath);
  const optimised = await fs.stat(outputPath);

  console.log(
    `${job.input}: ` +
      `${(original.size / 1_048_576).toFixed(2)} MB -> ` +
      `${Math.round(optimised.size / 1024)} KB`
  );
}

for (const job of jobs) {
  try {
    await optimise(job);
  } catch (error) {
    console.error(
      `Failed: ${job.input}`,
      error.message
    );
  }
}

console.log("Image optimisation completed.");