# TASK-007: Auditoría de Dependencias Vulnerables

**PRIORIDAD:** ALTA  
**FASE:** 1 - Seguridad  
**DEPENDENCIAS:** Ninguna  
**TIEMPO ESTIMADO:** 2-3 horas

---

## CONTEXTO

Las dependencias npm pueden tener vulnerabilidades conocidas que comprometen la seguridad del proyecto. Actualmente NO hay proceso automatizado para detectar y actualizar dependencias vulnerables.

**HALLAZGO RELACIONADO:** SEC-DEPS-007 - Sin auditoría automatizada de dependencias

**RIESGO:** Vulnerabilidades en librerías de terceros pueden ser explotadas (XSS, RCE, DoS, etc.)

---

## OBJETIVO

Implementar sistema completo de auditoría de dependencias:

1. **Auditoría inicial** con `npm audit`
2. **Automatización** con GitHub Actions
3. **Dependabot** para actualizaciones automáticas
4. **Políticas** de aceptación de vulnerabilidades
5. **Documentación** de proceso de actualización

---

## INSTRUCCIONES DETALLADAS

### PASO 1: Auditoría Inicial

**Ejecutar auditoría:**

```bash
cd c:\Users\Usuario\Desktop\Web Puranatura\Pureza-Naturalis-V3
npm audit --production
```

**Interpretar resultados:**

```
found 3 vulnerabilities (1 moderate, 2 high)

Moderate: Prototype Pollution in lodash
Package: lodash
Dependency of: some-package
Path: some-package > lodash
More info: https://npmjs.com/advisories/1234
```

**Generar reporte completo:**

```bash
npm audit --json > reports/execution-2025-11-07/npm-audit-initial.json
npm audit > reports/execution-2025-11-07/npm-audit-initial.txt
```

---

### PASO 2: Resolver Vulnerabilidades Críticas/Altas

**Opción A: Actualización automática (preferida)**

```bash
npm audit fix
```

**Opción B: Actualización con breaking changes**

```bash
npm audit fix --force
```

⚠️ **ADVERTENCIA:** `--force` puede romper compatibilidad. Ejecutar tests después.

**Opción C: Manual (para casos específicos)**

```bash
# Ver qué versión corrige la vulnerabilidad
npm audit

# Actualizar paquete específico
npm update lodash@latest

# O especificar versión exacta
npm install lodash@4.17.21
```

---

### PASO 3: Verificar Compatibilidad

Después de cada actualización:

```bash
# Limpiar caché
npm clean-install

# Ejecutar tests
npm run test
npm run test:e2e

# Verificar builds
npm run build

# Ejecutar TypeScript check
npm run type-check

# Ejecutar linter
npm run lint
```

**Si hay errores:**

1. Revisar CHANGELOG del paquete actualizado
2. Adaptar código a nuevas APIs
3. Si no es viable, considerar paquete alternativo

---

### PASO 4: Configurar GitHub Actions - Auditoría Semanal

**Archivo:** `.github/workflows/dependency-audit.yml` (crear)

