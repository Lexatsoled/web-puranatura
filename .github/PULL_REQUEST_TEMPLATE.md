# PR Checklist — por favor usa antes de solicitar revisión

Por favor marca cada punto que aplique antes de pedir revisión y/o merge.

- [ ] La rama se actualizó desde `main` y no hay conflictos.
- [ ] Lint y Type-check pasan localmente (`npm run lint && npm run type-check` en bash/WSL; en PowerShell usa `npm run lint; npm run type-check` o ejecuta ambos por separado) — si no es posible en el entorno, indicar motivo.
- [ ] Tests unit/integration (Vitest) ejecutados y verdes (`npm run test:ci`).
- [ ] Tests de contrato ejecutados (`npm run test:contract`).
- [ ] E2E / smoke verificados (`npm run test:e2e`) si se introduce flujo end-to-end.
- [ ] Escaneo de seguridad (`npm run scan:security`) ejecutado y sin findings críticos o justificación documentada.
- [ ] Pruebas de performance (smoke) ejecutadas en PR si cambiaron rutas/latencia crítica (`npm run perf:api`).
- [ ] No hay secretos ni datos sensibles en el diff (gitleaks / trivy local comprobados).
- [ ] Documentación actualizada en `README.md` o `GPT-51-Codex-Max` (si aplica).
- [ ] Checklist del Plan Maestro revisada — ¿qué fase/gate aplicas? (marca: Seguridad / Contratos / UX‑Perf / Observabilidad / Refactor)

Notas para reviewers:

- Si la CI del repo no puede ejecutarse en tu entorno (p. ej. `npm` deshabilitado) documenta las limitaciones arriba y añade evidencia adicional (lint outputs, capturas, etc.).
