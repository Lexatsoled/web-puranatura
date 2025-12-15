# Tareas - Web Puranatura

## Fase 0 & 1 [COMPLETADO]

- [x] Generar Inventario (`inventory.json`).
- [x] Mapear Arquitectura (`architecture-map.md`).
- [x] Hardening Auth: Hashing de Refresh Tokens.
- [x] Hardening Rate Limit: RedisStore global.
- [x] Corregir vulnerabilidades npm.

## Fase 2: Rendimiento y UX (Semana 2) [COMPLETADO]

### Optimización de Imágenes (LCP)

- [x] **BlogPostModal**: Cambiar imagen principal a `eager` loading. <!-- id: 0 -->
- [x] **ProductCard**: Verificar carga de imágenes en listados (LCP candidate). <!-- id: 1 -->
- [x] **Hero Section**: Verificar LCP en Home Page. <!-- id: 2 -->

### Caching de Backend (Redis)

- [x] **Helper Cache**: Crear utilidad para cache-aside pattern. <!-- id: 3 -->
- [x] **Route Products**: Implementar caché en `GET /api/products`. <!-- id: 4 -->
- [x] **Route Categories**: Implementar caché en `GET /api/categories` (si existe). <!-- id: 5 -->

### Bundle Optimization

- [x] **Analyze Build**: Ejecutar build y revisar tamaños de chunks. <!-- id: 6 -->
- [x] **Split Chunks**: Refinar `manualChunks` en Vite si hay vendors gigantes. <!-- id: 7 -->

## Fase 3: Accesibilidad

- [x] **Focus Trap**: Implementar trampas de foco en `BlogPostModal` y otros modales. <!-- id: 8 -->
- [x] **Skip Link**: Agregar enlace "Saltar al contenido" en `App.tsx`. <!-- id: 9 -->
- [x] **Aria Labels**: Revisar botones sin etiqueta textual (icon-only buttons). <!-- id: 10 -->

## Fase 4: Pruebas de Regresión CI/CD

- [x] **Config**: Verificar `scripts/run-regression.cjs`. <!-- id: 11 -->
- [x] **Lint & Types**: Ejecutar y corregir comprobaciones estáticas. <!-- id: 12 -->
- [x] **Tests**: Ejecutar tests unitarios (vitest) y E2E (si aplica). <!-- id: 13 -->
- [x] **Security**: Ejecutar `npm audit` y verificaciones de seguridad. <!-- id: 14 -->
