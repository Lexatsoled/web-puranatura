// import fs from 'fs'; // Not used in this script
import fsp from 'fs/promises';
import path from 'path';

async function ensureDir(dir: string) {
  await fsp.mkdir(dir, { recursive: true });
}

async function* walk(dir: string): AsyncGenerator<string> {
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(full);
    else yield full;
  }
}

async function optimizeImages() {
  const publicDir = path.join(process.cwd(), 'public');
  const inputDir = path.join(publicDir, 'Jpeg');
  const outputDir = path.join(publicDir, 'optimized');

  try {
    console.log('Iniciando optimización de imágenes...');
    console.log(`Entrada: ${inputDir}`);
    console.log(`Salida:  ${outputDir}`);

    await ensureDir(outputDir);

    // Importación dinámica de sharp para evitar fallos si no está disponible en runtime
    const sharp = (await import('sharp')).default;

    const exts = new Set(['.jpg', '.jpeg', '.png']);
    const sizes = [320, 640, 768, 1024];
    let processed = 0;

    for await (const file of walk(inputDir)) {
      const ext = path.extname(file).toLowerCase();
      if (!exts.has(ext)) continue;
      const rel = path.relative(inputDir, file);
      const base = rel.replace(ext, '');
      const destBaseDir = path.join(outputDir, path.dirname(rel));
      await ensureDir(destBaseDir);

      const buf = await fsp.readFile(file);
      const img = sharp(buf);
      const meta = await img.metadata();

      for (const width of sizes) {
        if (meta.width && meta.width < width) continue; // no upscale
        const outPath = path.join(destBaseDir, `${base}_${width}.webp`);
        await img.resize({ width }).webp({ quality: 82 }).toFile(outPath);
      }

      // Full-size webp fallback
      const outFull = path.join(destBaseDir, `${base}.webp`);
      await img.webp({ quality: 82 }).toFile(outFull);
      processed++;
    }

    console.log(`Optimización completada. Archivos procesados: ${processed}`);
  } catch (error) {
    console.error('Error durante la optimización de imágenes:', error);
    process.exit(1);
  }
}

optimizeImages();
