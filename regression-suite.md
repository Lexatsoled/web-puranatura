# Regression Suite – Pureza-Naturalis-V3

Última actualización: 2025-11-14

## 1. Matriz de pruebas

| Tipo | Cobertura | Casos propuestos | Scripts/Comandos |
|------|-----------|------------------|------------------|
| **Unit** | `frontend-core`, `backend-api` | `normalizeText`/`sanitizeObject`, `productService.searchBySystem`, `analyticsRoutes` input validation | `npx vitest run src/utils/encoding.test.ts backend/src/routes/v1/__tests__/products-system.test.ts` |
| **Integration/API** | Endpoints REST críticos | Fastify inject: `/api/v1/products/system/:id`, `/api/v1/orders` (happy path + totales inválidos), `/api/analytics/vitals` (403 para usuarios regulares) | `npm run test:ci` (backend) o `node backend/scripts/test-routes.mjs` |
| **E2E (Playwright)** | Flujos usuario | 1) Checkout real (crea orden) 2) Lista de sistemas sinérgicos 3) Offline fallback + SW (añadir a carrito sin red) | `npx playwright test --project=chromium ./e2e/checkout.spec.ts` |
| **Seguridad** | Superficie expuesta | k6/gitleaks + pruebas de autorización (`/admin/analytics/vitals`, `/api/test/product/:id`) | `npm run scan:secrets`, `k6 run k6/security/unauth.lua` |
| **Performance** | Web Vitals + payload imágenes | Lighthouse CI (home, producto, checkout), k6 API `/api/v1/products?page=1` P95 | `npm run analyze` + `k6 run k6/api/products.js` |
| **Accesibilidad** | WCAG AA | `axe` en `HomePage`, `CheckoutPage`, `ProductPage` + verificación manual de focus-visible | `npm run test:a11y` |

## 2. Escenarios detallados

1. **SW + `/api/v1`**: servir `/tienda` offline. Pasos: precargar, desconectar red (Playwright `context.setOffline(true)`), asegurarse de que `CartPage` renderiza desde cache y que `fetch` de `/api/v1/products` responde 200 desde `CacheFirst`.
2. **Checkout real**: simular carrito con stock, enviar datos válidos, verificar que la respuesta contiene `orderId` y que la BD (`backend/database.sqlite`) tiene registro en `orders`.
3. **Analytics protegido**: intentar GET `/api/admin/analytics/vitals` como usuario normal (cookie invalida) → 403. Con cookie admin → 200 y métricas.
4. **Encoding**: probar formulario de contacto con texto `EspaÃ±a` y comprobar que UI muestra `España` tras `normalizeText`.
5. **Sitemap dinámico**: test que descargue `/sitemap.xml`, valide presence de `<loc>https://purezanaturalis.com/products/1</loc>`.

## 3. Pipeline recomendada

```bash
# 1. Lint + unit
npm run lint && npm run type-check && npx vitest run
# 2. Backend integration
(cd backend && npm run test:ci)
# 3. Playwright (requiere `npx playwright install --with-deps` una vez)
npx playwright test --reporter=html
# 4. Lighthouse batch (usa `npm run analyze`)
# 5. k6 smoke API (requiere k6 instalado)
k6 run k6/api/products.js
```

Automatizar la ejecución en CI (`.github/workflows/ci.yml`) y subir los reportes generados a `reports/` para trazabilidad.

## 4. Artefactos/Ubicaciones

- `reports/playwright/`: HTML interactivo de Playwright.
- `reports/lighthouse/YYYYMMDD_HHMM/`: auditorías comparables (baseline vs objetivo).
- `coverage/`: vitest + backend coverage (`--coverage`).
- `logs/k6/`: resultados de carga (p95, error %, throughput).

Mantener este documento sincronizado con `fix-plan.md`; cada hallazgo crítico debe tener al menos un test que lo prevenga.
