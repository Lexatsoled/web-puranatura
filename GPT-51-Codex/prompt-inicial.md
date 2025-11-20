# Prompt Inicial – GPT-51 Codex Low

---

version: 1.0  
updated: 2025-11-19  
owner: PM Técnico

Lee este documento al iniciar cualquier chat nuevo. Resume el estado del proyecto y te indica qué archivos debes consultar antes de trabajar.

## Contexto esencial

1. **Documentación principal:** vive en `GPT-51-Codex/`.
   - Índice maestro: `GPT-51-Codex/README.md`.
   - Plan maestro: `GPT-51-Codex/Plan_Ejecucion/plan-maestro.md`.
   - Backlog de tareas: `GPT-51-Codex/ToDo/backlog.md`.
   - Log de hallazgos: `GPT-51-Codex/Hallazgos/log-debug.md`.
2. **Scripts útiles:** `scripts/orchestrator.mjs`, `scripts/doc-cleanup.ps1`, `scripts/image-manifest.ps1`, `scripts/check-backend.ps1`.
3. **Templates para tareas y documentación:** `GPT-51-Codex/Templates/`.

## Trabajo ya realizado

- Inventario `docs_inventory.json` (UTF-16) y limpieza documental (`DOC-CLEAN-011`).
- Limpieza física moviendo carpetas antiguas a `archive/`.
- Creación de plan maestro 7 fases + Fase 2.5 (BFF) + T1.5/T1.6/T2.4/T0.1.
- Orquestación de comandos Node/PowerShell y guías en Templates.

## Pendiente destacado (consultar backlog para fechas exactas)

- **T1.1–T1.4:** auth seguro, secretos, sanitización, comentarios en español.
- **T1.5/T1.6:** inicializar BFF en `backend/` (Express/Fastify + ORM) + migraciones.
- **T2.1–T2.4:** lazy loading, optimización de imágenes, analytics, manifest de imágenes (IMG-ASSET-010).
- **T3.x–T5.x:** encoding/a11y, Playwright, CI, métricas. Detalles completos en `ToDo/backlog.md`.

## Cómo proceder en un nuevo chat

1. **Leer en orden:**
   - `GPT-51-Codex/README.md`
   - `GPT-51-Codex/Plan_Ejecucion/plan-maestro.md`
   - `GPT-51-Codex/ToDo/backlog.md`
   - `GPT-51-Codex/Hallazgos/log-debug.md`
2. **Identificar la tarea activa** (por prioridad en backlog).
3. **Consultar templates y scripts** relevantes (ej. backend-endpoint, doc-cleanup, etc.).
4. **Ejecutar comandos** usando los scripts (`npm run ci`, `node scripts/orchestrator.mjs ci`, `.\scripts\image-manifest.ps1`, etc.).
5. **Registrar cambios** en Codex:
   - Actualizar `Hallazgos/log-debug.md` con nuevos hallazgos/resoluciones.
   - Actualizar `ToDo/backlog.md` (estado, fechas).
   - Si creas nueva documentación, sigue el estándar (front-matter + historial).

## Reglas clave

- Comentarios y documentación siempre en español (ver `Herramientas_Debug/estandar-comentarios.md`).
- Mantén `GPT-51-Codex` como fuente de verdad; cualquier doc antigua va a `archive/`.
- Antes de eliminar algo, confirma que está inventariado y documenta la acción.
- Usa scripts/plantillas antes de improvisar.

## Ante bloqueos

- Si encuentras un problema no cubierto por el plan, regístralo en `Hallazgos/log-debug.md` con un nuevo ID y consulta en este chat maestro antes de avanzar.

¡Listo! A partir de aquí, ejecuta la tarea correspondiente siguiendo el plan y actualiza los archivos pertinentes.

---

### Historial de cambios

- **2025-11-19 · v1.0** – Versión inicial creada para arrancar nuevos chats.
