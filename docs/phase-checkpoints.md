# Estado de fases — índice y punto de entrada canonical

Este documento ahora actúa como un stub/index de compatibilidad en `docs/` que apunta a la fuente de verdad canonica del plan maestro.

La documentación y el seguimiento detallado de fases se mantiene en:

- `GPT-51-Codex-Max-Hight/CheckList.md` (FUENTE DE VERDAD — checklist maestro, evidencia y pasos por fase)

¿Por qué este cambio?

- Evitamos duplicidad y drift entre documentos.
- Conservamos un punto de entrada en `docs/` para herramientas o lectores que navegan esa carpeta.

Uso recomendado:

- Para trabajo operativo y actualizaciones del plan maestro, edita únicamente `GPT-51-Codex-Max-Hight/CheckList.md`.
- Si encuentras referencias externas apuntando a `docs/phase-checkpoints.md`, permanecen válidas pero redirigidas a la fuente canonical.

Última actualización: 2025-11-29 — actualizado desde CheckList.md (automático).
Última actualización: 2025-11-30 — novedades: Dependabot configurado y `dependabot.yml` fusionado en `main` (PR #28). Además se creó un workflow para auto-merge seguro de parches y se fusionó en `main` (PR #29 — `.github/workflows/dependabot-auto-merge.yml`). Se añadió una mejora backend para desarrollo local (PR #30) que prioriza `.env.local` y aplica un fallback `DATABASE_URL=file:./prisma/dev.db` en entornos no-production. Dependabot rules en progreso (preparadas para HIGH/CRITICAL, por implementar).
Se añadió workflow para detectar alertas Dependabot de severidad HIGH/CRITICAL y crear issues automáticamente (`.github/workflows/dependabot-high-alerts.yml`).
Se añadió generación de SBOM y comprobación de licencias en CI (`.github/workflows/generate-sbom.yml`, `scripts/check-licenses.cjs`, package.json scripts `generate:sbom` y `check:licenses`).

Resumen de cambios recientes:

- 2025-11-29: Se actualizó `GPT-51-Codex-Max-Hight/CheckList.md` para reflejar la retirada del endpoint integrado de IA, la eliminación de referencias a proveedores LLM (OpenAI, Gemini) en la documentación y manifiestos, y la verificación de la suite de pruebas (tests verdes). Para detalles y evidencia completa consulte la fuente canonical `GPT-51-Codex-Max-Hight/CheckList.md`.
- 2025-11-29: Se actualizó `GPT-51-Codex-Max-Hight/CheckList.md` para reflejar la retirada del endpoint integrado de IA, la eliminación de referencias a proveedores LLM (OpenAI, Gemini) en la documentación y manifiestos, la verificación de la suite de pruebas (tests verdes) y la preparación de Dependabot (PR #28) junto con la activación de opciones de Advanced Security (Automatic dependency submission y Dependabot alerts). Para detalles y evidencia completa consulte la fuente canonical `GPT-51-Codex-Max-Hight/CheckList.md`.

_Contenido fuente (primera sección de CheckList.md resumida):_

---

## CheckList - Seguimiento detallado del Plan Maestro (PuraNatura)
