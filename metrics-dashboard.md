# Dashboard de Métricas - Web Puranatura

## Baseline y Objetivos (Q4 2025)

| Métrica | Categoría | Baseline (Est.) | Target | Estado |
| :--- | :--- | :--- | :--- | :--- |
| **LCP (Largest Contentful Paint)** | Performance | 1.8s | < 2.5s | 🟢 |
| **CLS (Cumulative Layout Shift)** | Performance | 0.05 | < 0.1 | 🟢 |
| **TTFB (Time to First Byte)** | Performance | 150ms | < 200ms | 🟢 |
| **Bundle Size (Vendor)** | Performance | ~400KB | < 500KB | 🟡 |
| **Accesibilidad (Lighthouse)** | Calidad | 92 | 100 | 🟢 |
| **Cobertura de Tests** | Calidad | ~40% | > 80% | 🔴 |
| **Vulnerabilidades Crit/High** | Seguridad | 0 | 0 | 🟢 |
| **API Error Rate** | Estabilidad | < 1% | < 0.5% | 🟢 |

## Plan de Monitorización

### CI/CD Checks
- [ ] **Lighthouse CI**: Ejecutar en cada PR a `main`.
- [ ] **Bundle Analysis**: Reportar diff de tamaño.
- [ ] **A11y Scan**: Axe-core en componentes críticos.

### Producción (Observabilidad)
- **Logs**: Winston/Morgan estructurados (JSON).
- **Alertas**:
    - CPU > 80%
    - Redis Memory > 70%
    - Circuit Breaker "Open" state > 1 min
