# TASK-020: Compresión HTTP y Optimización de Respuestas

## 📋 INFORMACIÓN

**ID**: TASK-020 | **Fase**: 2 | **Prioridad**: MEDIA | **Estimación**: 2h

## 🎯 OBJETIVO

Implementar compresión Brotli/Gzip, optimizar imágenes y reducir tamaño de respuestas.

## 🛠️ IMPLEMENTACIÓN

### Paso 1: Instalar Dependencias

```bash
npm install --save @fastify/compress sharp
npm install --save-dev @types/sharp
```

### Paso 2: Plugin de Compresión

**Archivo**: `backend/src/plugins/compression.ts`

```typescript
import { FastifyPluginAsync } from 'fastify';
import compress from '@fastify/compress';

export const compressionPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(compress, {
    global: true,
    threshold: 1024, // Comprimir solo > 1KB
    encodings: ['br', 'gzip', 'deflate'], // Brotli primero
    brotliOptions: {
      params: {
        [require('zlib').constants.BROTLI_PARAM_QUALITY]: 4, // Balance speed/ratio
      },
    },
    zlibOptions: {
      level: 6, // Gzip level 6
    },
    customTypes: /^text\/|application\/(json|javascript|xml)|image\/svg\+xml/,
  });

  fastify.log.info('Compression enabled (Brotli, Gzip, Deflate)');
};
```

### Paso 3: Servicio de Optimización de Imágenes

**Archivo**: `backend/src/services/ImageOptimizer.ts`

```typescript
import sharp from 'sharp';
import { readFile, writeFile } from 'fs/promises';

interface OptimizeOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp' | 'avif';
}

export class ImageOptimizer {
  /**
   * Optimizar imagen
   */
  async optimize(inputPath: string, outputPath: string, options: OptimizeOptions = {}) {
    const {
      width,
      height,
      quality = 80,
      format = 'webp',
    } = options;

    let pipeline = sharp(inputPath);

    // Resize si es necesario
    if (width || height) {
      pipeline = pipeline.resize(width, height, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    // Convertir a formato optimizado
    switch (format) {
      case 'webp':
        pipeline = pipeline.webp({ quality });
        break;
      case 'avif':
        pipeline = pipeline.avif({ quality });
        break;
      case 'jpeg':
        pipeline = pipeline.jpeg({ quality, mozjpeg: true });
        break;
      case 'png':
        pipeline = pipeline.png({ compressionLevel: 9 });
        break;
    }

    await pipeline.toFile(outputPath);
  }

  /**
   * Generar múltiples variantes
   */
  async generateVariants(inputPath: string, basePath: string) {
    const variants = [
      { suffix: '-sm', width: 320, quality: 75 },
      { suffix: '-md', width: 640, quality: 80 },
      { suffix: '-lg', width: 960, quality: 80 },
      { suffix: '-xl', width: 1280, quality: 85 },
    ];

    const results = [];

    for (const variant of variants) {
      const outputPath = basePath.replace(/(\.\w+)$/, `${variant.suffix}.webp`);
      
      await this.optimize(inputPath, outputPath, {
        width: variant.width,
        quality: variant.quality,
        format: 'webp',
      });

      results.push({
        size: variant.suffix,
        path: outputPath,
        width: variant.width,
      });
    }

    return results;
  }

  /**
   * Obtener metadata de imagen
   */
  async getMetadata(inputPath: string) {
    const metadata = await sharp(inputPath).metadata();
    
    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: metadata.size,
      hasAlpha: metadata.hasAlpha,
    };
  }
}
```

### Paso 4: Endpoint de Optimización

**Archivo**: `backend/src/routes/optimize.ts`

```typescript
import { FastifyPluginAsync } from 'fastify';
import { ImageOptimizer } from '../services/ImageOptimizer.js';
import { writeFile, unlink } from 'fs/promises';
import { randomUUID } from 'crypto';

export const optimizeRoutes: FastifyPluginAsync = async (fastify) => {
  const optimizer = new ImageOptimizer();

  fastify.post('/api/optimize/image', {
    preHandler: [fastify.authenticate, fastify.authorizeAdmin],
  }, async (request, reply) => {
    const data = await request.file();
    
    if (!data || !data.mimetype.startsWith('image/')) {
      return reply.code(400).send({ error: 'Invalid image file' });
    }

    const tempPath = `/tmp/${randomUUID()}-original.${data.filename.split('.').pop()}`;
    await writeFile(tempPath, await data.toBuffer());

    try {
      // Generar variantes optimizadas
      const outputBase = `/tmp/${randomUUID()}`;
      const variants = await optimizer.generateVariants(tempPath, outputBase);

      return {
        original: await optimizer.getMetadata(tempPath),
        variants,
      };
    } finally {
      await unlink(tempPath);
    }
  });
};
```

