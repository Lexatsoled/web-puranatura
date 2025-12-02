#!/usr/bin/env node
/*
 * Simple drift checker between GPT-51-Codex-Max/api/openapi.yaml (paths)
 * and backend route implementations under backend/src/routes.
 *
 * Behaviour:
 * - Parses openapi.yaml to collect declared paths and methods (lightweight regex parsing)
 * - Scans backend/src/routes/index.ts to discover mounted routers and their files
 * - Scans each router file for router.<method>(path) invocations
 * - Normalizes route patterns (express :param -> {param}) for comparison
 * - Emits a short report: missing-in-backend, missing-in-openapi
 *
 * This script is intentionally dependency-free (no extra npm install) and
 * conservative — it will report possible drifts to be reviewed manually.
 */

const fs = require('fs');
const path = require('path');

const repoRoot = process.cwd();
const specPath = path.join(repoRoot, 'GPT-51-Codex-Max', 'api', 'openapi.yaml');
const routesIndex = path.join(repoRoot, 'backend', 'src', 'routes', 'index.ts');

function readSpecPaths() {
  const content = fs.readFileSync(specPath, 'utf8');
  const lines = content.split(/\r?\n/);

  // locate 'paths:' start
  const start = lines.findIndex((l) => /^paths:\s*$/.test(l));
  if (start === -1) return new Map();

  const paths = new Map();

  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i];
    // end of paths block if another top-level key starts (no indent)
    if (/^\S/.test(line)) break;

    // match a path key like '  /api/foo:{' or '  /api/foo: '
    // Only match YAML path keys that begin with a forward slash (e.g. '/api/...')
    const m = line.match(/^\s{2,}(\/[^:]+):\s*$/);
    if (m) {
      const p = m[1].trim();
      // gather methods under this path
      const methods = new Set();
      let j = i + 1;
      for (; j < lines.length; j++) {
        const l2 = lines[j];
        if (/^\s{2,}[^\s]/.test(l2)) {
          // still same-level path continuation? if it's another path key, break
          if (/^\s{2,}\//.test(l2)) break;
        }
        const mm = l2.match(
          /^\s{4,}(get|post|put|delete|patch|head|options):\s*$/i
        );
        if (mm) methods.add(mm[1].toLowerCase());
        // if we step out to top-level block, stop
        if (
          /^\s{2,}[^\s]/.test(l2) &&
          /^\s{2,}\S/.test(l2) &&
          /^\s{2,}\//.test(l2)
        )
          break;
      }
      paths.set(normalizeSpecPath(p), methods);
    }
  }

  return paths;
}

function normalizeSpecPath(p) {
  // convert :param style to {param} canonical form for comparison
  return p.replace(/:([a-zA-Z_][\w-]*)/g, '{$1}');
}

