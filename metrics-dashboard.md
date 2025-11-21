# Metrics Dashboard

version: 1.1  
updated: 2025-11-22  
owner: Observabilidad

| Metrica                    | Valor actual (2025-11-22) | Objetivo Q1 2026 | Como medir / Owner                          |
| -------------------------- | ------------------------- | ---------------- | ------------------------------------------- |
| LCP Home (desktop)         | 5.63 s                    | <= 2.5 s         | 
px lighthouse --preset=desktop / Front   |
| TTFB /api/auth/login       | 0.9 s (mock)              | <= 0.3 s         | k6 + APM backend / SRE                      |
| Bundle inicial             | 650.69 kB                 | <= 650 kB        | 
pm run build / Front                     |
| Cobertura pruebas          | 42 % statements           | >= 80 %          | 
pm run test:coverage / QA                |
| Secret leaks por release   | 0                         | 0                | gitleaks detect en CI / DevSecOps         |
| CLS promedio               | 0.18                      | <= 0.10          | Lighthouse + RUM / UX                       |
| Eventos analytics validos  | 0 % (bloqueado por GDPR)  | >= 95 %          | GA debug view + consentimiento / Marketing  |

Pasos para actualizar:
1) Ejecuta 
pm run build, 
pm run test:coverage y 
px lighthouse http://localhost:4173 --preset=desktop --output=json.
2) Reemplaza los valores en data/metricsDashboard.ts y guarda los artefactos en eports/.
3) Publica los resultados en el dashboard UI (/metricas) y en este archivo.