### Paso 5: Middleware de Response Size Monitoring

**Archivo**: `backend/src/plugins/responseMonitor.ts`

```typescript
import { FastifyPluginAsync } from 'fastify';

export const responseMonitorPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onSend', async (request, reply, payload) => {
    // Calcular tamaño de respuesta
    const size = Buffer.byteLength(JSON.stringify(payload));
    
    // Warning si respuesta > 1MB
    if (size > 1024 * 1024) {
      fastify.log.warn({
        url: request.url,
        method: request.method,
        size: `${(size / 1024 / 1024).toFixed(2)} MB`,
      }, 'Large response detected');
    }

    // Agregar header con tamaño
    reply.header('X-Response-Size', size.toString());
    
    return payload;
  });
};
```

### Paso 6: Script de Optimización Batch

**Archivo**: `scripts/optimize-images.ts`

```typescript
#!/usr/bin/env node
import { readdir, stat } from 'fs/promises';
import { join } from 'path';
import { ImageOptimizer } from '../backend/src/services/ImageOptimizer.js';

const optimizer = new ImageOptimizer();
const IMAGES_DIR = './frontend/public/images';

async function optimizeAllImages() {
  const files = await readdir(IMAGES_DIR, { recursive: true });
  const imageFiles = files.filter(f => /\.(jpg|jpeg|png)$/i.test(f));

  console.log(`🖼️  Optimizando ${imageFiles.length} imágenes...\n`);

  let totalOriginal = 0;
  let totalOptimized = 0;

  for (const file of imageFiles) {
    const inputPath = join(IMAGES_DIR, file);
    const outputPath = inputPath.replace(/\.(jpg|jpeg|png)$/i, '.webp');

    try {
      const originalStats = await stat(inputPath);
      totalOriginal += originalStats.size;

      await optimizer.optimize(inputPath, outputPath, {
        quality: 80,
        format: 'webp',
      });

      const optimizedStats = await stat(outputPath);
      totalOptimized += optimizedStats.size;

      const reduction = ((1 - optimizedStats.size / originalStats.size) * 100).toFixed(1);
      console.log(`✅ ${file}: ${(originalStats.size / 1024).toFixed(1)}KB → ${(optimizedStats.size / 1024).toFixed(1)}KB (-${reduction}%)`);
    } catch (error) {
      console.error(`❌ Error optimizing ${file}:`, error);
    }
  }

  const totalReduction = ((1 - totalOptimized / totalOriginal) * 100).toFixed(1);
  console.log(`\n📊 Total: ${(totalOriginal / 1024 / 1024).toFixed(2)}MB → ${(totalOptimized / 1024 / 1024).toFixed(2)}MB (-${totalReduction}%)`);
}

optimizeAllImages();
```

### Paso 7: Configuración Vite para Assets

**Archivo**: `frontend/vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { compression } from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    // Brotli compression para build
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024,
    }),
    // Gzip compression para build
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          utils: ['date-fns', 'zustand'],
        },
      },
    },
    // Comprimir assets
    assetsInlineLimit: 4096, // Inline < 4KB
    chunkSizeWarningLimit: 500, // Warning > 500KB
  },
});
```

### Paso 8: Test de Compresión

**Archivo**: `backend/src/__tests__/compression.test.ts`

```typescript
import { test } from 'tap';
import { build } from '../app.js';

test('Compression plugin', async (t) => {
  const app = await build();

  t.test('should compress large responses', async (t) => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/products',
      headers: {
        'Accept-Encoding': 'br, gzip',
      },
    });

    t.equal(response.statusCode, 200);
    t.ok(response.headers['content-encoding'], 'Has compression header');
    t.ok(['br', 'gzip'].includes(response.headers['content-encoding'] as string));
  });

  t.test('should not compress small responses', async (t) => {
    const response = await app.inject({
      method: 'GET',
      url: '/health',
      headers: {
        'Accept-Encoding': 'br, gzip',
      },
    });

    t.equal(response.statusCode, 200);
    t.notOk(response.headers['content-encoding'], 'No compression for small responses');
  });

  await app.close();
});
```

## ✅ CRITERIOS DE ACEPTACIÓN

- [x] Brotli + Gzip habilitados
- [x] Threshold > 1KB
- [x] Optimización de imágenes (WebP/AVIF)
- [x] Generación de variantes responsive
- [x] Monitoring de response size
- [x] Build assets comprimidos
- [x] Tests de compresión

## 🧪 VALIDACIÓN

```bash
# Test compresión
curl -H "Accept-Encoding: br" http://localhost:3000/api/products -I

# Optimizar imágenes
tsx scripts/optimize-images.ts

# Build con compresión
npm run build

# Verificar archivos .br y .gz
ls -lh dist/assets/*.{br,gz}
```

---

**Status**: COMPLETO ✅
