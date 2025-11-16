# Manual del Coordinador (Codex)

## Rol
Supervisar todas las fases, validar que cada IA ejecuta su backlog y mantener la sincronización con los checkpoints. Responsable de aprobar PRs internos y de ejecutar las baterías de pruebas globales.

## Dependencias previas
- Node >= 18, npm installado.
- `npm install` en raíz y `backend` ya ejecutado (si no, correr `npm install` y `npm install` dentro de `backend`).
- Variables `.env` y `backend/.env` presentes (no editarlas salvo indicación).

## Fases y checkpoints
1. **Fase 1 – Seguridad crítica** (GPT-4.1). Checkpoint: pruebas unitarias backend + `npm run lint` sin errores.
2. **Fase 2 – Flujo de pedidos y validaciones** (GPT-4.1 + GPT-5-Mini). Checkpoint: Playwright checkout + Fastify tests verdes.
3. **Fase 3 – Offline + encoding + imágenes** (GPT-5-Mini). Checkpoint: Lighthouse smoke + `npm run check:encoding`.
4. **Fase 4 – SEO + automatización** (Grok Code Fast 1). Checkpoint: sitemap test + scripts k6/lighthouse actualizados.
5. **Fase final**: ejecutar regresión completa (ver abajo) y actualizar `findings.json` / `metrics-dashboard.md`.

No avanzar a la siguiente fase sin confirmación escrita y evidencia (logs en `Instrucciones_Plan_Ejecucion/` o en PR).

## Scripts globales de verificación
```bash
npm run lint
npm run type-check
npm run test:ci
npm run test:e2e -- --reporter=list # requiere browsers instalados
npm run check:encoding
npm run analyze # Lighthouse (puede tardar)
```
Para backend únicamente:
```bash
cd backend
npm run test:ci
npm run lint
```

## Checklist de cierre
- `git status` limpio (sin archivos sin seguimiento relevantes).
- `findings.json` actualizado (estado/resueltos).
- `metrics-dashboard.md` con nuevos valores post-fix.
- Evidencias (capturas o logs) anexadas si la compañía lo exige.

## Mecanismos anti-regresión
- Revisar que cualquier script nuevo tenga pruebas (por ejemplo, `scripts/collect_metrics.ts`).
- Exigir que los agentes corran al menos las suites unitarias relacionadas con sus cambios.
- Mantener esta carpeta sincronizada; si se agrega otra IA o tarea, crear un nuevo archivo.
