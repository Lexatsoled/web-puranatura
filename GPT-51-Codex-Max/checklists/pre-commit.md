# Pre-commit / Pre-push

Ejecutar antes de push/PR:

- `npm run test:ci -- --maxWorkers=1 --no-file-parallelism`
- Verificar `git diff` sin secretos ni bases.

Hook sugerido (Husky):

```bash
# En Bash/WSL se puede usar '&&' para encadenar comandos. En PowerShell (Windows) usa ';' o ejecuta cada comando por separado.
npx husky add .husky/pre-commit "npm run lint && npm run type-check && npm run test:ci -- --maxWorkers=1 --no-file-parallelism"
npx husky add .husky/pre-push "gitleaks detect --no-banner && npm audit --production"
```
