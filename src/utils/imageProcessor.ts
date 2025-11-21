import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

interface ProcessImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg';
}

async function processImage(
  inputPath: string,
  outputPath: string,
  options: ProcessImageOptions = {}
) {
  const { width, height, quality = 80, format = 'webp' } = options;

  try {
    let imageProcess = sharp(inputPath);

    // Redimensionar si se especifica
    if (width || height) {
      imageProcess = imageProcess.resize(width, height, {
        fit: 'cover',
        position: 'center',
      });
    }

    // Convertir formato
    switch (format) {
      case 'webp':
        imageProcess = imageProcess.webp({ quality });
        break;
      case 'avif':
        imageProcess = imageProcess.avif({ quality });
        break;
      case 'jpeg':
        imageProcess = imageProcess.jpeg({ quality });
        break;
    }

    // Asegurarse de que el directorio existe
    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    // Guardar la imagen
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
      if (file.match(/\.(jpg|jpeg|png)$/i)) {
        const inputPath = path.join(inputDir, file);
        const baseName = path.parse(file).name;

        // Generar versiones optimizadas
        await Promise.all([
          // Imagen completa WebP
          processImage(inputPath, path.join(outputDir, `${baseName}.webp`), {
            width: 800,
            format: 'webp',
          }),
          // Miniatura WebP
          processImage(
            inputPath,
            path.join(outputDir, `${baseName}-thumb.webp`),
            {
              width: 200,
              format: 'webp',
            }
          ),
          // Versión AVIF
          processImage(inputPath, path.join(outputDir, `${baseName}.avif`), {
            width: 800,
            format: 'avif',
          }),
        ]);
      }
    }

    return true;
  } catch (error) {
    console.error('Error processing product images:', error);
    return false;
  }
}

export { processImage, processProductImages };
