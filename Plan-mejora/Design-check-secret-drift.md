# Diseño: check-secret-drift (detección y disciplina de secretos)

Objetivo: garantizar que los secretos permanecen en `Secretos/` (gitignored) y que no se introducen claves o credenciales en el repo. No usa servicios externos.

## Requerimientos

- Node >= 20 (ya en proyecto).
- Ubicación protegida: carpeta `Secretos/` en la raíz del repo (gitignored).
- Integración: pre-commit (husky) y CI.

## Comportamiento deseado

1. Verifica existencia de `Secretos/` y lista mínima requerida (configurable en JSON, ej. `Secretos/.required.json`).
2. Escanea el árbol del repo (excluyendo `Secretos/`, `node_modules`, `dist`, `public/optimized`, `coverage`, `reports`, `tmp*`) buscando patrones de:
   - Prefijos comunes (AKIA, GCP, ghp*, pat*, etc.).
   - Claves JWT largas, URLs con user:pass, DSN de DB, tokens Bearer.
   - Ficheros `.env`, `.pem`, `.key` fuera de `Secretos/`.
3. Si encuentra coincidencias:
   - Falla con mensaje claro (ruta + patrón) y recomendación de mover a `Secretos/`.
4. Si faltan secretos requeridos:
   - Warning (no bloquea por defecto) para que el owner haga backup manual.
5. Salida:
   - Exit code 1 si hay fuga potencial.
   - Exit code 0 si todo OK o solo warnings de faltantes.

## Estructura sugerida

- Archivo de config: `Secretos/.required.json` (ejemplo):
  ```json
  { "required": ["backend.env.local", "frontend.env.local"] }
  ```
- Script: `scripts/check-secret-drift.cjs`
  - Usa glob y regex.
  - Lista de exclusiones configurable.
  - Patrones en `scripts/patterns/secrets.json` (opcional) para mantenimiento sencillo.

## Flujo en pre-commit / CI

- Pre-commit (husky): correr rápido con límites de tamaño (p.ej. ignorar >2 MB).
- CI: escaneo completo en PRs; si hay hallazgos, falla el job.
- Instrucción para desarrolladores: si se necesita usar un secreto en local, colocarlo en `Secretos/` y referenciarlo con path relativo en scripts o env loader (no versionar).

## Ejemplo de CLI (pseudo)

```
node scripts/check-secret-drift.cjs --required Secretos/.required.json \
  --exclude "public/optimized/**" "dist/**" "node_modules/**"
```

## Mensajes de salida (claros)

- OK: `✅ No se detectaron secretos fuera de Secretos/`
- Warning: `⚠️ Faltan secretos declarados: backend.env.local`
- Error: `❌ Posible secreto en src/config/foo.ts (regex: JWT)`

## Métricas de éxito

- 0 secretos confirmados en git tras 30 días.
- Ningún PR con fuga bloqueado tardíamente (detectar en pre-commit/CI).

## Riesgos y mitigación

- Falsos positivos: permitir whitelist por archivo/patrón con aprobación explícita en config.
- Rendimiento: limitar tamaños y excluir binarios; usar streaming para ficheros grandes.
- Disciplina manual: recordar respaldar `Secretos/`; el script solo avisa si faltan.
