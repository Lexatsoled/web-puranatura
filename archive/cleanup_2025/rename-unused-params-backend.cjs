#!/usr/bin/env node
const fs = require('fs');
const glob = require('glob');
// const path = require('path');

function renameParamsInFile(file) {
  const text = fs.readFileSync(file, 'utf8');
  const pattern = /async\s*\(([^)]*)\)\s*=>\s*\{([\s\S]*?)\}/g;
  let modified = text;
  let match;
  let count = 0;
  while ((match = pattern.exec(text))) {
    const paramsRaw = match[1];
    const body = match[2];
    const params = paramsRaw
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);
    const paramNames = params.map((p) => p.split(':')[0].trim());
    let newParams = params.slice();
    if (paramNames.includes('request') && !/\brequest\b/.test(body)) {
      newParams = newParams.map((p) => {
        const [name, rest] = p.split(':');
        if (name.trim() === 'request')
          return `_request${rest ? ':' + rest : ''}`;
        return p;
      });
    }
    if (paramNames.includes('reply') && !/\breply\b/.test(body)) {
      newParams = newParams.map((p) => {
        const [name, rest] = p.split(':');
        if (name.trim() === 'reply') return `_reply${rest ? ':' + rest : ''}`;
        return p;
      });
    }
    if (paramNames.includes('role') && !/\brole\b/.test(body)) {
      newParams = newParams.map((p) => {
        const [name, rest] = p.split(':');
        if (name.trim() === 'role') return `_role${rest ? ':' + rest : ''}`;
        return p;
      });
    }
    if (newParams.join(',') !== params.join(',')) {
      const original = `async (${params.join(',')}) => {`;
      const replacement = `async (${newParams.join(',')}) => {`;
      modified = modified.replace(original, replacement);
      count++;
    }
  }
  if (count > 0) fs.writeFileSync(file, modified, 'utf8');
  return count;
}

const files = glob
  .sync('backend/**/*.ts', { nodir: true, ignore: ['**/node_modules/**'] })
  .concat(
    glob.sync('Pureza-Naturalis-V3/backend/**/*.ts', {
      nodir: true,
      ignore: ['**/node_modules/**'],
    })
  );
let total = 0;
for (const f of files) {
  try {
    const c = renameParamsInFile(f);
    if (c) console.log('Updated', f, c, 'occurrence(s)');
    total += c;
  } catch (e) {
    console.error('Error processing', f, e.message);
  }
}
console.log('Total updated:', total);
