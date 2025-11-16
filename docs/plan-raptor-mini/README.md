# Plan Raptor mini — Plan maestro para estabilizar Pureza-Naturalis-V3

Bienvenido: esta carpeta contiene la guía completa (fases y pasos) para estabilizar y robustecer la aplicación contenida en `Pureza-Naturalis-V3`.

Estructura (actualizada):

- `01-preparation.md` — Preparación: checkpoints, backups y husky/lint
- `02-encoding-repair.md` — Reparación de mojibake y normalización UTF-8 (dry-run y validación)
- `03-e2e-stabilization.md` — Estrategias para semilla determinista y `preseeded` contexts (Playwright)
- `04-build-test.md` — Build, tests unitarios y smoke tests
- `05-lighthouse-ci.md` — Lighthouse y rendimiento en CI
- `06-PR-checklist.md` — PR checklist y requisitos para cambios en E2E/encoding
- `07-e2e-flakiness.md` — Diagnósticos, `storageState` y reducción de flakiness en E2E

Nota rápida:

- Los documentos `06-security.md`, `07-content-review.md`, `08-pr-and-commit.md` se han consolidado en el README y algunos han sido renombrados/organizados en `06-PR-checklist.md` y `07-e2e-flakiness.md`.

- Los siguientes temas están ahora cubiertos en los archivos: `storageState` preseed strategy, `preseededPage` fixture, `tmp/e2e-storage/` ignore, `E2E-DIAG` logs y diagnósticos en CI.
- Los siguientes temas están ahora cubiertos en los archivos: `storageState` preseed strategy, `preseededPage` fixture, `tmp/e2e-storage/` ignore, `E2E-DIAG` logs y diagnósticos en CI.

Cómo usarlo: lee `README.md` y sigue las fases en orden. Cada fase tiene objetivos, pasos técnicos y validaciones.

Si necesitas que ejecute alguna de las fases, indícalo y la pondré en marcha.

---

Plan generado por Raptor mini (asistencia automatizada) — 16-Nov-2025
