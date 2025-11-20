# fix-plan

## Fase 0 – Análisis inicial (1-3 días)

- **AUD-0.1 · Inventario verificable**
  - Objetivo: Congelar `inventory.json` como baseline y ligar `module_id` a owners.
  - Pasos: (1) importar `reports/audit-2025-11-06/inventory.json` en una hoja compartida; (2) asignar responsables por módulo; (3) automatizar `npm run validate:pr` para regenerar inventario.
  - Diff propuesto:
    ```diff
    +"validate:inventory": "node scripts/generateInventory.mjs"
    ```
  - Pruebas: `npm run validate:inventory` en CI.
  - Métrica de éxito: inventario actualizado ≤24h después de cada merge.
  - Riesgos: falsos positivos por archivos generados → ignore patterns.
  - Rollback: restaurar inventario previo desde `reports/`.
- **AUD-0.2 · Lighthouse desbloqueado**
  - Objetivo: eliminar el error `CHROME_INTERSTITIAL_ERROR` para recuperar métricas.
  - Pasos: (1) servir la app con `npm run build && npm run preview`; (2) actualizar `lighthouse-ci.config.mjs` con `--allow-insecure-localhost`; (3) cargar `robots.txt` correcto.
  - Pruebas: `npx lighthouse http://localhost:4173/tienda --preset=desktop`.
  - Métrica: reportes sin `runtimeError`.
  - Riesgos: certificados locales; usar mkcert.
  - Rollback: volver a drivar el reporte previo fallido.

## Fase 1 – Seguridad & Estabilidad (1-2 semanas)

- **SEC-1.1 · Gestión de secretos y DB fuera del repo**
  - Objetivo: retirar `.env` reales y `database.sqlite` del control de versiones.
  - Pasos: (1) agregar reglas en `.gitignore`; (2) mover secretos a GitHub Actions/Render env vars; (3) provisionar SQLite inicial vía script y S3 backup.
  - Diff propuesto: ver `findings.json` `SEC-SECRETS-001`.
  - Pruebas: `git ls-files` no debe listar `.env` ni `.sqlite`.
  - Métrica: `tracked_secrets=0`.
  - Riesgos: despliegues sin variables → documentar `.env.template`.
  - Rollback: restaurar .env local fuera del repo.
- **SEC-1.2 · Checkout sin PII en cliente**
  - Objetivo: mover la creación de pedidos a backend y eliminar persistencia en localStorage.
  - Pasos: (1) crear endpoint Fastify `/api/orders`; (2) reusar `OrderService` con `apiClient`; (3) limpiar storage tras confirmación.
  - Diff propuesto: ver `SEC-CHECKOUT-002`.
  - Pruebas: `npm run test:e2e -- --project checkout` + verificar que `localStorage.getItem('pureza-naturalis-orders') === null` tras compra.
  - Métrica: `local_storage_orders=0`.
  - Riesgos: flujo offline se pierde → mostrar banner "Guardar pedido" en modo desconectado.
  - Rollback: reactivar flag `window.__checkoutOffline = true` para volver al modo client-side.
- **SEC-1.3 · CSRF + rotación de refresh tokens**
  - Objetivo: blindar `/api/auth/*` contra CSRF y secuestro de tokens.
  - Pasos: (1) registrar `@fastify/csrf-protection`; (2) emitir `csrfToken` vía cookie + header; (3) crear tabla `refresh_tokens` con jti y revocación; (4) ajustar front a enviar header.
  - Diff propuesto: ver `SEC-CSRF-003`.
  - Pruebas: `npm run test:e2e -- --project auth`, simulaciones con `csurf-tester`.
  - Métrica: `csrf_block_rate >= 99%` y refresh `jti` único.
  - Riesgos: breaking change para clientes móviles → publicar guía.
  - Rollback: mantener endpoint `/api/auth/refresh` legacy detrás de feature flag `ALLOW_LEGACY_REFRESH`.

## Fase 2 – Rendimiento & UX (1-2 semanas)

