#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Basic license checker: scans package-lock.json for licenses and fails if any
// dependency uses a license outside the project's allowlist.

const ALLOWLIST = new Set([
  'MIT',
  'Apache-2.0',
  '0BSD',
  'BSD',
  'BSD-2-Clause',
  'BSD-3-Clause',
  'BlueOak-1.0.0',
  'CC-BY-4.0',
  'CC0-1.0',
  'ISC',
  'MIT-0',
  'Python-2.0',
  'Unlicense',
  'W3C-20150513',
]);

function readLock(file) {
  if (!fs.existsSync(file))
    throw new Error('No package-lock.json found at ' + file);
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function collectDeps(lock) {
  const deps = new Map();

  function walk(obj) {
    if (!obj || typeof obj !== 'object') return;
    if (obj.dependencies && typeof obj.dependencies === 'object') {
      for (const [name, info] of Object.entries(obj.dependencies)) {
        deps.set(
          name + '@' + (info.version || 'unknown'),
          info.license ||
            info.licenses ||
            info['x-license'] ||
            info.licenseText ||
            null
        );
        walk(info);
      }
    }
  }

  walk(lock);
  return deps;
}

function normalizeLicenseField(lf) {
  if (!lf) return null;
  if (typeof lf === 'string') return lf.split(/\s*[,|/]\s*/)[0];
  if (Array.isArray(lf)) return lf[0];
  if (typeof lf === 'object' && lf.type) return lf.type;
  return null;
}

(function main() {
  try {
    const lockFile = path.resolve(process.cwd(), 'package-lock.json');
    const lock = readLock(lockFile);
    const deps = collectDeps(lock);

    const disallowed = [];

    for (const [nameVer, lic] of deps.entries()) {
      const norm = normalizeLicenseField(lic);
      if (!norm) continue; // can't judge
      if (!ALLOWLIST.has(norm)) disallowed.push({ nameVer, license: norm });
    }

    if (disallowed.length) {
      console.error('Found dependencies with non-allowlisted licenses:');
      disallowed
        .slice(0, 30)
        .forEach((d) => console.error(` - ${d.nameVer} => ${d.license}`));
      console.error(
        '\nIf any of these are false positives, add an exception in docs/data-governance.md or update the allowlist.'
      );
      process.exit(2);
    }

    console.log(
      'License check passed: all detected licenses are on the allowlist.'
    );
  } catch (err) {
    console.error(
      'License checker failed:',
      err && err.message ? err.message : String(err)
    );
    process.exit(1);
  }
})();
