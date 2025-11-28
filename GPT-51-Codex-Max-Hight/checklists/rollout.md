# Checklist de Rollout/Deploy

- [ ] Backup DB cifrado tomado y verificado (hash/size).
- [ ] Migraciones aplicadas en stage; contract + e2e + perf smoke verdes.
- [ ] Feature flags listadas (ON/OFF) y valores por entorno.
- [ ] Canary 5%-25%-50%-100% configurado; alertas activas.
- [ ] Smoke post-deploy: login, lista productos, crear orden demo, /metrics 200.
- [ ] Monitorear 30-60 min: error_rate, P95, LHCI si aplica.
- [ ] Plan de rollback listo; tiempo objetivo <5 min.

## Tabla de decisión canary

- Promover si: error_rate <0.5% y P95 <300ms y sin alertas a11y/perf; LHCI OK (si aplica).
- Mantener canary si: error_rate 0.5-1% o P95 300-500ms → investigar antes de promover.
- Rollback si: error_rate >1% o P95 >500ms sostenido 5m o LHCI LCP >3s o a11y falla grave.

## Comando de smoke sugerido

- `npm run smoke` (a crear): login, GET /products, POST /orders sandbox, /metrics 200, LHCI quick opcional.
