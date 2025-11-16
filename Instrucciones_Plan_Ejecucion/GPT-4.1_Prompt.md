# Prompt de Ejecución – GPT-4.1

Lee completamente antes de actuar. Tu misión es ejecutar la **Fase 1 – Seguridad y Backend** descrita en `Instrucciones_Plan_Ejecucion/02_GPT-4.1_Seguridad_y_Backend.md`. Sigue el orden y no avances de tarea hasta que la anterior esté validada. Documenta resultados y logs.

## Contexto
- Repositorio: `Pureza-Naturalis-V3`.
- Hallazgos críticos: `/api/test/product/:id` abierto, `/api/admin/analytics/vitals` público, checkout sin backend, endpoint `/system/:systemId` mal validado.
- Dependencias ya instaladas; no tocar `.env`.

## Tareas obligatorias
1. **Blindar/eliminar `/api/test/product/:id`**
   - Ubicación: `backend/src/routes/test.ts`.
   - Objetivo: remover este endpoint en producción o protegerlo con `NODE_ENV === 'development'` + `requireRole('admin')` y usar `productService` en vez de abrir SQLite directamente.
   - Añade prueba `backend/src/routes/__tests__/test-route.spec.ts`.
2. **Proteger `/api/admin/analytics/vitals`**
   - Archivo: `backend/src/routes/analytics.ts`.
   - Añadir `preHandler: [requireRole('admin')]`, rate limit de admin, sanitizar payload (<=10 KB) y limitar buffer `vitalsStore` a 500.
   - Incluir pruebas unitarias verificando 403 sin auth, rechazo de payload grande y trimming del buffer.
3. **Conectar `checkoutStore.processOrder` al backend**
   - Archivo: `src/store/checkoutStore.ts`.
   - Sustituir la simulación local por `OrderService.placeOrder`. Manejar errores (mostrar notificaciones) y guardar `orderId` real.
   - Actualiza pruebas en `src/pages/__tests__/CheckoutPage.test.tsx` y crea/ajusta un escenario Playwright `e2e/checkout.spec.ts`.
4. **Corregir `/api/v1/products/system/:systemId`**
   - Archivo: `backend/src/routes/v1/products.ts`.
   - Elimina la validación de body (sólo query) y añade prueba de regresión.

## Comandos de verificación
```bash
npm run lint
npm run type-check
npm run test:ci
npm run test:e2e -- --grep checkout
cd backend && npm run lint && npm run test:ci
```

## Criterios de éxito
- Pruebas nuevas en verde y logs anexos.
- Ruta `/test/product/:id` inaccesible en producción.
- `/admin/analytics/vitals` protegido (403 sin credenciales).
- Checkout crea órdenes en la base de datos (verifica con logs o consultas).
- Endpoint `/system/:systemId` responde 200 con filtros válidos.

## Entrega
- Actualiza archivos afectados y tests.
- Deja registros (logs de comandos) y notas en la descripción del PR.
- Notifica al coordinador (Codex) cuando completes la fase para habilitar Fase 2.
