# PuraNatura - AI Studio App

This project contains everything you need to run your app locally.

## Project Architecture

The project follows a unified structure for better maintainability and scalability.

### Directory Structure

- **`src/components`**: Contains all React components.
  - **`auth`**: Authentication forms (`LoginForm`, `RegisterForm`, `ForgotPasswordForm`).
  - **`icons`**: Centralized icon library (`index.tsx`).
  - **`legacy_root`**: Components migrated from the root `components` folder (in process of refactoring).
  - **`layout`**: Layout components like `SimpleLayout`.
- **`backend`**: Express.js backend application.
  - **`src/routes`**: API endpoints.
  - **`src/middleware`**: Security and utility middleware.
  - **`prisma`**: Database schema and seeds.
- **`pages`**: Top-level page components (Lazy loaded in `App.tsx`).

### Key Features

- **Icon System**: Centralized SVG icons in `src/components/icons` to avoid inline SVG duplication and reduce bundle size.
- **Security**:
  - IP Anonymization in Analytics.
  - CSP with strict directives.
  - Trust Proxy configuration for secure deployment behind proxies.
  - Cookie Consent Banner for GDPR compliance.

## Run Locally

**Prerequisites:** Node.js

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure Environment:**
   Copy `.env.local.sample` to `.env.local` and set the required secrets.

   > **Note:** This project does not include built-in LLM provider keys. Add any provider credentials to `.env.local` and never commit secrets to the repo.

3. **Verify Code Quality:**

   ```bash
   npm run lint
   # Optional: Run tests
   npm run test:ci
   ```

4. **Start the App:**

   ```bash
   npm run dev
   ```

   **Dev Note:** The backend will attempt to auto-seed the database if empty. Fallback data is available if the database is unreachable.

## Security & Compliance

- **Secrets Migration**: See `docs/secrets-migration.md`.
- **Scanning**: The project uses `Trivy` and `Gitleaks` to prevent secret commits.
  ```bash
  npm run check:forbidden-artifacts
  ```
- **Performance**: Optimize images in `public/` to WebP.
  ```bash
  npm run optimize-images
  ```
- **Accessibility**: Run Lighthouse and Axe audits.
  ```bash
  npm run a11y
  ```
- **Dependabot**: A workflow is included to handle high/critical alerts.

# Web Puranatura - Terapias Naturales

Proyecto Fullstack (React + Node.js) para PuraNatura.

## 🚀 Inicio Rápido

**¡Importante!** La arquitectura ha cambiado. Ahora requiere Docker.
Consulta la [Guía de Arranque (STARTUP_GUIDE.md)](./STARTUP_GUIDE.md) para instrucciones detalladas.

```bash
# Versión corta:
docker-compose up -d
npm run dev
```

## Quality Gates

- **CI Pipeline**: Runs `npm run perf:web` and `npm run a11y` to ensure performance and accessibility standards.
- **Pre-commit Hooks**: Husky + lint-staged are configured to enforce formatting before commits.

## Troubleshooting

- **Windows Users**: If you encounter EPERM errors with `npm ci`, use the provided repair scripts in `scripts/`.
- **NPM Issues**: See `HOW_TO_ENABLE_NPM.md` if working in restricted environments.
