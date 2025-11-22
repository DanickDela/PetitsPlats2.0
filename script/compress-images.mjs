// scripts/compress-images.mjs
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

const inputDir = "./assets/JSON-recipes";
const outputDir = "./assets/recipes-comp";

// largeur max en pixels
const MAX_WIDTH = 380;
// qualité jpeg (0 à 100)
const QUALITY = 70;

async function compressAll() {
  await fs.mkdir(outputDir, { recursive: true });

  const files = await fs.readdir(inputDir);

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (![".jpg", ".jpeg", ".png"].includes(ext)) continue;

    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file.replace(ext, ".jpg"));

    console.log(`➡ Compression de ${file}...`);

    await sharp(inputPath)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: QUALITY })
      .toFile(outputPath);

    console.log(`✅ ${outputPath}`);
  }

  console.log("✨ Compression terminée !");
}

compressAll().catch(console.error);
