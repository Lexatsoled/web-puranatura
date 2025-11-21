# Estado Actual del Proyecto

---

version: 1.0  
updated: 2025-11-19  
owner: Release Management

## Resumen ejecutivo

- **Branch analizado:** `fix/regenerate-lockchore`
- **Última auditoría:** 2025-11-19 14:10 UTC
- **PR relacionado:** [#2 Draft](https://github.com/Lexatsoled/web-puranatura/pull/2) con 39 commits
- **Checks CI:** 9 fallidos (lint, unit, e2e, security-scan, secret-scan)

## Radar de salud

| Área          | Estado | Comentarios                                                                    |
| ------------- | ------ | ------------------------------------------------------------------------------ |
| Build         | ⚠️     | `npm run build` depende de `optimizeImages.ts` incompleto                      |
| Seguridad     | 🔴     | Credenciales en localStorage, `.env` con secretos reales, secret-scan fallando |
| Rendimiento   | ⚠️     | Bundle inicial >2 MB, lazy loading roto                                        |
| Accesibilidad | ⚠️     | Mojibake en UI, falta de etiquetas/ARIA en modales                             |
| Testing       | 🔴     | Vitest y Playwright fallan en CI; assertions débiles                           |
| Documentación | 🟡     | `GPT-51-Codex` creado ahora; antes no había registro                           |

## Línea de tiempo reciente

| Fecha      | Evento                   | Impacto                                         |
| ---------- | ------------------------ | ----------------------------------------------- |
| 2025-11-15 | PR #2 marcado como draft | CI comienza a fallar por diagnósticos agregados |
| 2025-11-18 | Auditoría local (Codex)  | Se detectan 9 hallazgos críticos/altos          |
| 2025-11-19 | Creación GPT-51-Codex    | Se formaliza documentación y plan maestro       |

## Versiones y artefactos

- **Node:** 22.x
- **npm:** 10.x
- **package-lock.json:** regenerado el 2025-11-18 (`fix/regenerate-lockchore`)
- **inventory.json:** 2 931 archivos, hash SHA-256 por entrada
- **Coverage HTML:** última corrida en `coverage/web-puranatura---terapias-naturales/index.html` (obsoleta)

## Riesgos inmediatos

1. **Autenticación falsa** → bloquea release por incumplir requisitos legales.
2. **Secretos expuestos** → obliga a rotación y a pasar secret-scan.
3. **Playwright inestable** → no podemos aprobar PR sin green CI.

## Acciones en curso

- Fase 1 del [plan maestro](../Plan_Ejecucion/plan-maestro.md#fase-1-configuracion-inicial) en ejecución.
- Revisión de los 9 txt de “Problemas Encontrados en GitHub” (ver [`Hallazgos/_index.md`](../Hallazgos/_index.md)).

---

### Historial de cambios

- **2025-11-19 · v1.0** – Primer snapshot del estado del proyecto y mapeo de riesgos.