```yaml
name: Dependency Security Audit

on:
  schedule:
    # Ejecutar cada lunes a las 9 AM
    - cron: '0 9 * * 1'
  workflow_dispatch: # Permitir ejecución manual
  pull_request:
    paths:
      - 'package.json'
      - 'package-lock.json'
      - 'backend/package.json'
      - 'backend/package-lock.json'

jobs:
  audit:
    name: npm audit
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Audit Frontend
        id: audit-frontend
        continue-on-error: true
        run: |
          npm audit --production --audit-level=moderate --json > audit-frontend.json
          cat audit-frontend.json

      - name: Audit Backend
        id: audit-backend
        continue-on-error: true
        working-directory: backend
        run: |
          npm audit --production --audit-level=moderate --json > audit-backend.json
          cat audit-backend.json

      - name: Check for Critical/High Vulnerabilities
        run: |
          # Contar vulnerabilidades críticas/altas en frontend
          FRONTEND_CRITICAL=$(jq '.metadata.vulnerabilities.critical // 0' audit-frontend.json)
          FRONTEND_HIGH=$(jq '.metadata.vulnerabilities.high // 0' audit-frontend.json)
          
          # Contar en backend
          BACKEND_CRITICAL=$(jq '.metadata.vulnerabilities.critical // 0' backend/audit-backend.json)
          BACKEND_HIGH=$(jq '.metadata.vulnerabilities.high // 0' backend/audit-backend.json)
          
          TOTAL_CRITICAL=$((FRONTEND_CRITICAL + BACKEND_CRITICAL))
          TOTAL_HIGH=$((FRONTEND_HIGH + BACKEND_HIGH))
          
          echo "Critical: $TOTAL_CRITICAL"
          echo "High: $TOTAL_HIGH"
          
          # Fallar si hay críticas
          if [ $TOTAL_CRITICAL -gt 0 ]; then
            echo "❌ CRITICAL vulnerabilities found!"
            exit 1
          fi
          
          # Advertir si hay altas
          if [ $TOTAL_HIGH -gt 0 ]; then
            echo "⚠️ HIGH vulnerabilities found!"
            exit 1
          fi
          
          echo "✅ No critical/high vulnerabilities"

      - name: Upload Audit Results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: audit-reports
          path: |
            audit-frontend.json
            backend/audit-backend.json
          retention-days: 90

      - name: Create Issue on Failure
        if: failure()
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const frontendAudit = JSON.parse(fs.readFileSync('audit-frontend.json', 'utf8'));
            const backendAudit = JSON.parse(fs.readFileSync('backend/audit-backend.json', 'utf8'));
            
            const frontendCritical = frontendAudit.metadata?.vulnerabilities?.critical || 0;
            const frontendHigh = frontendAudit.metadata?.vulnerabilities?.high || 0;
            const backendCritical = backendAudit.metadata?.vulnerabilities?.critical || 0;
            const backendHigh = backendAudit.metadata?.vulnerabilities?.high || 0;
            
            const issueBody = `## 🚨 Security Audit Alert

**Fecha:** ${new Date().toISOString().split('T')[0]}

### Vulnerabilidades Detectadas

#### Frontend
- Critical: ${frontendCritical}
- High: ${frontendHigh}

#### Backend
- Critical: ${backendCritical}
- High: ${backendHigh}

### Acción Requerida

1. Revisar reportes en artifacts
2. Ejecutar \`npm audit fix\`
3. Verificar tests
4. Actualizar manualmente si es necesario

### Reportes Completos

Ver artifacts de este workflow run.

---
*Auto-generado por dependency-audit.yml*`;

            await github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: `🚨 Security Audit: ${frontendCritical + backendCritical} Critical, ${frontendHigh + backendHigh} High vulnerabilities`,
              body: issueBody,
              labels: ['security', 'dependencies']
            });
```

---

### PASO 5: Configurar Dependabot

**Archivo:** `.github/dependabot.yml` (crear)

```yaml
version: 2

updates:
  # Frontend dependencies
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
    open-pull-requests-limit: 10
    reviewers:
      - "team-leads" # Cambiar a tu usuario/equipo
    assignees:
      - "team-leads"
    commit-message:
      prefix: "deps"
      include: "scope"
    labels:
      - "dependencies"
      - "frontend"
    # Agrupar actualizaciones menores
    groups:
      development-dependencies:
        patterns:
          - "@types/*"
          - "@testing-library/*"
          - "vite-*"
          - "eslint-*"
          - "vitest"
        update-types:
          - "minor"
          - "patch"

  # Backend dependencies
  - package-ecosystem: "npm"
    directory: "/backend"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
    open-pull-requests-limit: 10
    reviewers:
      - "team-leads"
    assignees:
      - "team-leads"
    commit-message:
      prefix: "deps(backend)"
      include: "scope"
    labels:
      - "dependencies"
      - "backend"
    groups:
      development-dependencies:
        patterns:
          - "@types/*"
          - "vitest"
          - "tsx"
        update-types:
          - "minor"
          - "patch"

  # GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "monthly"
    commit-message:
      prefix: "ci"
    labels:
      - "dependencies"
      - "github-actions"
