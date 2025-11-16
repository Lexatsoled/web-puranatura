#!/usr/bin/env node

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, '../public/Jpeg');
const targetDir = path.join(__dirname, '../public/optimized');

// Asegurar que el directorio de destino existe
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

console.log('🚀 Iniciando optimización de imágenes...');
console.log(`📁 Entrada: ${sourceDir}`);
console.log(`📁 Salida: ${targetDir}`);

let processedCount = 0;
const startTime = Date.now();

const files = fs.readdirSync(sourceDir)
  .filter(filename => filename.match(/\.(jpg|jpeg|png)$/i));

console.log(`📊 Encontradas ${files.length} imágenes para procesar`);

for (const filename of files) {
  const sourcePath = path.join(sourceDir, filename);
  const baseName = filename.replace(/\.(jpg|jpeg|png)$/i, '');
  const targetAvif = path.join(targetDir, `${baseName}.avif`);
  const targetWebp = path.join(targetDir, `${baseName}.webp`);

  try {
    // Generar AVIF (mejor compresión)
    await sharp(sourcePath)
      .avif({ quality: 80, effort: 6 })
      .toFile(targetAvif);

    // Generar WebP (ampliamente soportado)
    await sharp(sourcePath)
      .webp({ quality: 80, effort: 6 })
      .toFile(targetWebp);

    const avifSize = (fs.statSync(targetAvif).size / 1024).toFixed(1);
    const webpSize = (fs.statSync(targetWebp).size / 1024).toFixed(1);
    const originalSize = (fs.statSync(sourcePath).size / 1024).toFixed(1);

    processedCount++;
    console.log(`✅ ${filename} (${originalSize}KB) → AVIF: ${avifSize}KB, WebP: ${webpSize}KB`);

  } catch (error) {
    console.error(`❌ Error procesando ${filename}:`, error.message);
  }
}

const elapsed = (Date.now() - startTime) / 1000;
console.log(`\n🎉 Optimización completada. Archivos procesados: ${processedCount}`);
console.log(`⏱️ Tiempo total: ${elapsed.toFixed(1)}s`);