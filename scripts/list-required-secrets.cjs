#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Scans repository files for environment variable usage and prints a de-duped
// list of candidate secret names to stdout and optional file.

const root = process.cwd();
const include = ['backend', 'src', 'vite.config.ts', 'scripts', 'README.md'];

const envRegexes = [
  /process\.env\.([A-Z0-9_]+)/g,
  /process\.env\[['"]([A-Z0-9_]+)['"]\]/g,
  /import\.meta\.env\.([A-Z0-9_]+)/g,
  /loadEnv\(.*\)\s*;?\s*.*?\['([A-Z0-9_]+)'\]/g,
  /API_KEY|JWT_SECRET|JWT_REFRESH_SECRET|DATABASE_URL|SENTRY_DSN|REDIS_PASSWORD/g,
];

function walk(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (['node_modules', '.git', 'coverage', 'dist'].includes(e.name)) continue;
      walk(p, files);
    } else {
      files.push(p);
    }
  }
  return files;
}

const filesToScan = [];
for (const p of include) {
  const full = path.join(root, p);
  if (fs.existsSync(full)) {
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walk(full, filesToScan);
    } else {
      filesToScan.push(full);
    }
  }
}

const found = new Set();
for (const file of filesToScan) {
  try {
    const txt = fs.readFileSync(file, 'utf8');
    for (const rx of envRegexes) {
      let m;
      while ((m = rx.exec(txt))) {
        if (m[1]) found.add(m[1]);
        else if (m[0]) {
          // capture direct names from the last regex
          const parts = m[0].match(/[A-Z0-9_]{3,}/g);
          if (parts) parts.forEach(p => found.add(p));
        }
      }
    }
  } catch (err) {
    // ignore read errors
  }
}

const arr = [...found].sort();
const outPath = path.join(root, '.github', 'required-secrets.yml');
console.log('# Detected environment variable candidates:');
arr.forEach(i => console.log('- ' + i));

if (process.argv.includes('--write')) {
  fs.writeFileSync(outPath, arr.map(i => '- ' + i).join('\n') + '\n');
  console.log('\nWrote ' + outPath);
}
