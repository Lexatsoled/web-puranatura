# Catálogo de Herramientas de Debug

---

version: 1.0  
updated: 2025-11-19  
owner: Debug Squad

| Herramienta                               | Uso                                   | Comando / Pseudocódigo                                                                                                                                  | Notas                                                   |
| ----------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| **Vitest + watch**                        | Depurar hooks/contextos               | `npm run test -- src/hooks/useApi.test.ts --maxWorkers=1 --no-file-parallelism --watch`                                                                                      | Config `vitest.setup.ts` provee shim de `localStorage`. |
| **Playwright Inspector**                  | Reproducir CI failures                | `npx playwright test --headed --debug`                                                                                                                  | En CI activar `PWDEBUG=console`.                        |
| **Trivy**                                 | Vulnerabilidades `fs`                 | `trivy fs --format sarif --output trivy-results.sarif .`                                                                                                | Requiere `security-events: write` para subir SARIF.     |
| **gitleaks**                              | Secret scanning local                 | `gitleaks detect --redact --verbose`                                                                                                                    | Mantener `.gitleaks.toml` sincronizado con ignore list. |
| **Lighthouse CLI**                        | Performance/A11y                      | `npx lighthouse http://localhost:4173 --preset=desktop --view`                                                                                          | Exportar JSON → `metrics-dashboard.md`.                 |
| **npx depcheck**                          | Dependencias obsoletas                | `npx depcheck`                                                                                                                                          | Útil tras regenerar `package-lock.json`.                |
| **Custom script: `analyze-inventory.py`** | Mapear módulos desde `inventory.json` | `python\nimport json\nfrom collections import Counter\ndata=json.load(open('inventory.json'))\nprint(Counter(f['module_id'] for f in data['files']))\n` | Úsalo para validar cobertura ≥95 %.                     |

## Flujos de debugging recomendados

1. **CI Failure → Pull logs txt** (ubicados en `Hallazgos/Problemas_GitHub/`), replicar local con comando equivalente y documentar en `log-debug.md`.
2. **Encoding/Mojibake** → utilizar `iconv` o VS Code converter; confirmar con `file -i`.
3. **E2E flaky** → habilitar `trace: 'retain-on-failure'` en Playwright y abrir en `temp_trace_extract1/`.

---

### Historial de cambios

- **2025-11-19 · v1.0** – Inventario inicial de herramientas y scripts.