- **PERF-2.1 · Pipeline de imágenes y CDN**
  - Objetivo: reducir el payload de `public/Jpeg` de 29.6 MB a <5 MB por visita.
  - Pasos: (1) añadir `vite-imagetools` y `sharp` en build; (2) mover assets a bucket (Cloudflare R2/S3) con caching; (3) ajustar `ImageZoom`/`generateSrcSet` para consumir variantes.
  - Diff propuesto: ver `PERF-ASSETS-007`.
  - Pruebas: `npm run build` + `npm run audit:all` + medir LCP (`web-vitals`).
  - Métrica: `image_payload_mb < 5`, LCP < 2.5 s.
  - Riesgos: rutas rotas en SSR; agregar fallback.
  - Rollback: servir desde `public/optimized` mientras se reindexa CDN.
- **PERF-2.2 · Backend de pedidos y AddressBook reales**
  - Objetivo: exponer `/api/orders` y `/api/addresses` con SQLite/Drizzle.
  - Pasos: (1) agregar tablas `orders`, `addresses`; (2) crear rutas Fastify con validación Zod; (3) conectar `OrderService`/`AddressService` a `apiClient`.
  - Diff propuesto: extender `backend/src/routes` + `src/services/orderService` (ver `FUNC-ORDERS-006`).
  - Pruebas: `npm run test:ci --backend` + nuevos tests Playwright "orden happy path".
  - Métrica: `api_404_rate < 1%` en logs.
  - Riesgos: migraciones en caliente → usar `drizzle-kit push` con backup previo.
  - Rollback: feature flag `ENABLE_SERVER_ORDERS`.

## Fase 3 – Accesibilidad & Compatibilidad (1 semana)

- **A11Y-3.1 · Unificar componentes**
  - Objetivo: eliminar `/components` legacy y forzar imports via `@/`.
  - Pasos: (1) actualizar `tsconfig` paths; (2) ejecutar `rg "../..\/components"` y corregir; (3) borrar carpeta legacy tras QA.
  - Diff propuesto: ver `A11Y-COMP-005`.
  - Pruebas: `npm run test:e2e -- --project a11y` + Storybook visual diff.
  - Métrica: `duplicated_components=0`.
  - Riesgos: paths rotos en builds; usar lint `eslint-plugin-import/no-relative-parent-imports`.
  - Rollback: restaurar copia de `/components/` desde commit previo.
- **A11Y-3.2 · Formularios de checkout robustos**
  - Objetivo: exponer labels, estados y focus visibles para todos los pasos del checkout.
  - Pasos: (1) añadir `aria-live` a banners; (2) reemplazar alert() por `NotificationContainer`; (3) validar campos con `react-hook-form + zod`.
  - Diff propuesto:
    ```diff
    -alert('Por favor selecciona un método de pago');
    +announce('Selecciona un método de pago', true);
    ```
  - Pruebas: `npm run test:e2e -- --project a11y`, `axe-playwright`.
  - Métrica: puntaje >90 en Accessibility.
  - Riesgos: exceso de anuncios; habilitar rate limit en `useLiveRegion`.
  - Rollback: reenviar versión previa del componente.

## Fase 4 – Observabilidad, CI/CD y prevención (1-2 semanas)

- **OBS-4.1 · Redacción de logs y políticas de retención**
  - Objetivo: cumplir privacidad minimizando datos enviados a Sentry y storage local.
  - Pasos: (1) aplicar `scrubPayload` (ver `PRIV-LOGGER-004`); (2) enviar solo IDs/aliases; (3) expurgar localStorage/performance caches >7 días.
  - Pruebas: `npm run test:ci -- logger`, revisar eventos en Sentry.
  - Métrica: `pii_fields_in_logs=0`.
  - Riesgos: pérdida de contexto; añadir `correlationId` no sensible.
  - Rollback: toggle `ENABLE_LOG_SCRUB=false`.
- **OPS-4.2 · Suite de regresión automatizada**
  - Objetivo: orquestar matrices unit/integration/e2e/perf/a11y desde CI.
  - Pasos: (1) crear workflow GitHub `ci.yaml` con jobs paralelos; (2) subir `reports/*.json` como artefactos; (3) integrar `npm run audit:all` en nightly.
  - Diff propuesto:
    ```diff
    +  test-regression:
    +    runs-on: ubuntu-latest
    +    steps:
    +      - uses: actions/checkout@v4
    +      - run: npm ci
    +      - run: npm run test:ci && npm run test:e2e
    ```
  - Pruebas: disparar workflow en PR piloto.
  - Métrica: tiempo medio de feedback <12 min, 0 PR sin pruebas.
  - Riesgos: tiempos largos; habilitar caching pnpm.
  - Rollback: desactivar workflow temporalmente.
