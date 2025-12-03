import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import {
  buildOutputPaths,
  ensureDir,
  ProcessImageOptions,
  resizeAndFormat,
} from './imageProcessor.helpers';

async function processImage(
  inputPath: string,
  outputPath: string,
  options: ProcessImageOptions = {}
) {
  try {
    const imageProcess = resizeAndFormat(sharp(inputPath), options);
    await ensureDir(outputPath);
    await imageProcess.toFile(outputPath);
    return true;
  } catch (error) {
    console.error('Error processing image:', error);
    return false;
  }
}

async function processProductImages(inputDir: string, outputDir: string) {
  try {
    const files = await fs.readdir(inputDir);

    for (const file of files) {
      if (!file.match(/\.(jpg|jpeg|png)$/i)) continue;
      const inputPath = path.join(inputDir, file);
      const outputs = buildOutputPaths(file, outputDir);

      await Promise.all([
        processImage(inputPath, outputs.fullWebp, {
          width: 800,
          format: 'webp',
        }),
        processImage(inputPath, outputs.thumbWebp, {
          width: 200,
          format: 'webp',
        }),
        processImage(inputPath, outputs.fullAvif, {
          width: 800,
          format: 'avif',
        }),
      ]);
    }

    return true;
  } catch (error) {
    console.error('Error processing product images:', error);
    return false;
  }
}

export { processImage, processProductImages };
