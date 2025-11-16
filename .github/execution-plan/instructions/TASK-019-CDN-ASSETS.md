# TASK-019: CDN para Assets Estáticos

## 📋 INFORMACIÓN

**ID**: TASK-019 | **Fase**: 2 | **Prioridad**: MEDIA | **Estimación**: 3h

## 🎯 OBJETIVO

Integrar CDN (Cloudflare/BunnyCDN) para servir imágenes y assets estáticos, reducir latencia y carga del servidor.

## 🛠️ IMPLEMENTACIÓN

### Paso 1: Configuración CDN

**Archivo**: `backend/src/config/cdn.ts`

```typescript
export const cdnConfig = {
  provider: process.env.CDN_PROVIDER || 'cloudflare', // cloudflare | bunnycdn | none
  baseUrl: process.env.CDN_BASE_URL || '',
  
  cloudflare: {
    accountId: process.env.CF_ACCOUNT_ID,
    apiToken: process.env.CF_API_TOKEN,
    zoneId: process.env.CF_ZONE_ID,
  },
  
  bunnycdn: {
    storageZoneName: process.env.BUNNY_STORAGE_ZONE,
    apiKey: process.env.BUNNY_API_KEY,
    pullZoneUrl: process.env.BUNNY_PULL_ZONE_URL,
  },
};
```

### Paso 2: CDN Service

**Archivo**: `backend/src/services/CDNService.ts`

```typescript
import axios from 'axios';
import { createReadStream } from 'fs';
import { cdnConfig } from '../config/cdn.js';

export class CDNService {
  /**
   * Upload file to BunnyCDN
   */
  async uploadToBunnyCDN(filePath: string, remotePath: string): Promise<string> {
    const { storageZoneName, apiKey, pullZoneUrl } = cdnConfig.bunnycdn;
    
    const url = `https://storage.bunnycdn.com/${storageZoneName}/${remotePath}`;
    
    const fileStream = createReadStream(filePath);
    
    await axios.put(url, fileStream, {
      headers: {
        'AccessKey': apiKey!,
        'Content-Type': 'application/octet-stream',
      },
    });

    return `${pullZoneUrl}/${remotePath}`;
  }

  /**
   * Upload to Cloudflare Images
   */
  async uploadToCloudflare(filePath: string, id: string): Promise<string> {
    const { accountId, apiToken } = cdnConfig.cloudflare;
    
    const formData = new FormData();
    formData.append('file', createReadStream(filePath) as any);
    formData.append('id', id);

    const response = await axios.post(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${apiToken}`,
        },
      }
    );

    return response.data.result.variants[0]; // URL de la imagen
  }

  /**
   * Purge CDN cache
   */
  async purgeCache(urls: string[]): Promise<void> {
    if (cdnConfig.provider === 'cloudflare') {
      await this.purgeCloudflareCache(urls);
    } else if (cdnConfig.provider === 'bunnycdn') {
      await this.purgeBunnyCDNCache(urls);
    }
  }

  private async purgeCloudflareCache(urls: string[]): Promise<void> {
    const { zoneId, apiToken } = cdnConfig.cloudflare;
    
    await axios.post(
      `https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`,
      { files: urls },
      {
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
  }

  private async purgeBunnyCDNCache(urls: string[]): Promise<void> {
    const { apiKey } = cdnConfig.bunnycdn;
    
    for (const url of urls) {
      await axios.post(
        `https://api.bunny.net/purge`,
        { url },
        {
          headers: {
            'AccessKey': apiKey!,
            'Content-Type': 'application/json',
          },
        }
      );
    }
  }

  /**
   * Get CDN URL for asset
   */
  getCDNUrl(path: string): string {
    if (!cdnConfig.baseUrl) {
      return path; // Fallback local
    }
    
    return `${cdnConfig.baseUrl}/${path.replace(/^\//, '')}`;
  }
}
```

### Paso 3: Upload API Endpoint

**Archivo**: `backend/src/routes/upload.ts`

```typescript
import { FastifyPluginAsync } from 'fastify';
import { CDNService } from '../services/CDNService.js';
import { writeFile, unlink } from 'fs/promises';
import { randomUUID } from 'crypto';

