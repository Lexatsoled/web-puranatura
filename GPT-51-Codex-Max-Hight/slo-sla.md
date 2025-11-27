# SLO / SLA Objetivos

## API (BFF)
- SLI: availability = 1 - error_rate (5xx/4xx no esperados).
- SLO: availability 99.5% mensual; error_rate <0.5% (budget 216 min/mes).
- Latencia: P95 <300ms, P99 <500ms (5m ventanas).
- Throughput: sostenido sin degradar P95.
- SLA (externo, si aplica): 99.0% con créditos; burn-rate alert >2x en 1h.

## Web
- LCP p75 desktop <2.5s, mobile <3s.
- CLS <0.1, INP <200ms.
- A11y: score LHCI ≥90.

## Seguridad
- Vulnerabilidades high/critical = 0 en main.
- Secrets expuestos = 0; tiempo de rotación <24h tras hallazgo.

## Datos/Backups
- RPO 24h, RTO 2h; restore drill trimestral con éxito.

## Observabilidad
- Cobertura de trazas: 100% de rutas instrumentadas; sampling prod 1-5%.
- Métricas exportadas /metrics 99.9% disponibilidad.

## Mantenibilidad
- CC promedio <7; MI verde; cobertura ≥85% (objetivo 90%); mutation score ≥60% en utils/stores.
