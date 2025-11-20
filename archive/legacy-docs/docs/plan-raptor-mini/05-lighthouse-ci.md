# Fase 4 — Lighthouse (Rendimiento y auditoría de PWAs) en CI

Objetivo:

- Ejecutar Lighthouse/LHCI contra el `dist/` generado en un runner Linux (GitHub Actions o similar) para evitar problemas de permisos en Windows y obtener HTML/JSON de auditoría.

Por qué:

- Chrome Launcher en Windows puede fallar en la limpieza de `TEMP` y dar errores `EPERM`. CI provee entornos controlados y reproducibles.

Pasos rápidos (CI):

1. Preparar un job en `.github/workflows/lighthouse.yml` — ejemplo mínimo:

```yaml
name: Lighthouse Audit
on: [push, pull_request]
jobs:
  lhci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      - name: Install deps
        run: npm ci
      - name: Build app
        run: npm run build
      - name: Serve dist
        run: npx http-server ./dist -p 4173 -a 127.0.0.1 &
      - name: Lighthouse CI
        run: npx --yes @lhci/cli@0.11.0 autorun --config=.lighthouserc.json
```

2. Configurar `lhci` para recoger `reports/` como artefactos.

Local (si prefieres local):

1. Ejecutar PowerShell como administrador o en WSL para evitar `EPERM`.

2. Generar temp dir y lanzar server:

```powershell
 $env:TEMP = "$PWD\temp_lh"
 mkdir -Force .\temp_lh
 npx http-server ./dist -p 4173 -a 127.0.0.1 &
 npx --yes lighthouse http://localhost:4173 --only-categories=performance,accessibility,seo,pwa --output html --output-path reports/lighthouse-report.html --chrome-flags='--no-sandbox --disable-dev-shm-usage'
```

Validación:

- `reports/lighthouse-report.html` y `reports/lighthouse-report.json` generados y revisados.
