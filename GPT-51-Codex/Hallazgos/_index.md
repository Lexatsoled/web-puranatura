# Índice de Hallazgos y Evidencias

---

version: 1.0  
updated: 2025-11-19  
owner: QA & AppSec

Cada hallazgo debe registrar: ID, fecha, descripción corta, estado y vínculo al detalle/evidencia. Las capturas residen en [`Evidencias/`](Evidencias) y los informes txt importados de GitHub se mantienen en [`Problemas_GitHub/`](Problemas_GitHub).

## Tabla maestra

| ID              | Fecha      | Origen                  | Resumen                                                              | Estado          | Detalle                                                                                                                                                   |
| --------------- | ---------- | ----------------------- | -------------------------------------------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SEC-AUTH-002    | 2025-11-18 | Auditoría Codex         | Autenticación sólo en cliente con contraseñas en `localStorage`.     | ⚠️ Abierto      | [Reporte](../Hallazgos/log-debug.md#sec-auth-002)                                                                                                         |
| SEC-SECRETS-004 | 2025-11-18 | Auditoría Codex         | `.env` del backend con JWT reales versionados.                       | ⚠️ Abierto      | [Reporte](../Hallazgos/log-debug.md#sec-secrets-004)                                                                                                      |
| SEC-XSS-003     | 2025-11-18 | Auditoría Codex         | `dangerouslySetInnerHTML` sin sanitizar en Blog/ProductPage.         | ⚠️ Abierto      | [Reporte](../Hallazgos/log-debug.md#sec-xss-003)                                                                                                          |
| PERF-LAZY-005   | 2025-11-18 | Auditoría Codex         | `withLazyLoading` impide code-splitting.                             | ⚠️ Abierto      | [Reporte](../Hallazgos/log-debug.md#perf-lazy-005)                                                                                                        |
| OPS-SCRIPT-008  | 2025-11-18 | Auditoría Codex         | `scripts/optimizeImages.ts` no procesa assets.                       | ⚠️ Abierto      | [Reporte](../Hallazgos/log-debug.md#ops-script-008)                                                                                                       |
| QA-E2E-007      | 2025-11-18 | Auditoría Codex         | Prueba Playwright compara conteos iguales (falsos positivos).        | ⚠️ Abierto      | [Reporte](../Hallazgos/log-debug.md#qa-e2e-007)                                                                                                           |
| OBS-ANA-006     | 2025-11-18 | Auditoría Codex         | `useAnalytics` usa `process.env.REACT_APP_*` y salta consentimiento. | ⚠️ Abierto      | [Reporte](../Hallazgos/log-debug.md#obs-ana-006)                                                                                                          |
| I18N-ENC-009    | 2025-11-18 | Auditoría Codex         | Mojibake general en UI y datos.                                      | ⚠️ Abierto      | [Reporte](../Hallazgos/log-debug.md#i18n-enc-009)                                                                                                         |
| IMG-ASSET-010   | 2025-11-19 | Auditoría Codex         | Dataset referencia imágenes inexistentes en `public/Jpeg`.           | ⚠️ Nuevo        | [Reporte](../Hallazgos/log-debug.md#img-asset-010)                                                                                                        |
| CI-SEC-001      | 2025-11-17 | Copilot (security-scan) | CodeQL upload `@v2` deprecado + falta `security-events: write`.      | ⚠️ Pendiente PR | [`CI  security-scan (pull_request).txt`](<Problemas_GitHub/CI%20%20security-scan%20(pull_request).txt>)                                                   |
| CI-E2E-002      | 2025-11-17 | Copilot                 | `test-e2e` timeout por seedCart.                                     | ⚠️ Pendiente    | [`CI  test-e2e (pull_request).txt`](<Problemas_GitHub/CI%20%20test-e2e%20(pull_request).txt>)                                                             |
| CI-UNIT-003     | 2025-11-17 | Copilot                 | Job `test-unit` falla por selectors frágiles.                        | ⚠️ Pendiente    | [`CI  test-unit (pull_request).txt`](<Problemas_GitHub/CI%20%20test-unit%20(pull_request).txt>)                                                           |
| CI-ALL-004      | 2025-11-17 | Copilot                 | Workflow `unit-and-e2e` necesita mayor timeout.                      | ⚠️ Pendiente    | [`CI - Tests  unit-and-e2e (pull_request).txt`](<Problemas_GitHub/CI%20-%20Tests%20%20unit-and-e2e%20(pull_request).txt>)                                 |
| CI-LINT-005     | 2025-11-17 | Copilot                 | `CI Lint` falla por encoding y archivos generados.                   | ⚠️ Pendiente    | [`CI Lint.txt`](Problemas_GitHub/CI%20Lint.txt)                                                                                                           |
| CI-SMOKE-006    | 2025-11-17 | Copilot                 | Playwright Smoke Checkout requiere mayores retries/logs.             | ⚠️ Pendiente    | [`Playwright Tests  E2E Smoke - Checkout (pull_request).txt`](<Problemas_GitHub/Playwright%20Tests%20%20E2E%20Smoke%20-%20Checkout%20(pull_request).txt>) |
| CI-PLAY-007     | 2025-11-17 | Copilot                 | Job `Playwright Tests / test` falla por selectors y encoding.        | ⚠️ Pendiente    | [`Playwright Tests  test (pull_request).txt`](<Problemas_GitHub/Playwright%20Tests%20%20test%20(pull_request).txt>)                                       |
| SEC-SCAN-008    | 2025-11-17 | Copilot                 | `Secret Scan` fails por PAT/permissions en forks.                    | ⚠️ Pendiente    | [`Secret Scan  Scan for secrets (pull_request).txt`](<Problemas_GitHub/Secret%20Scan%20%20Scan%20for%20secrets%20(pull_request).txt>)                     |
| SEC-SCAN-009    | 2025-11-17 | Copilot                 | `Secret Scan (push)` requiere ignorer para artefactos.               | ⚠️ Pendiente    | [`Secret Scan  Scan for secrets (push).txt`](<Problemas_GitHub/Secret%20Scan%20%20Scan%20for%20secrets%20(pull_request).txt>)                             |

> **Nota:** Cuando un hallazgo se cierre, actualizar esta tabla con estado ✅ y añadir referencia al commit/PR que lo resolvió.

---

### Historial de cambios

- **2025-11-19 · v1.0** – Creación del índice y registro de los 9 reportes Copilot + hallazgos Codex.
