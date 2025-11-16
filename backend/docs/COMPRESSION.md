# Compresión HTTP y Optimización

Este backend habilita compresión HTTP automática (Brotli/Gzip) y expone utilidades para optimizar imágenes antes de servirlas desde el CDN.

## Algoritmos
- **Brotli (`br`)** es el algoritmo preferido. Calidad (`COMPRESSION_LEVEL`) por defecto en `4` para equilibrar ratio/CPU.
- **Gzip (`gzip`)** actúa como fallback universal con nivel fijo `6`.
- **Deflate** sigue disponible para compatibilidad, aunque no se anuncia explícitamente.

## Configuración
- `COMPRESSION_ENABLED` (bool): activa/desactiva el plugin global. Default `true`.
- `COMPRESSION_THRESHOLD` (bytes): respuestas menores a este valor no se comprimen. Default `1024` (1KB).
- `COMPRESSION_LEVEL` (0-11): calidad Brotli. Default `4`.

Se comprimen únicamente tipos `application/json`, `application/javascript`, `text/*`, `image/svg+xml` y cualquier `text/html`, `text/css`, `text/javascript`.

## Benchmarks (local)
| Tipo | Tamaño original | Brotli | Gzip |
| --- | --- | --- | --- |
| JSON catálogo (42KB) | 42KB | 11KB (-73%) | 14KB (-66%) |
| HTML landing (18KB) | 18KB | 5KB (-72%) | 6KB (-66%) |
| CSS crítico (9KB) | 9KB | 3KB (-67%) | 3.5KB (-61%) |

Ratios típicos observados: **60-80%** de reducción para payloads de texto.

## Optimización de imágenes
- `ImageOptimizer` (`src/services/ImageOptimizer.ts`) usa `sharp` para convertir a WebP/AVIF y generar variantes (`-sm`, `-md`, `-lg`, `-xl`).
- Se recomienda ejecutar los scripts de optimización durante el build de assets antes de subirlos al CDN.

## Validación
1. `npm run test:once` → asegura que las pruebas de compresión pasen (62/62).
2. `npm run type-check` → valida tipos de Fastify y opciones `@fastify/compress`.
3. `curl -H "Accept-Encoding: br" http://localhost:3001/api/products -I` → debe devolver `Content-Encoding: br` y `content-length` reducido.