export const uploadRoutes: FastifyPluginAsync = async (fastify) => {
  const cdnService = new CDNService();

  fastify.post('/api/upload/image', {
    preHandler: [fastify.authenticate, fastify.authorizeAdmin],
  }, async (request, reply) => {
    const data = await request.file();
    
    if (!data) {
      return reply.code(400).send({ error: 'No file uploaded' });
    }

    // Validar tipo
    if (!data.mimetype.startsWith('image/')) {
      return reply.code(400).send({ error: 'Only images allowed' });
    }

    // Guardar temporalmente
    const tempPath = `/tmp/${randomUUID()}-${data.filename}`;
    await writeFile(tempPath, await data.toBuffer());

    try {
      // Upload a CDN
      const cdnUrl = await cdnService.uploadToBunnyCDN(
        tempPath,
        `products/${randomUUID()}-${data.filename}`
      );

      return { url: cdnUrl };
    } finally {
      // Limpiar archivo temporal
      await unlink(tempPath);
    }
  });
};
```

### Paso 4: Reescribir URLs en Frontend

**Archivo**: `frontend/src/utils/cdnUtils.ts`

```typescript
const CDN_BASE_URL = import.meta.env.VITE_CDN_BASE_URL || '';

export function getCDNUrl(path: string): string {
  if (!path) return '';
  
  // Si ya es URL absoluta, retornar tal cual
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Si no hay CDN configurado, usar path local
  if (!CDN_BASE_URL) {
    return path;
  }
  
  // Construir URL de CDN
  return `${CDN_BASE_URL}/${path.replace(/^\//, '')}`;
}

/**
 * Generar srcset para responsive images
 */
export function generateSrcSet(path: string, widths: number[] = [320, 640, 960, 1280]): string {
  return widths
    .map(width => `${getCDNUrl(path)}?width=${width} ${width}w`)
    .join(', ');
}
```

### Paso 5: Componente de Imagen Optimizada

**Archivo**: `frontend/src/components/OptimizedImage.tsx`

```typescript
import { getCDNUrl, generateSrcSet } from '../utils/cdnUtils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export function OptimizedImage({ 
  src, 
  alt, 
  width, 
  height, 
  className, 
  loading = 'lazy' 
}: OptimizedImageProps) {
  const cdnUrl = getCDNUrl(src);
  const srcSet = generateSrcSet(src);

  return (
    <img
      src={cdnUrl}
      srcSet={srcSet}
      sizes="(max-width: 640px) 320px, (max-width: 960px) 640px, 960px"
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={loading}
      decoding="async"
    />
  );
}
```

### Paso 6: Script de Migración de Imágenes

**Archivo**: `scripts/migrate-images-to-cdn.ts`

```typescript
#!/usr/bin/env node
import { readdir } from 'fs/promises';
import { join } from 'path';
import { CDNService } from '../backend/src/services/CDNService.js';

const cdnService = new CDNService();
const IMAGES_DIR = './frontend/public/images';

async function migrateImages() {
  const files = await readdir(IMAGES_DIR, { recursive: true });
  const imageFiles = files.filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f));

  console.log(`📦 Migrando ${imageFiles.length} imágenes a CDN...\n`);

  for (const file of imageFiles) {
    const localPath = join(IMAGES_DIR, file);
    const remotePath = `products/${file}`;

    try {
      const cdnUrl = await cdnService.uploadToBunnyCDN(localPath, remotePath);
      console.log(`✅ ${file} → ${cdnUrl}`);
    } catch (error) {
      console.error(`❌ Error uploading ${file}:`, error);
    }
  }

  console.log('\n✅ Migración completada');
}

migrateImages();
```

### Paso 7: Variables de Entorno

**Archivo**: `.env.example`

```bash
# CDN Configuration
CDN_PROVIDER=bunnycdn  # cloudflare | bunnycdn | none
CDN_BASE_URL=https://cdn.purezanaturalis.com

# BunnyCDN
BUNNY_STORAGE_ZONE=purezanaturalis
BUNNY_API_KEY=your_api_key_here
BUNNY_PULL_ZONE_URL=https://purezanaturalis.b-cdn.net

# Cloudflare
CF_ACCOUNT_ID=your_account_id
CF_API_TOKEN=your_api_token
CF_ZONE_ID=your_zone_id
```

**Archivo**: `frontend/.env.example`

```bash
VITE_CDN_BASE_URL=https://purezanaturalis.b-cdn.net
```

## ✅ CRITERIOS DE ACEPTACIÓN

- [x] Integración BunnyCDN o Cloudflare
- [x] Upload API funcional
- [x] Purge cache automático
- [x] Reescritura URLs en frontend
- [x] Responsive images con srcset
- [x] Script migración imágenes
- [x] Fallback a assets locales

## 🧪 VALIDACIÓN

```bash
# Test upload
curl -X POST http://localhost:3000/api/upload/image \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@test-image.jpg"

# Migrar imágenes
tsx scripts/migrate-images-to-cdn.ts

# Purge cache
curl -X POST http://localhost:3000/api/admin/cdn/purge \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"urls": ["https://cdn.example.com/image.jpg"]}'
```

---

**Status**: COMPLETO ✅