```

---

### PASO 6: Crear Script de Auditoría Local

**Archivo:** `scripts/audit-dependencies.js` (crear)

```javascript
/**
 * Script de auditoría completa de dependencias
 * 
 * Ejecuta auditorías en frontend y backend, genera reportes.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, cwd = process.cwd()) {
  try {
    return execSync(command, {
      cwd,
      encoding: 'utf8',
      stdio: 'pipe',
    });
  } catch (err) {
    return err.stdout || '';
  }
}

async function auditProject(name, directory) {
  log(`\n🔍 Auditando ${name}...`, 'cyan');

  const auditJson = runCommand('npm audit --json', directory);
  const auditResult = JSON.parse(auditJson);

  const { vulnerabilities } = auditResult.metadata || {};
  const critical = vulnerabilities?.critical || 0;
  const high = vulnerabilities?.high || 0;
  const moderate = vulnerabilities?.moderate || 0;
  const low = vulnerabilities?.low || 0;

  log(`\n📊 Resultados de ${name}:`, 'cyan');
  
  if (critical > 0) log(`   Critical: ${critical}`, 'red');
  if (high > 0) log(`   High: ${high}`, 'red');
  if (moderate > 0) log(`   Moderate: ${moderate}`, 'yellow');
  if (low > 0) log(`   Low: ${low}`, 'yellow');

  if (critical === 0 && high === 0 && moderate === 0 && low === 0) {
    log('   ✅ No vulnerabilities found!', 'green');
  }

  // Guardar reporte
  const reportDir = path.join(__dirname, '../reports/execution-2025-11-07');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = path.join(reportDir, `${name}-audit-${timestamp}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(auditResult, null, 2));
  log(`   📄 Reporte guardado: ${reportPath}`, 'cyan');

  return { critical, high, moderate, low };
}

async function main() {
  log('\n' + '='.repeat(60), 'cyan');
  log('🔐 AUDITORÍA DE DEPENDENCIAS', 'cyan');
  log('='.repeat(60) + '\n', 'cyan');

  const frontend = await auditProject('frontend', process.cwd());
  const backend = await auditProject('backend', path.join(process.cwd(), 'backend'));

  const totalCritical = frontend.critical + backend.critical;
  const totalHigh = frontend.high + backend.high;

  log('\n' + '='.repeat(60), 'cyan');
  log('📈 RESUMEN TOTAL', 'cyan');
  log('='.repeat(60) + '\n', 'cyan');

  log(`Critical: ${totalCritical}`, totalCritical > 0 ? 'red' : 'green');
  log(`High: ${totalHigh}`, totalHigh > 0 ? 'red' : 'green');
  log(`Moderate: ${frontend.moderate + backend.moderate}`, 'yellow');
  log(`Low: ${frontend.low + backend.low}`, 'yellow');

  if (totalCritical > 0 || totalHigh > 0) {
    log('\n⚠️ ACCIÓN REQUERIDA', 'red');
    log('Ejecuta: npm audit fix', 'yellow');
    process.exit(1);
  } else {
    log('\n✅ Proyecto seguro', 'green');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Error durante auditoría:', err);
  process.exit(1);
});
```

**Añadir a `package.json`:**

```json
{
  "scripts": {
    "audit:deps": "node scripts/audit-dependencies.js",
    "audit:fix": "npm audit fix && cd backend && npm audit fix"
  }
}
```

---

### PASO 7: Documentar Política de Vulnerabilidades

**Archivo:** `docs/DEPENDENCY_SECURITY_POLICY.md` (crear)

```markdown
# Política de Seguridad de Dependencias

## Niveles de Severidad

### Critical (Crítico)

**Acción:** INMEDIATA (dentro de 24 horas)

- Vulnerabilidades de ejecución remota de código (RCE)
- Inyección SQL sin sanitización
- Bypass de autenticación

**Proceso:**
1. Actualizar inmediatamente
2. Ejecutar tests completos
3. Deploy urgente si está en producción

### High (Alto)

**Acción:** URGENTE (dentro de 7 días)

- XSS sin mitigación
- CSRF en endpoints críticos
- Exposición de datos sensibles

**Proceso:**
1. Evaluar impacto en proyecto
2. Actualizar en siguiente sprint
3. Notificar a equipo

### Moderate (Moderado)

**Acción:** PROGRAMADA (dentro de 30 días)

- DoS con condiciones específicas
- Vulnerabilidades que requieren acceso privilegiado

**Proceso:**
1. Añadir a backlog
2. Actualizar en próximo release
3. Documentar en CHANGELOG

### Low (Bajo)

**Acción:** OPCIONAL (evaluar caso por caso)

- Información disclosure menor
- Vulnerabilidades teóricas

**Proceso:**
1. Evaluar si afecta al proyecto
2. Actualizar cuando sea conveniente
3. Puede posponerse si no aplica

---

## Excepciones

Si una actualización rompe funcionalidad crítica:

1. **Documentar excepción:**
   ```markdown
   ## Excepciones de Seguridad
   
   - **Paquete:** lodash@4.17.19
   - **Vulnerabilidad:** Prototype Pollution (CVE-2021-23337)
   - **Razón:** Breaking changes en v4.18+ rompen compatibilidad
   - **Mitigación:** Input sanitization implementado en capa de aplicación
   - **Fecha revisión:** 2025-12-01
   - **Aprobado por:** [nombre]
   ```

2. **Implementar mitigación alternativa**
3. **Revisar excepción mensualmente**

---

## Proceso de Actualización

### Actualizaciones Automáticas (Dependabot)

1. **PR creado automáticamente**
2. **CI ejecuta tests automáticamente**
3. **Si tests pasan → Merge permitido**
4. **Si tests fallan → Revisión manual**

### Actualizaciones Manuales

```bash
# 1. Auditar
npm run audit:deps

# 2. Intentar fix automático
npm run audit:fix

# 3. Verificar
npm run test
npm run test:e2e
npm run build

# 4. Commitear si todo OK
git add package*.json backend/package*.json
git commit -m "fix(deps): actualizar dependencias vulnerables"
```

---

## Monitoreo Continuo

### GitHub Actions

- **Semanal:** Auditoría automática cada lunes
- **PR:** Auditoría en cada cambio de package.json
- **Issue automático:** Si se detectan críticas/altas

### Dependabot

- **PRs semanales:** Actualizaciones de seguridad
- **Agrupadas:** Updates menores agrupadas
- **Revisión:** Team leads asignados

### Manual

```bash
# Ejecutar localmente antes de cada deploy
npm run audit:deps
```

---

## Recursos

- [npm audit docs](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [Snyk Vulnerability DB](https://snyk.io/vuln)
- [GitHub Advisory Database](https://github.com/advisories)
- [CVE Database](https://cve.mitre.org/)

---

*Última actualización: 2025-11-07*
```

---

### PASO 8: Crear Dashboard de Reporte

**Archivo:** `scripts/generate-audit-report.js` (crear)

```javascript
/**
 * Genera reporte HTML visual de auditoría
 */

