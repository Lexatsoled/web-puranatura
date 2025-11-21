# Plan Maestro de Depuración y Delivery

---

version: 1.0  
updated: 2025-11-19  
owner: PM Técnico

Cada fase incluye subpasos, criterios de aceptación (CA), métricas y recursos.

## Fase 1 – Configuración inicial

- **Objetivo:** preparar entorno, documentación y estructura de carpetas (completada con GPT-51-Codex).
- **Subpasos (ejecutables por plantillas):**
  1. Crear `GPT-51-Codex/` y poblar subcarpetas ✔️.
  2. Importar informes (`Problemas_GitHub`) y evidencias ✔️.
  3. Validar `inventory.json` ≥95 % cobertura (usar `Templates/task-checklist.md` para registrar pasos).
- **CA:** README maestro disponible, logs centralizados, inventario sin errores.
- **Métricas:** número de archivos documentados, % de rutas con `module_id`.
- **Recursos:** DevOps + PMO.

## Fase 2 – Análisis del estado actual

- **Objetivo:** auditar el código existente y generar hallazgos priorizados.
- **Subpasos:** revisar arquitectura, seguridad, performance y tests (hallazgos SEC-_, PERF-_, etc.).
- **CA:** `Estado_Actual/estado-proyecto.md` actualizado, `Hallazgos/_index.md` con IDs únicos.
- **Métricas:** Hallazgos clasificados por severidad, enlaces a archivos concretos.
- **Recursos:** Arquitectura, AppSec, QA.

## Fase 2.5 – Integración Front–Back

- **Objetivo:** levantar el backend real (BFF) sobre SQLite y conectar el frontend con contratos claros.
- **Subpasos (según [`Templates/backend-endpoint.md`](../Templates/backend-endpoint.md)):**
  1. Inicializar proyecto Node en `backend/` con Express/Prisma (`npm init -y`, `npx prisma init`).
  2. Crear modelos y migraciones (`npx prisma migrate dev`), documentar seeds.
  3. Implementar endpoints `/auth`, `/products`, `/orders` siguiendo la plantilla de endpoint.
  4. Configurar proxy en `vite.config.ts` y reemplazar mocks en `useApi`.
  5. Generar manifest de imágenes (`IMG-ASSET-010`) y servirlas desde el BFF o desde `public/optimized`.
- **CA:** backend responde en 3001, SPA consume `/api/*` reales.
- **Métricas:** tests integración backend pasando, respuesta <300 ms local.
- **Recursos:** Backend, DevOps, Frontend.

## Fase 3 – Identificación de problemas

- **Objetivo:** mapear bugs, vulnerabilidades y puntos de mejora en profundidad.
- **Subpasos:**
  1. Analizar los 9 reportes de GitHub Copilot (CI/secret scan).
  2. Asociar cada problema a tareas ToDo y al plan de mejoras.
  3. Documentar FODA y riesgos.
- **CA:** tablero ToDo con prioridad, log-debug con causa raíz.
- **Métricas:** % de hallazgos con dueño y plan de remediación.
- **Recursos:** QA + AppSec.

## Fase 4 – Desarrollo de herramientas

- **Objetivo:** crear scripts/utilidades para facilitar debugging (e.g., `optimizeImages`, `analyze-inventory`, Playwright helpers).
- **Subpasos:** codificar scripts, documentarlos en `Herramientas_Debug/`, agregar ejemplos de uso/pseudocódigo.
- **CA:** catálogo actualizado, scripts versionados y probados.
- **Métricas:** tiempo promedio de diagnóstico ↓, número de scripts reutilizados.
- **Recursos:** DevOps + QA Automation.

## Fase 5 – Ejecución de testing

- **Objetivo:** implementar y ejecutar suites unitarias, integración, e2e, seguridad y performance.
- **Subpasos:** usar matriz de `Tests/`, agregar coverage, estabilizar CI, registrar cada corrida con la plantilla de checklist (`Templates/task-checklist.md`).
- **CA:** todos los pipelines en verde, reportes adjuntos.
- **Métricas:** coverage ≥80 %, LCP <2.5 s, secret-scan=0.
- **Recursos:** QA + Devs.

## Fase 6 – Corrección y optimización

- **Objetivo:** aplicar fixes y mejoras priorizadas (auth backend, lazy loading, sanitización, i18n).
- **Subpasos:** ejecutar tareas T1.x, T2.x, T3.x según `fix-plan.md`/`Mejoras/roadmap.md`.
- **Comentarios/documentación:** verificar que cada archivo tocado cumpla el [estándar de comentarios](../Herramientas_Debug/estandar-comentarios.md) y documentar los cambios usando plantillas de checklist para asegurar trazabilidad.
- **CA:** hallazgos críticos cerrados, backlog en progreso, checklist de comentarios aprobada.
- **Métricas:** hallazgos abiertos vs cerrados, bundlesize, CI success rate, % de archivos críticos con comentarios normalizados.
- **Recursos:** Dev Team completo + Tech Writing.

## Fase 7 – Validación final

- **Objetivo:** pruebas de regresión, revisión de documentación y preparación para merge/release.
- **Subpasos:** correr regression-suite, actualizar métricas, revisar PR #2 con checks verdes.
- **CA:** `metrics-dashboard.md` actualizado, `Estado_Actual` con estado “Listo para Deploy”.
- **Métricas:** 0 fallas en regression suite, sign-off de QA/AppSec.
- **Recursos:** QA, AppSec, PM.

---

### Historial de cambios

- **2025-11-19 · v1.2** – Agregada Fase 2.5 para integración real Front–Back.
- **2025-11-19 · v1.1** – Añadido requisito de normalizar comentarios en Fase 6.
- **2025-11-19 · v1.0** – Se documentaron las 7 fases con métricas y recursos.
