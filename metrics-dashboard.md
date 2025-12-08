# Dashboard de Métricas y Objetivos (Q1 2025)

| Categoría       | Métrica                         | Baseline (Est.) | Objetivo | Verificación        |
| --------------- | ------------------------------- | --------------- | -------- | ------------------- |
| **Performance** | LCP (Largest Contentful Paint)  | 3.2s            | < 2.5s   | Lighthouse CI       |
| **Performance** | CLS (Cumulative Layout Shift)   | 0.15            | < 0.1    | Lighthouse CI       |
| **Seguridad**   | Vulnerabilidades Altas/Críticas | ?               | 0        | `npm audit` / Trivy |
| **Seguridad**   | CSP Compatibility               | 95%             | 100%     | Reports Endpoint    |
| **Calidad**     | Cobertura de Tests (Backend)    | ?               | > 80%    | Vitest Coverage     |
| **Calidad**     | Complejidad Ciclomática Max     | 25              | < 15     | `complexity-report` |
| **Privacidad**  | Datos PII en Logs               | Posible         | 0        | Auditoría Manual    |
| **API**         | Latencia P95                    | ~500ms          | < 300ms  | k6 Tests            |

## Definición de Baseline

- **LCP**: Medido en conexión 4G Slow simulada.
- **Seguridad**: Escaneo estático actual.

## Estrategia de Medición

1.  **CI/CD**: Ejecutar `npm run perf:web` en cada PR.
2.  **Monitorización**: Revisar logs de backend para errores 5xx (objetivo < 0.5%).