const fs = require('fs');
const path = require('path');

function generateHtmlReport(frontendAudit, backendAudit) {
  const frontendVulns = frontendAudit.metadata?.vulnerabilities || {};
  const backendVulns = backendAudit.metadata?.vulnerabilities || {};

  const totalCritical = (frontendVulns.critical || 0) + (backendVulns.critical || 0);
  const totalHigh = (frontendVulns.high || 0) + (backendVulns.high || 0);
  const totalModerate = (frontendVulns.moderate || 0) + (backendVulns.moderate || 0);
  const totalLow = (frontendVulns.low || 0) + (backendVulns.low || 0);

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reporte de Auditoría de Dependencias</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 10px;
      margin-bottom: 30px;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .stat-card.critical { border-left: 5px solid #dc3545; }
    .stat-card.high { border-left: 5px solid #fd7e14; }
    .stat-card.moderate { border-left: 5px solid #ffc107; }
    .stat-card.low { border-left: 5px solid #28a745; }
    .stat-number {
      font-size: 48px;
      font-weight: bold;
      margin: 10px 0;
    }
    .stat-label {
      color: #666;
      font-size: 14px;
      text-transform: uppercase;
    }
    .section {
      background: white;
      padding: 30px;
      border-radius: 10px;
      margin-bottom: 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    th {
      background: #f8f9fa;
      font-weight: 600;
    }
    .badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .badge.critical { background: #dc3545; color: white; }
    .badge.high { background: #fd7e14; color: white; }
    .badge.moderate { background: #ffc107; color: black; }
    .badge.low { background: #28a745; color: white; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🔐 Reporte de Auditoría de Dependencias</h1>
    <p>Generado: ${new Date().toLocaleString()}</p>
  </div>

  <div class="stats">
    <div class="stat-card critical">
      <div class="stat-label">Critical</div>
      <div class="stat-number">${totalCritical}</div>
    </div>
    <div class="stat-card high">
      <div class="stat-label">High</div>
      <div class="stat-number">${totalHigh}</div>
    </div>
    <div class="stat-card moderate">
      <div class="stat-label">Moderate</div>
      <div class="stat-number">${totalModerate}</div>
    </div>
    <div class="stat-card low">
      <div class="stat-label">Low</div>
      <div class="stat-number">${totalLow}</div>
    </div>
  </div>

  <div class="section">
    <h2>Frontend</h2>
    <table>
      <tr>
        <th>Severidad</th>
        <th>Cantidad</th>
      </tr>
      <tr>
        <td><span class="badge critical">Critical</span></td>
        <td>${frontendVulns.critical || 0}</td>
      </tr>
      <tr>
        <td><span class="badge high">High</span></td>
        <td>${frontendVulns.high || 0}</td>
      </tr>
      <tr>
        <td><span class="badge moderate">Moderate</span></td>
        <td>${frontendVulns.moderate || 0}</td>
      </tr>
      <tr>
        <td><span class="badge low">Low</span></td>
        <td>${frontendVulns.low || 0}</td>
      </tr>
    </table>
  </div>

  <div class="section">
    <h2>Backend</h2>
    <table>
      <tr>
        <th>Severidad</th>
        <th>Cantidad</th>
      </tr>
      <tr>
        <td><span class="badge critical">Critical</span></td>
        <td>${backendVulns.critical || 0}</td>
      </tr>
      <tr>
        <td><span class="badge high">High</span></td>
        <td>${backendVulns.high || 0}</td>
      </tr>
      <tr>
        <td><span class="badge moderate">Moderate</span></td>
        <td>${backendVulns.moderate || 0}</td>
      </tr>
      <tr>
        <td><span class="badge low">Low</span></td>
        <td>${backendVulns.low || 0}</td>
      </tr>
    </table>
  </div>

  <div class="section">
    <h2>Recomendaciones</h2>
    <ul>
      ${totalCritical > 0 ? '<li><strong>URGENTE:</strong> Actualizar dependencias con vulnerabilidades críticas</li>' : ''}
      ${totalHigh > 0 ? '<li><strong>Prioritario:</strong> Resolver vulnerabilidades altas en 7 días</li>' : ''}
      ${totalModerate > 0 ? '<li>Programar actualización de vulnerabilidades moderadas</li>' : ''}
      ${totalCritical === 0 && totalHigh === 0 ? '<li>✅ No hay vulnerabilidades críticas ni altas</li>' : ''}
      <li>Ejecutar <code>npm audit fix</code> para actualizaciones automáticas</li>
      <li>Revisar dependabot PRs pendientes</li>
    </ul>
  </div>
</body>
</html>`;

  const reportPath = path.join(__dirname, '../reports/execution-2025-11-07/audit-report.html');
  fs.writeFileSync(reportPath, html);
  console.log(`✅ Reporte HTML generado: ${reportPath}`);
}

// Ejecutar
const frontendAudit = JSON.parse(fs.readFileSync('audit-frontend.json', 'utf8'));
const backendAudit = JSON.parse(fs.readFileSync('backend/audit-backend.json', 'utf8'));

generateHtmlReport(frontendAudit, backendAudit);
```

---

## VALIDACIÓN

### ✅ Criterios de Aceptación

1. **Auditoría inicial:**
   - [ ] Ejecutada y documentada
   - [ ] Vulnerabilidades críticas/altas resueltas
   - [ ] Tests pasando tras actualizaciones

2. **Automatización:**
   - [ ] GitHub Action configurada
   - [ ] Dependabot activo
   - [ ] Issues automáticas funcionando

3. **Documentación:**
   - [ ] Política de seguridad documentada
   - [ ] Scripts de auditoría creados
   - [ ] Proceso de actualización claro

### 🧪 Tests de Validación

```bash
# Auditoría local
npm run audit:deps

# Verificar workflow
git add .github/workflows/dependency-audit.yml
git commit -m "ci: añadir auditoría de dependencias"
git push

# Verificar Dependabot (en GitHub UI)
# Settings > Security > Dependabot

# Generar reporte HTML
npm audit --json > audit-frontend.json
cd backend && npm audit --json > audit-backend.json
cd .. && node scripts/generate-audit-report.js
# Abrir reports/execution-2025-11-07/audit-report.html
```

### 📊 Métricas de Éxito

- **Auditoría:** 0 vulnerabilidades críticas/altas
- **Automatización:** Workflow ejecutándose semanalmente
- **Dependabot:** PRs creándose automáticamente
- **Tiempo respuesta:** <24h para críticas, <7d para altas

---

## NOTAS IMPORTANTES

### ⚠️ Avisos

1. **False positives:** Algunas vulnerabilidades pueden no aplicar al proyecto
2. **Breaking changes:** Actualizaciones mayores requieren testing exhaustivo
3. **Dependencias dev:** Vulnerabilidades en devDependencies son menos críticas

### 🔗 Dependencias

- **Requiere:** Acceso a GitHub (para Actions/Dependabot)
- **Habilita:** Seguridad continua de dependencias

### 📦 Entregables

- `.github/workflows/dependency-audit.yml`
- `.github/dependabot.yml`
- `scripts/audit-dependencies.js`
- `scripts/generate-audit-report.js`
- `docs/DEPENDENCY_SECURITY_POLICY.md`
- `reports/execution-2025-11-07/npm-audit-initial.json`

---

**FIN DE INSTRUCCIONES TASK-007**
