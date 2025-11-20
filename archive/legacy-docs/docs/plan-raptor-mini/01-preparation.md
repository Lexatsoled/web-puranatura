# Fase 0 — Preparación y checkpoint

Objetivo:

- Preparar la base del proyecto para aplicar cambios, con copias de seguridad, y asegurar que los scripts importantes no destruyen contenido.

Por qué:

- Restaurar o revertir será necesario si un cambio automático (p. ej. reparación masiva de encoding) introduce errores.

Pasos:

1. Crear checkpoint local en Git (ramas para revisión):
   ```powershell
   git status
   git add -A
   git commit -m "WIP: checkpoint antes de correcciones de encoding y E2E"
   git branch checkpoint-before-encoding
   ```
2. Generar una copia comprimida del proyecto (opcional):
   ```powershell
   Compress-Archive -Path .\Pureza-Naturalis-V3 -DestinationPath ..\Pureza-Naturalis-V3-backup-$(Get-Date -Format yyyyMMddHHmm).zip
   ```
3. Listar y revisar `.bak` y los scripts de reparación:
   ```powershell
   Get-ChildItem -Recurse -Filter *.bak
   Get-ChildItem -Recurse -Path .\scripts | Select-String -Pattern "encoding|fix|repair|lighthouse|playwright" -SimpleMatch
   ```
4. Verificar la presencia de la versión de `fix-encoding.js.bak` y `scripts/fix-encoding.js` en un diff y revisar manualmente. No ejecutar `force_repair_encoding.cjs` sin revisión.

Validación:

- Confirmar que `checkpoint-before-encoding` existe.
- Asegurarte que `scripts/fix-encoding.js` es la versión conservadora (si no, restaurarla desde `.bak`).
