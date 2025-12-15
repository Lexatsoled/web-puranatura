import fs from 'fs/promises';
import path from 'path';
import { processProductImages } from '../src/utils/imageProcessor.ts';

const LOG_PREFIX = '[optimize-images]';
const SUPPORTED_OUTPUT = /\.(webp|avif|jpe?g)$/i;

const isImageFile = (file: string) => SUPPORTED_OUTPUT.test(file);

async function ensureInputDir(dir: string) {
  try {
    const stats = await fs.stat(dir);
    if (!stats.isDirectory()) {
      throw new Error(`La ruta ${dir} no es un directorio.`);
    }
  } catch (error) {
    throw Object.assign(
      new Error(`No se puede acceder al directorio de entrada: ${dir}`),
      { cause: error }
    );
  }
}

async function countOptimizedFiles(dir: string) {
  try {
    const files = await fs.readdir(dir);
    // Ignore optimized folder to avoid double processing or loops if input==public
    return files.filter((f) => f !== 'optimized').filter(isImageFile).length;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return 0;
    }
    throw error;
  }
}

async function optimizeImages() {
  const publicDir = path.join(process.cwd(), 'public');
  const inputDir = publicDir; // Scan root public directly
  const outputDir = path.join(publicDir, 'optimized');

  try {
    console.info(`${LOG_PREFIX} Iniciando optimización de imágenes...`);
    await ensureInputDir(inputDir);
    await fs.mkdir(outputDir, { recursive: true });

    const beforeCount = await countOptimizedFiles(outputDir);
    console.info(
      `${LOG_PREFIX} Procesando desde ${inputDir} hacia ${outputDir} (archivos previos: ${beforeCount}).`
    );

    const success = await processProductImages(inputDir, outputDir);
    const afterCount = await countOptimizedFiles(outputDir);

    if (!success || afterCount === 0) {
      throw new Error('No se generaron imágenes optimizadas.');
    }

    const generated = Math.max(0, afterCount - beforeCount);
    console.info(
      `${LOG_PREFIX} Optimización completada. Total actual: ${afterCount}. Nuevos o actualizados: ${generated}.`
    );
  } catch (error) {
    console.error(`${LOG_PREFIX} Error durante la optimización:`, error);
    process.exit(1);
  }
}

optimizeImages();
