/**
 * Script para convertir imágenes a formato WebP
 * 
 * Uso:
 * ts-node scripts/convertToWebP.ts
 * 
 * Características:
 * - Convierte JPG, JPEG, PNG a WebP
 * - Mantiene archivos originales
 * - Genera múltiples tamaños (responsive)
 * - Calidad optimizada (85%)
 * - Procesamiento paralelo
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// Configuración
const CONFIG = {
  inputDir: 'public/**/*.{jpg,jpeg,png}',
  quality: 85,
  sizes: [320, 640, 768, 1024], // Tamaños responsive
  skipExisting: true,
};

interface ConversionStats {
  processed: number;
  skipped: number;
  errors: number;
  totalSizeBefore: number;
  totalSizeAfter: number;
}

const stats: ConversionStats = {
  processed: 0,
  skipped: 0,
  errors: 0,
  totalSizeBefore: 0,
  totalSizeAfter: 0,
};

/**
 * Convertir una imagen a WebP
 */
async function convertImage(inputPath: string): Promise<void> {
  try {
    const fileStats = fs.statSync(inputPath);
    stats.totalSizeBefore += fileStats.size;

    const parsedPath = path.parse(inputPath);
    const outputBase = path.join(parsedPath.dir, parsedPath.name);

    // Imagen principal WebP
    const mainOutputPath = `${outputBase}.webp`;

    if (CONFIG.skipExisting && fs.existsSync(mainOutputPath)) {
      console.log(`⏭️  Ya existe: ${mainOutputPath}`);
      stats.skipped++;
      return;
    }

    // Convertir imagen principal
    await sharp(inputPath)
      .webp({ quality: CONFIG.quality })
      .toFile(mainOutputPath);

    const mainStats = fs.statSync(mainOutputPath);
    stats.totalSizeAfter += mainStats.size;

    console.log(`✅ Convertido: ${inputPath} → ${mainOutputPath}`);
    console.log(`   Tamaño: ${formatBytes(fileStats.size)} → ${formatBytes(mainStats.size)} (${Math.round((1 - mainStats.size / fileStats.size) * 100)}% reducción)`);

    // Generar versiones responsive
    for (const width of CONFIG.sizes) {
      const responsivePath = `${outputBase}_${width}.webp`;
      
      if (CONFIG.skipExisting && fs.existsSync(responsivePath)) {
        continue;
      }

      await sharp(inputPath)
        .resize(width, null, { withoutEnlargement: true })
        .webp({ quality: CONFIG.quality })
        .toFile(responsivePath);

      console.log(`   📐 Generado: ${path.basename(responsivePath)} (${width}w)`);
    }

    stats.processed++;
  } catch (error) {
    console.error(`❌ Error procesando ${inputPath}:`, error);
    stats.errors++;
  }
}

/**
 * Formatear bytes a formato legible
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Función principal
 */
async function main() {
  console.log('🖼️  Iniciando conversión de imágenes a WebP...\n');
  console.log(`📁 Buscando imágenes en: ${CONFIG.inputDir}`);
  console.log(`⚙️  Calidad: ${CONFIG.quality}%`);
  console.log(`📐 Tamaños responsive: ${CONFIG.sizes.join(', ')}\n`);

  // Buscar todas las imágenes
  const images = await glob(CONFIG.inputDir, { 
    ignore: ['**/node_modules/**', '**/dist/**'],
    absolute: true,
  });

  if (images.length === 0) {
    console.log('⚠️  No se encontraron imágenes para convertir.');
    return;
  }

  console.log(`🔍 Encontradas ${images.length} imágenes\n`);

  // Procesar imágenes (con límite de concurrencia)
  const BATCH_SIZE = 5;
  for (let i = 0; i < images.length; i += BATCH_SIZE) {
    const batch = images.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(img => convertImage(img)));
  }

  // Mostrar estadísticas finales
  console.log('\n📊 RESUMEN DE CONVERSIÓN:');
  console.log('════════════════════════════════════════');
  console.log(`✅ Procesadas:     ${stats.processed}`);
  console.log(`⏭️  Omitidas:       ${stats.skipped}`);
  console.log(`❌ Errores:        ${stats.errors}`);
  console.log(`📦 Tamaño antes:   ${formatBytes(stats.totalSizeBefore)}`);
  console.log(`📦 Tamaño después: ${formatBytes(stats.totalSizeAfter)}`);
  
  if (stats.totalSizeBefore > 0) {
    const reduction = ((1 - stats.totalSizeAfter / stats.totalSizeBefore) * 100).toFixed(1);
    console.log(`💾 Reducción:      ${reduction}%`);
  }
  
  console.log('════════════════════════════════════════');
  console.log('✨ Conversión completada!\n');
}

// Ejecutar
main().catch(console.error);
