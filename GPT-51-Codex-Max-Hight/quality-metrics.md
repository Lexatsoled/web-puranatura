# Métricas de Calidad y Aceptación

- Complejidad: CC función <10 (alerta >7), cognitive <15; reducir hot spots >12.
- Maintainability Index: objetivo verde (≥80); monitorear por módulo.
- Cobertura: global ≥85%, crítico (auth/orders/products) 100% branches; mutation score (utils/stores) ≥60%.
- Duplication: <5% en reporte estático.
- Lint: 0 errores; advertencias corregidas antes de merge.
- Bundle: inicial <600kB; diffs de bundle revisados en PR de UI.
- Performance: LCP/CLS/INP dentro de presupuestos; k6 P95 <300ms.
- Seguridad: audit high=0; gitleaks=0; trivy críticos=0; licencias permitidas 100%.
- Contratos: OpenAPI drift=0; test:contract verde en PR.
