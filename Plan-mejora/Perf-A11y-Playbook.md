# Playbook: Performance y Accesibilidad (sin SaaS)

Objetivo: fijar presupuestos de rendimiento y garantías de accesibilidad usando herramientas locales (LHCI, axe/playwright, k6).

## Presupuestos y objetivos

- Bundle inicial JS: < 200KB gzip.
- LCP móvil: < 2.5s; CLS < 0.1.
- API /products p95: < 300ms (sano).
- A11y: score ≥ 90 (axe/LHCI); navegación completa por teclado.

## Herramientas (ya en repo o locales)

- LHCI (`npm run perf:web`) contra build local.
- axe/playwright (`npm run a11y`).
- k6 smoke (`npm run perf:api` o `node scripts/run-k6.cjs`).
- Vitest para pruebas negativas y componentes.

## Flujos recomendados

1. **Rendimiento web (LHCI local)**
   - `npm run build && npm run perf:web`
   - Guardar reportes en `reports/` (no versionar si son pesados).
   - Revisar budgets: si falla, identificar entradas grandes en `dist/` y aplicar splitting/lazy.
2. **A11y (axe/playwright)**
   - `npm run a11y`
   - Asegurar foco visible global, manejo de Enter/Space en ProductCard, labels en inputs, `prefers-reduced-motion`.
3. **API smoke (k6)**
   - `npm run build && node scripts/run-k6.cjs GPT-51-Codex-Max/perf/k6-api-smoke.js`
   - Validar p95 y error rate < 1%.
4. **Pruebas negativas**
   - Ejecutar vitest para 401/403/429 y sanitización JSON-LD.

## Qué medir y registrar

- LHCI: LCP, CLS, TTI, tamaño JS/CSS; fallos de audits de a11y.
- k6: p95, error rate, http_req_failed.
- A11y: elementos sin foco, roles faltantes, contrastes.

## Acciones típicas de mejora

- Performance:
  - Code splitting y lazy de modales/graficas.
  - Evitar libs pesadas en el path crítico.
  - Cache-control en assets locales y `loading="lazy"` en imágenes.
- A11y:
  - Convertir contenedores clicables en botones/links.
  - Añadir `aria-label`/`aria-describedby` en inputs; foco visible CSS.
  - Respetar `prefers-reduced-motion`.

## Criterio de aceptación por fase

- Fase 3 (UX/A11y):
  - A11y ≥ 90, sin bloqueos de teclado.
  - Bundle < 200KB gzip.
  - LCP objetivo alcanzado en LHCI local.
- Fase 4 (CI/CD):
  - Scripts anteriores corren en CI gates con thresholds definidos; PR no pasa si se violan budgets críticos.

## Rollback / ajustes

- Si LHCI falla por falso positivo local (ruido): repetir 2–3 runs y usar median.
- Si animaciones afectan a usuarios sensibles: bajar duración o deshabilitar con `prefers-reduced-motion`.
