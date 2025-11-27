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
