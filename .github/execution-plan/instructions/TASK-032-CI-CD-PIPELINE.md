# TASK-032: CI/CD Pipeline

## 📋 INFORMACIÓN

**ID**: TASK-032 | **Fase**: 3 | **Prioridad**: ALTA | **Estimación**: 4h

## 🎯 OBJETIVO

Implementar GitHub Actions para CI/CD automatizado: testing, build, deployment y rollback.

## 🛠️ IMPLEMENTACIÓN

### Paso 1: CI Workflow Principal

**Archivo**: `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  NODE_VERSION: '18'

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Type check
        run: npm run type-check

  test-unit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:unit -- --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          files: ./coverage/coverage-final.json

  test-e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/

  build:
    needs: [lint, test-unit, test-e2e]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build frontend
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
      
      - name: Build backend
        run: npm run build:backend
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: |
            dist/
            backend/dist/

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'
      
      - name: Upload Trivy results to GitHub Security
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'
```

### Paso 2: CD Workflow

**Archivo**: `.github/workflows/deploy.yml`

```yaml
name: Deploy

on:
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: ${{ github.event.inputs.environment || 'staging' }}
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
          VITE_CDN_URL: ${{ secrets.VITE_CDN_URL }}
      
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2
        with:
          publish-dir: './dist'
          production-deploy: ${{ github.event.inputs.environment == 'production' }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
      
      - name: Deploy backend to Railway
        run: |
          npm install -g railway
          railway up --service backend
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
      
      - name: Run smoke tests
        run: |
          sleep 30
          npm run test:smoke -- --url ${{ secrets.DEPLOY_URL }}
      
      - name: Notify deployment
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "Deployment to ${{ github.event.inputs.environment }} completed",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "✅ *Deployment successful*\nEnvironment: ${{ github.event.inputs.environment }}\nCommit: ${{ github.sha }}"
                  }
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### Paso 3: Rollback Workflow

**Archivo**: `.github/workflows/rollback.yml`

```yaml
name: Rollback

on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to rollback'
        required: true
        type: choice
        options:
          - staging
          - production
      commit_sha:
        description: 'Commit SHA to rollback to'
        required: true

jobs:
  rollback:
    runs-on: ubuntu-latest
    environment: ${{ github.event.inputs.environment }}
    steps:
      - uses: actions/checkout@v3
        with:
          ref: ${{ github.event.inputs.commit_sha }}
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
      
      - name: Deploy rollback to Netlify
        uses: nwtgck/actions-netlify@v2
        with:
          publish-dir: './dist'
          production-deploy: true
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Rollback to ${{ github.event.inputs.commit_sha }}"
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
      
      - name: Notify rollback
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "⚠️ Rollback to commit ${{ github.event.inputs.commit_sha }} completed"
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### Paso 4: Smoke Tests

**Archivo**: `scripts/smoke-tests.sh`

```bash
#!/bin/bash

URL="${1:-http://localhost:3000}"

echo "🧪 Running smoke tests against $URL"

# Test homepage
echo "Testing homepage..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$URL")
if [ "$STATUS" -ne 200 ]; then
  echo "❌ Homepage failed: $STATUS"
  exit 1
fi
echo "✅ Homepage OK"

# Test API health
echo "Testing API health..."
API_URL="${URL/3000/3001}/health"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL")
if [ "$STATUS" -ne 200 ]; then
  echo "❌ API health check failed: $STATUS"
  exit 1
fi
echo "✅ API health OK"

# Test products endpoint
echo "Testing products endpoint..."
PRODUCTS_URL="${URL/3000/3001}/api/products"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$PRODUCTS_URL")
if [ "$STATUS" -ne 200 ]; then
  echo "❌ Products endpoint failed: $STATUS"
  exit 1
fi
echo "✅ Products endpoint OK"

echo "✅ All smoke tests passed"
```

### Paso 5: Dependabot Configuration

**Archivo**: `.github/dependabot.yml`

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    reviewers:
      - "your-username"
    assignees:
      - "your-username"
    commit-message:
      prefix: "chore"
      prefix-development: "chore"
      include: "scope"
    ignore:
      - dependency-name: "*"
        update-types: ["version-update:semver-major"]
```

### Paso 6: PR Template

**Archivo**: `.github/pull_request_template.md`

```markdown
## Description

<!-- Describe your changes -->

## Type of change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Checklist

- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published

## Screenshots (if applicable)

## Testing

<!-- How should this be tested? -->

## Related Issues

<!-- Link to related issues -->
Fixes #
```

### Paso 7: Release Workflow

**Archivo**: `.github/workflows/release.yml`

```yaml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - name: Generate changelog
        id: changelog
        uses: metcalfc/changelog-generator@v4
        with:
          myToken: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Create Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          body: ${{ steps.changelog.outputs.changelog }}
          draft: false
          prerelease: false
      
      - name: Deploy to production
        uses: ./.github/workflows/deploy.yml
        with:
          environment: production
```

### Paso 8: Caching Strategy

**Archivo**: `.github/workflows/cache.yml`

```yaml
# Example of aggressive caching
- name: Cache node modules
  uses: actions/cache@v3
  with:
    path: |
      ~/.npm
      node_modules
      */*/node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-

- name: Cache Playwright browsers
  uses: actions/cache@v3
  with:
    path: ~/.cache/ms-playwright
    key: ${{ runner.os }}-playwright-${{ hashFiles('**/package-lock.json') }}

- name: Cache build
  uses: actions/cache@v3
  with:
    path: dist
    key: ${{ runner.os }}-build-${{ github.sha }}
```

## ✅ CRITERIOS DE ACEPTACIÓN

- [x] CI workflow completo
- [x] CD automatizado
- [x] Rollback strategy
- [x] Smoke tests
- [x] Security scanning
- [x] Dependabot configurado
- [x] PR template
- [x] Release automation

## 🧪 VALIDACIÓN

```bash
# Trigger CI locally
act push

# Test smoke tests
bash scripts/smoke-tests.sh http://localhost:3000

# Manual deployment
gh workflow run deploy.yml -f environment=staging

# Manual rollback
gh workflow run rollback.yml -f environment=staging -f commit_sha=abc123
```

---

**Status**: COMPLETO ✅
