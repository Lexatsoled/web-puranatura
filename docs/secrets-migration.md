# Migración de secretos — guía y pasos recomendados

Este documento describe los pasos recomendados para migrar secretos fuera del
repositorio hacia un almacén seguro (por ejemplo GitHub Secrets, HashiCorp Vault,
Azure Key Vault, etc.) y asegurar que el proyecto no dependa de ficheros `.env`
almacenados en el repo.

Resumen rápido

- Objetivo: eliminar secretos del repo y centralizar el almacenado en un vault
  o en GitHub Secrets con roles/rotación periódica.
- Riesgo inmediato: `.env` o cualquier archivo que contenga credenciales examinado
  por CI y eliminado/rotado si aparece.

Pasos recomendados (bajo-prioridad: alto impacto)

1. Inventario de secretos requeridos
   - Recolectar la lista por lectura de `backend/src/config/env.ts` y otras
     componentes que referencien variables de entorno (ej: `JWT_SECRET`,
     `JWT_REFRESH_SECRET`, `DATABASE_URL`, `SENTRY_DSN`, etc.).
2. Crear un secreto maestro en la plataforma de gestión de secretos (ej. GitHub
   Secrets) para cada entorno (staging, production) y documentar nombres.
3. Actualizar despliegues / pipelines para leer secretos desde la plataforma
   segura. Reemplazar valores en infra/CD y eliminar `.env` de repositorios.
4. Rotación y auditoría
   - Implementar rotaciones periódicas y una política para revocar claves
     comprometidas.
5. PRs y onboarding
   - Añadir plantilla PR y checklist de verificación de secretos para reviewers.

Checklist mínimo (por migración)

- [ ] Lista de secretos detectados en repo y en infra.
- [ ] Crear secrets por entorno en GitHub y actualizar workflows con `secrets.`
- [ ] Actualizar runners/stage para leer desde vault (secrets provider).
- [ ] Eliminar `.env` y credenciales del repo. Añadir comprobación CI obligatoria.

Automation & handy helpers (new)

- `scripts/list-required-secrets.cjs` — escanea el código y sugiere una lista de vars de entorno (puede escribir `.github/required-secrets.yml` con `--write`).
- `scripts/gh-set-secrets.cjs` — helper local que usa `gh secret set` para subir valores desde `.env.local` o variables de entorno (requiere `gh` autenticado).
- `scripts/deploy-check.cjs` + workflow `.github/workflows/deploy-check-secrets.yml` — verificación de humo de despliegue que asegura los secretos necesarios estén en el runner antes de lanzar un deploy.

How to use (quick):

1. Run a quick scan to detect env vars and update the manifest:
   node scripts/list-required-secrets.cjs --write
2. Prepare a local `.env.local` with secret values (DO NOT commit this file) and then push secrets to GitHub with gh cli:
   node scripts/gh-set-secrets.cjs --file .github/required-secrets.yml --env-file .env.local
3. Confirm CI sees secrets via the `Validate required repo secrets` workflow or use the deploy-check workflow which runs a dry-run verification of deployment secrets.

Notes / Safety

- Do not commit `.env.local`, `.env`, or any plaintext secrets.
- Always review `required-secrets.yml` and keep it minimal — only variables the runtime actually needs in production.
- Prefer organization-level secrets or environment-scoped secrets for production pipelines and control access with repository selections.

- Notas sobre IA y proveedores LLM

Este proyecto ya no incluye un endpoint de IA integrado ni integraciones
directas con proveedores LLM. Si necesitas funciones de LLM, integra dichas
capacidades de forma externa — por ejemplo usando un orquestador como `n8n`
y webhooks seguros. Esto mantiene las claves de proveedor fuera del
repositorio y de la CI, y permite gestionar su ciclo de vida por separado.
— for example using an orchestrator like n8n and secure webhooks. That
keeps provider keys out of the repo and CI, and allows independent lifecycle
management of LLM credentials.
Comprobación CI ya implementada (sugerencia de bloqueo)

- El repo tiene `scripts/check-no-secrets.cjs` y un workflow `ci-quality.yml`.
  Se recomienda mantener esta comprobación y además añadir un job específico
  que bloquee la inclusión accidental de ficheros `.env` o `*.secret`.

Evidencia / Artefactos a crear

- Workflow GitHub Actions que falla si `.env` o `backend/.env` se introducen.
- Documentación (este archivo) y un script `scripts/list-required-secrets.cjs`
  (opcional) para generar inventario desde `env.ts`.

Siguiente paso recomendado: añadir validaciones CI (ya lo hago ahora) y crear
una tarea para migrar secretos de `backend` a GitHub Secret + vault en infra.