function findMountedRouters() {
  if (!fs.existsSync(routesIndex)) return [];
  const content = fs.readFileSync(routesIndex, 'utf8');
  const lines = content.split(/\r?\n/);
  const imports = new Map();
  // capture imports like: import ordersRouter from './orders';
  for (const l of lines) {
    const m = l.match(/import\s+([\w_$]+)\s+from\s+['"](\.[^'"]+)['"]/);
    if (m) imports.set(m[1], m[2]);
  }

  const mounts = [];
  // capture app.use('/api/orders', ordersRouter);
  for (const l of lines) {
    const m2 = l.match(/app\.use\(\s*['\"]([^'\"]+)['\"]\s*,\s*([\w_$]+)/);
    if (m2) {
      const [_, prefix, varName] = m2;
      const importPath = imports.get(varName);
      mounts.push({ prefix, varName, importPath });
    }
  }

  // also capture app.get('/api/health', ...) cases
  const direct = [];
  for (const l of lines) {
    const d = l.match(
      /app\.(get|post|put|delete|patch)\(\s*['\"]([^'\"]+)['\"]/
    );
    if (d) direct.push({ method: d[1].toLowerCase(), path: d[2] });
  }

  return { mounts, direct };
}

function scanRouterFile(relImport) {
  // relImport like './orders' — resolve to file under backend/src/routes
  const base = path.join(repoRoot, 'backend', 'src', 'routes');
  let full = path.join(base, relImport + '.ts');
  if (!fs.existsSync(full)) {
    full = path.join(base, relImport, 'index.ts');
  }
  if (!fs.existsSync(full)) return [];
  const content = fs.readFileSync(full, 'utf8');
  const methods = [];

  // look for router.get('...', ..) or router.post('/foo', ...)
  const routerCalls = content.matchAll(
    /router\.(get|post|put|delete|patch|head|options)\(\s*(['\"])([^'\"]+)\2/gi
  );
  for (const m of routerCalls) {
    const method = m[1].toLowerCase();
    let p = m[3];
    // convert express style :id to {id}
    p = p.replace(/:([a-zA-Z_][\w-]*)/g, '{$1}');
    // normalize trailing slashes
    if (p.endsWith('/')) p = p.slice(0, -1);
    // router '/' should be empty suffix
    methods.push({ method, path: p });
  }

  return methods;
}

function collectBackendPaths() {
  const { mounts, direct } = findMountedRouters();
  const backendPaths = new Map();

  // include direct app.<method> paths
  for (const d of direct) {
    const norm = d.path.replace(/:([a-zA-Z_][\w-]*)/g, '{$1}');
    if (!backendPaths.has(norm)) backendPaths.set(norm, new Set());
    backendPaths.get(norm).add(d.method);
  }

  for (const m of mounts) {
    const importPath = m.importPath || '';
    const scanned = scanRouterFile(importPath);
    for (const s of scanned) {
      let fullPath = m.prefix.replace(/\/$/, '');
      let suffix = s.path || '';
      if (suffix === '' || suffix === '/') {
        // base path
        const p = fullPath || '/';
        if (!backendPaths.has(p)) backendPaths.set(p, new Set());
        backendPaths.get(p).add(s.method);
      } else {
        // ensure joining
        if (!suffix.startsWith('/')) suffix = '/' + suffix;
        const joined = (fullPath + suffix).replace(/\/+/g, '/');
        const p = joined.replace(/:([a-zA-Z_][\w-]*)/g, '{$1}');
        if (!backendPaths.has(p)) backendPaths.set(p, new Set());
        backendPaths.get(p).add(s.method);
      }
    }
  }

  return backendPaths;
}

function compare(specPaths, backendPaths) {
  const missingInBackend = [];
  const missingInSpec = [];

  // for each spec path + method
  for (const [p, methods] of specPaths.entries()) {
    for (const method of methods) {
      const backendMethods = backendPaths.get(p);
      if (!backendMethods || !backendMethods.has(method)) {
        missingInBackend.push({ path: p, method });
      }
    }
  }

  // for each backend path + method check missing in spec
  for (const [p, methods] of backendPaths.entries()) {
    for (const method of methods) {
      const specMethods = specPaths.get(p) || new Set();
      if (!specMethods.has(method)) {
        missingInSpec.push({ path: p, method });
      }
    }
  }

  return { missingInBackend, missingInSpec };
}

function printReport(report) {
  console.log('\nOpenAPI ↔ Backend drift check report');
  console.log('=====================================\n');
  if (
    report.missingInBackend.length === 0 &&
    report.missingInSpec.length === 0
  ) {
    console.log(
      'No drift found: OpenAPI and backend routes are aligned (based on scanned files).'
    );
    return 0;
  }

  if (report.missingInBackend.length) {
    console.log('Paths defined in OpenAPI but MISSING in backend:');
    for (const i of report.missingInBackend)
      console.log(`  - ${i.method.toUpperCase()} ${i.path}`);
  } else {
    console.log('No OpenAPI-only paths found.');
  }

  if (report.missingInSpec.length) {
    console.log('\nPaths present in backend but MISSING in OpenAPI:');
    for (const i of report.missingInSpec)
      console.log(`  - ${i.method.toUpperCase()} ${i.path}`);
  } else {
    console.log('\nNo backend-only paths found.');
  }

  // exit non-zero to mark drift
  return 2;
}

function main() {
  if (!fs.existsSync(specPath)) {
    console.error('OpenAPI spec not found at', specPath);
    process.exit(1);
  }

  const specPaths = readSpecPaths();
  const backendPaths = collectBackendPaths();

  const report = compare(specPaths, backendPaths);
  const code = printReport(report);
  process.exit(code);
}

main();
