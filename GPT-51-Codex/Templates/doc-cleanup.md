# Checklist – Limpieza documental

---

version: 1.0  
updated: 2025-11-19  
owner: PMO

1. **Generar inventario**
   - Ejecutar `python scripts/doc_inventory.py` (o usar `docs_inventory.json` existente).
   - Clasificar cada archivo como `conservar`, `archivar`, `eliminar`.
2. **Respaldar**
   - Crear carpeta `archive/<subcarpeta>` (ej. `archive/legacy-analysis`).
   - Mover allí los archivos obsoletos (usar `Move-Item` o `git mv`).
3. **Eliminar temporales**
   - Borrar carpetas regenerables (p.ej. `temp_trace_extract1`).
4. **Actualizar documentación**
   - Registrar la acción en `GPT-51-Codex/Hallazgos/log-debug.md` (nuevo ítem LOG-CLEAN-XXX).
   - Marcar la tarea en `ToDo/backlog.md`.

---

### Historial de cambios

- **2025-11-19 · v1.0** – Guía creada tras la primera limpieza.
