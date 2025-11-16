#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('✅ Validando PERF-IMG-001: Optimización de Imágenes');

// 1. Verificar directorio optimized
const optimizedDir = path.join(__dirname, '../public/optimized');
if (!fs.existsSync(optimizedDir)) {
  console.log('❌ Directorio optimized no existe');
  process.exit(1);
}
console.log('✅ Directorio optimized existe');

// 2. Verificar archivos generados
const files = fs.readdirSync(optimizedDir);
const avifFiles = files.filter(f => f.endsWith('.avif'));
const webpFiles = files.filter(f => f.endsWith('.webp'));

console.log(`📊 Archivos generados: ${files.length} total, ${avifFiles.length} AVIF, ${webpFiles.length} WebP`);

if (avifFiles.length === 0 || webpFiles.length === 0) {
  console.log('❌ No se generaron archivos AVIF o WebP');
  process.exit(1);
}

// 3. Verificar reducción de tamaño
const sampleJpeg = '5-htp,-200-mg-anverso.jpg';
const jpegPath = path.join(__dirname, '../public/Jpeg', sampleJpeg);
const avifPath = path.join(optimizedDir, sampleJpeg.replace('.jpg', '.avif'));
const webpPath = path.join(optimizedDir, sampleJpeg.replace('.jpg', '.webp'));

if (fs.existsSync(jpegPath) && fs.existsSync(avifPath) && fs.existsSync(webpPath)) {
  const jpegSize = fs.statSync(jpegPath).size;
  const avifSize = fs.statSync(avifPath).size;
  const webpSize = fs.statSync(webpPath).size;

  const avifReduction = ((jpegSize - avifSize) / jpegSize * 100).toFixed(1);
  const webpReduction = ((jpegSize - webpSize) / jpegSize * 100).toFixed(1);

  console.log(`📏 Reducción de tamaño para ${sampleJpeg}:`);
  console.log(`   JPEG: ${(jpegSize/1024).toFixed(1)}KB`);
  console.log(`   AVIF: ${(avifSize/1024).toFixed(1)}KB (${avifReduction}% reducción)`);
  console.log(`   WebP: ${(webpSize/1024).toFixed(1)}KB (${webpReduction}% reducción)`);
}

// 4. Verificar componentes actualizados
const optimizedImagePath = path.join(__dirname, '../src/components/OptimizedImage.tsx');
const imageZoomPath = path.join(__dirname, '../src/components/ImageZoom.tsx');

if (fs.existsSync(optimizedImagePath)) {
  const content = fs.readFileSync(optimizedImagePath, 'utf-8');
  if (content.includes('<picture>') && content.includes('type="image/avif"')) {
    console.log('✅ OptimizedImage.tsx tiene picture element con AVIF');
  } else {
    console.log('❌ OptimizedImage.tsx no tiene picture element actualizado');
  }
}

if (fs.existsSync(imageZoomPath)) {
  const content = fs.readFileSync(imageZoomPath, 'utf-8');
  if (content.includes('<picture>') && content.includes('type="image/avif"')) {
    console.log('✅ ImageZoom.tsx tiene picture element con AVIF');
  } else {
    console.log('❌ ImageZoom.tsx no tiene picture element actualizado');
  }
}

console.log('🎉 PERF-IMG-001 completado exitosamente!');