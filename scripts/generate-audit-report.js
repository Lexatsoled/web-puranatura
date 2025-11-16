import fs from 'node:fs';
import path from 'node:path';

const ISO_DATE = new Date().toISOString().slice(0, 10);
const OUTPUT_DIR =
  process.argv.includes('--output') && process.argv[process.argv.indexOf('--output') + 1]
    ? process.argv[process.argv.indexOf('--output') + 1]
    : `reports/execution-${ISO_DATE}`;

const FRONTEND_PATH = process.argv.includes('--frontend')
  ? process.argv[process.argv.indexOf('--frontend') + 1]
  : path.join(OUTPUT_DIR, 'npm-audit-frontend.json');

const BACKEND_PATH = process.argv.includes('--backend')
  ? process.argv[process.argv.indexOf('--backend') + 1]
  : path.join(OUTPUT_DIR, 'npm-audit-backend.json');

const TARGET_PATH = path.join(OUTPUT_DIR, 'audit-report.html');

const loadJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));

const formatRow = (label, value, badgeClass) =>
  `<tr><td><span class="badge ${badgeClass}">${label}</span></td><td>${value}</td></tr>`;

const buildTable = (metadata = {}) =>
  [
    formatRow('Critical', metadata.critical || 0, 'critical'),
    formatRow('High', metadata.high || 0, 'high'),
    formatRow('Moderate', metadata.moderate || 0, 'moderate'),
    formatRow('Low', metadata.low || 0, 'low'),
  ].join('\n');

const renderSection = (title, metadata) => `
  <div class="section">
    <h2>${title}</h2>
    <table>
      <tr><th>Severidad</th><th>Cantidad</th></tr>
      ${buildTable(metadata)}
    </table>
  </div>`;

const frontendAudit = loadJson(FRONTEND_PATH);
const backendAudit = loadJson(BACKEND_PATH);

const frontendVulns = frontendAudit.metadata?.vulnerabilities || frontendAudit.vulnerabilities || {};
const backendVulns = backendAudit.metadata?.vulnerabilities || backendAudit.vulnerabilities || {};

const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Reporte de Auditoría de Dependencias</title>
  <style>
    body { font-family: 'Inter', Arial, sans-serif; background: #f8fafc; margin: 0; padding: 40px; color: #0f172a; }
    h1 { margin-bottom: 0.25rem; }
    p { margin-top: 0; color: #475569; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
    .section { background: #fff; border-radius: 16px; padding: 24px; box-shadow: 0 10px 40px rgba(15, 23, 42, 0.08); }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    th, td { padding: 12px 0; border-bottom: 1px solid #e2e8f0; text-align: left; }
    .badge { padding: 4px 10px; border-radius: 12px; color: #fff; font-size: 0.75rem; font-weight: 600; }
    .critical { background: #be123c; }
    .high { background: #dc2626; }
    .moderate { background: #ea580c; }
    .low { background: #16a34a; }
    ul { padding-left: 20px; }
    li { margin-bottom: 0.35rem; }
  </style>
</head>
<body>
  <h1>Auditoría de Dependencias</h1>
  <p>Reporte generado el ${new Date().toLocaleString('es-ES')}</p>
  <div class="grid">
    ${renderSection('Frontend', frontendVulns)}
    ${renderSection('Backend', backendVulns)}
  </div>
  <div class="section">
    <h2>Recomendaciones</h2>
    <ul>
      ${
        backendVulns.critical > 0 || frontendVulns.critical > 0
          ? '<li><strong>URGENTE:</strong> Resolver vulnerabilidades críticas en menos de 24 horas.</li>'
          : '<li>No se detectaron vulnerabilidades críticas.</li>'
      }
      ${
        backendVulns.high > 0 || frontendVulns.high > 0
          ? '<li><strong>Prioritario:</strong> Resolver vulnerabilidades altas en menos de 7 días.</li>'
          : '<li>No se detectaron vulnerabilidades altas.</li>'
      }
      <li>Ejecutar <code>npm audit fix</code> de forma regular.</li>
      <li>Monitorear dependabot para nuevas actualizaciones.</li>
    </ul>
  </div>
</body>
</html>`;

fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.writeFileSync(TARGET_PATH, html, 'utf8');
console.log(`Reporte HTML guardado en ${TARGET_PATH}`);