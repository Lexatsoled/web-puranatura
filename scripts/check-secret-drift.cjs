#!/usr/bin/env node
/**
 * check-secret-drift
 * Busca patrones de secretos fuera de la carpeta Secretos/ y avisa si faltan archivos requeridos.
 * Fallará (exit 1) solo cuando detecte posibles secretos en el repo fuera de Secretos/.
 *
 * Uso:
 *   node scripts/check-secret-drift.cjs
 *   node scripts/check-secret-drift.cjs --warn-missing   (warnings si faltan requeridos, no falla)
 */
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const secretDir = path.join(repoRoot, 'Secretos');
const requiredFile = path.join(secretDir, '.required.json');
const requiredExample = path.join(
  repoRoot,
  'Plan-mejora',
  'Secretos',
  '.required.example.json'
);
const patternsFile = path.join(repoRoot, 'scripts', 'patterns', 'secrets.json');
const patternsExample = path.join(
  repoRoot,
  'Plan-mejora',
  'scripts',
  'patterns',
  'secrets.example.json'
);

const argv = process.argv.slice(2);
const warnMissing = argv.includes('--warn-missing');

const EXCLUDES = [
  'Secretos/',
  'node_modules/',
  'backend/node_modules/',
  'dist/',
  'backend/dist/',
  'public/optimized/',
  'coverage/',
  'backend/coverage/',
  'reports/',
  'tmp/',
  'tmp-artifacts-19719589763/',
  'tmp-ci-artifacts/',
  '.lighthouseci/',
  '.lighthouse-temp/',
  '.lighthouse-tmp/',
];

const MAX_BYTES = 2 * 1024 * 1024; // saltar archivos grandes

const DEFAULT_PATTERNS = [
  '(?i)AKIA[0-9A-Z]{16}',
  '(?i)ASIA[0-9A-Z]{16}',
  '(?i)ghp_[A-Za-z0-9]{36,}',
  '(?i)pat_[A-Za-z0-9]{20,}',
  '(?i)eyJ[A-Za-z0-9_-]{10,}\\.[A-Za-z0-9_-]{10,}\\.[A-Za-z0-9_-]{10,}', // JWT
  '(?i)(postgres|mysql|mariadb|mongodb)://[^\\s]+:[^\\s]+@[^\\s]+', // DSN con user:pass
  '(?i)Bearer\\s+[A-Za-z0-9._-]{20,}', // Bearer tokens
  '-----BEGIN (?:RSA |EC )?PRIVATE KEY-----',
];

function loadJSONSafe(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn(
      `[check-secret-drift] No se pudo leer ${filePath}: ${err.message}`
    );
  }
  return null;
}

function loadRequired() {
  const fromMain = loadJSONSafe(requiredFile);
  if (fromMain?.required)
    return { list: fromMain.required, source: requiredFile };
  const fromExample = loadJSONSafe(requiredExample);
  if (fromExample?.required)
    return {
      list: fromExample.required,
      source: requiredExample,
      example: true,
    };
  return { list: [], source: null };
}

function loadPatterns() {
  const fromMain = loadJSONSafe(patternsFile);
  if (fromMain?.patterns) return fromMain;
  const fromExample = loadJSONSafe(patternsExample);
  if (fromExample?.patterns) return fromExample;
  return { patterns: DEFAULT_PATTERNS, allowlist: [] };
}

function isExcluded(relPath) {
  const normalized = relPath.replace(/\\/g, '/');
  return EXCLUDES.some((prefix) => normalized.startsWith(prefix));
}

function collectFiles(startDir) {
  const files = [];
  const stack = [startDir];
  while (stack.length) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      const rel = path.relative(repoRoot, full).replace(/\\/g, '/');
      if (isExcluded(rel)) continue;
      if (entry.isDirectory()) {
        stack.push(full);
      } else if (entry.isFile()) {
        files.push({ full, rel });
      }
    }
  }
  return files;
}

function compilePatterns(patterns) {
  const compiled = [];
  for (const raw of patterns) {
    try {
      let flags = 'g';
      let pattern = raw;
      if (pattern.startsWith('(?i)')) {
        flags += 'i';
        pattern = pattern.replace(/^\(\?i\)/, '');
      }
      compiled.push(new RegExp(pattern, flags));
    } catch (err) {
      console.warn(
        `[check-secret-drift] Patrón inválido '${raw}': ${err.message}`
      );
    }
  }
  return compiled;
}

function scanFile(file, regexes) {
  const matches = [];
  const stats = fs.statSync(file.full);
  if (stats.size > MAX_BYTES) return matches; // evitar archivos grandes
  let content;
  try {
    content = fs.readFileSync(file.full, 'utf8');
  } catch {
    return matches;
  }
  for (const rx of regexes) {
    rx.lastIndex = 0;
    if (rx.test(content)) {
      matches.push(rx.source);
    }
  }
  return matches;
}

function main() {
  const required = loadRequired();
  const { patterns, allowlist = [] } = loadPatterns();
  const regexes = compilePatterns(patterns);

  // 1) Verificar carpeta Secretos
  if (!fs.existsSync(secretDir)) {
    console.warn(
      `[check-secret-drift] La carpeta Secretos/ no existe. Créala en la raíz (gitignored) para continuar.`
    );
  }

  // 2) Verificar archivos requeridos (warning)
  if (required.list.length > 0) {
    const missing = required.list.filter(
      (name) => !fs.existsSync(path.join(secretDir, name))
    );
    if (missing.length > 0) {
      const msg = `[check-secret-drift] Faltan archivos requeridos en Secretos/: ${missing.join(
        ', '
      )}`;
      if (warnMissing) {
        console.warn(msg);
      } else {
        console.warn(`${msg} (warning; no bloquea)`);
      }
    }
  }

  // 3) Escanear repo en busca de posibles secretos fuera de Secretos/
  const files = collectFiles(repoRoot);
  const findings = [];
  for (const file of files) {
    const normalizedRel = file.rel.replace(/\\/g, '/');
    if (allowlist.some((prefix) => normalizedRel.startsWith(prefix))) continue;
    const m = scanFile(file, regexes);
    if (m.length > 0) {
      findings.push({ file: file.rel, patterns: [...new Set(m)] });
    }
  }

  if (findings.length > 0) {
    console.error(
      '[check-secret-drift] Posibles secretos detectados fuera de Secretos/:'
    );
    findings.forEach((f) => {
      console.error(`  - ${f.file} (patrones: ${f.patterns.join(', ')})`);
    });
    console.error(
      'Mueve estos secretos a Secretos/ (gitignored) y/o rotalos si se filtraron. Revisa patrones en scripts/patterns/secrets.json.'
    );
    process.exit(1);
  }

  console.log(
    '[check-secret-drift] OK — No se detectaron secretos fuera de Secretos/.'
  );
}

main();
