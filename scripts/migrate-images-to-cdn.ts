#!/usr/bin/env node
import { readdir, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { cwd } from 'node:process';
import { CDNService } from '../backend/src/services/CDNService.js';
import { cdnConfig } from '../backend/src/config/cdn.js';

const cdnService = new CDNService();
const IMAGES_DIR = join(cwd(), 'public', 'images');

async function collectImageFiles(dir: string, base = dir): Promise<string[]> {
  const dirents = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of dirents) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectImageFiles(fullPath, base)));
      continue;
    }

    if (/\.(?:jpe?g|png|webp|gif|avif)$/i.test(entry.name)) {
      files.push(relative(base, fullPath));
    }
  }

  return files;
}

async function migrateImages() {
  try {
    const stats = await stat(IMAGES_DIR);
    if (!stats.isDirectory()) {
      console.error(`Directorio ${IMAGES_DIR} no encontrado`);
      process.exit(1);
    }
  } catch {
    console.error(`Directorio ${IMAGES_DIR} no encontrado`);
    process.exit(1);
  }

  if (cdnConfig.provider === 'none') {
    console.error('CDN provider is disabled. Configure CDN_PROVIDER before migrating images.');
    process.exit(1);
  }

  const imageFiles = await collectImageFiles(IMAGES_DIR);
  console.log(`🚀 Migrando ${imageFiles.length} imágenes a CDN...\n`);

  for (const file of imageFiles) {
    const localPath = join(IMAGES_DIR, file);
    const remotePath = `images/${file.replace(/\\/g, '/')}`;

    try {
      const cdnUrl = await cdnService.uploadImage(localPath, remotePath);
      console.log(`✅ ${file} → ${cdnUrl}`);
    } catch (error) {
      console.error(`❌ Error subiendo ${file}:`, (error as Error).message);
    }
  }

  console.log('\n🎉 Migración completada');
}

migrateImages();
