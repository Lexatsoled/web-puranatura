import { processAllImages, generateImageSizes, generatePlaceholders } from '../utils/imageProcessor';
import path from 'path';

async function optimizeImages() {
  const publicDir = path.join(process.cwd(), 'public');
  const inputDir = path.join(publicDir, 'images', 'originals');
  const outputDir = path.join(publicDir, 'images', 'optimized');
  const placeholderDir = path.join(publicDir, 'images', 'placeholders');

  try {
    console.log('🖼️ Iniciando optimización de imágenes...');

    // Procesar todas las imágenes en formato WebP
    console.log('📦 Procesando imágenes en WebP...');
    const processedImages = await processAllImages(inputDir, outputDir, {
      format: 'webp',
      quality: 85,
    });
    console.log(`✅ ${processedImages.length} imágenes procesadas en WebP`);

    // Generar diferentes tamaños para las imágenes
    console.log('🔄 Generando diferentes tamaños de imágenes...');
    for (const image of processedImages) {
      const sizes = await generateImageSizes(
        path.join(inputDir, image.original),
        outputDir
      );
      console.log(`✅ Generados ${sizes.length} tamaños para ${image.original}`);
    }

    // Generar placeholders
    console.log('🏞️ Generando placeholders...');
    const placeholders = await generatePlaceholders(inputDir, placeholderDir);
    console.log(`✅ ${placeholders.length} placeholders generados`);

    console.log('✨ Optimización de imágenes completada con éxito!');
  } catch (error) {
    console.error('❌ Error durante la optimización de imágenes:', error);
    process.exit(1);
  }
}

optimizeImages();
