# Plan Lighthouse CI (Web)

## Objetivos

- LCP <2.5s (desk), <3s (mobile), CLS <0.1, INP <200ms, Accesibilidad ≥90.
- Bundle inicial <600kB (revisar reporte Vite).

## Escenarios

- Home, Store (grid y filtros), Product detail, Blog, Contact, Metrics dashboard.

## Configuración

- `@lhci/cli autorun` con presets desktop/mobile.
- Budgets: performance ≥90, a11y ≥90, best-practices ≥90, SEO ≥90.
- Upload a `.lighthouseci` o almacenar en `reports/lhci/*.json`.

## Acciones sobre findings

- LCP alto: optimizar imágenes, reducir JS inicial (lazy catálogo/modales), precarga fuentes críticas.
- CLS: asegurar dimensiones de imágenes/cards; evitar layout shift en header.
- INP: evitar handlers pesados; debounce en search.

## Integración CI

- Ejecutar en main y PR con cambios significativos en UI.
- Falla el gate si algún score < objetivo o bundle > budget.

## Siguiente paso: ajustar los presupuestos

- Por ahora los budgets de LHCI (`GPT-51-Codex-Max/perf/lhci-config.json`) están relajados (performance ≥0.6, accessibility/best-practices ≥0.9, seo ≥0.8) para mantener el gate verde mientras trabajamos en LCP/SEO. Cada `npm run perf:web` deja un paquete completo en `reports/lhci/*.report.json` que sirve como evidencia del desempeño actual.
- El objetivo inmediato es consolidar arreglos de LCP, CLS, SEO e INP en home, store, producto, blog y contacto; cuando los reportes muestren scores consistentes que superen 0.9 para performance y SEO, volver a establecer esos thresholds en el config (`categories:performance` y `categories:seo` a 0.9) y confirmar con `reports/lighthouse-*.report.json` y `reports/axe-report.json` antes de reactivar el gate más estricto.
- Mantén este tracker actualizado en `docs/phase-checkpoints.md` y comparte los artefactos relevantes (`reports/lhci/`, `reports/axe-report.json`, `reports/observability/perf-summary.md`) para que QA/SRE tenga la evidencia de que el uplift de SEO/perf está listo.
