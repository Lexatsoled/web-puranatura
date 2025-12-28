# Runbook: Hotfix de Performance
1) Confirmar síntoma: P95>budget o LCP>budget; capturar rango temporal.
2) Identificar tipo: API (latencia/error) o Web (LCP/CLS/INP).
3) Acciones rápidas:
   - API: habilitar cache headers/ETag; elevar replicas (si aplica); reducir timeout cliente; activar rate-limit más estricto.
   - Web: desactivar features vía flag (analytics, animaciones pesadas); servir assets optimizados; limpiar CDN si hay.
4) Medir: k6 smoke (API) o LHCI quick (web); revisar prom-client histogram.
5) Si no mejora: rollback a release previa.
6) Post-hotfix: crear issue raíz (bundle size, N+1, imágenes sin optimizar) y planear refactor.
