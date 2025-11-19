#!/usr/bin/env node
const fs = require('fs');
// const path = require('path');
const glob = require('glob');

function renameParamsInFile(file) {
  const text = fs.readFileSync(file, 'utf8');
  // Find 'async (request, reply) => {' blocks
  const pattern = /async\s*\(([^)]*)\)\s*=>\s*\{([\s\S]*?)\}/g;
  let modified = text;
  let match;
  let count = 0;
  while ((match = pattern.exec(text))) {
    const params = match[1].split(',').map((p) => p.trim());
    const body = match[2];
    let newParams = params.slice();
    const paramNames = params.map((p) => p.split(':')[0].trim());
    // If 'request' not used in body, replace with _request
    if (paramNames.includes('request') && !/\brequest\b/.test(body)) {
      newParams = newParams.map((p) => {
        const [name, rest] = p.split(':');
        const trimmed = name.trim();
        if (trimmed === 'request') return `_request${rest ? ':' + rest : ''}`;
        return p;
      });
    }
    if (paramNames.includes('reply') && !/\breply\b/.test(body)) {
      newParams = newParams.map((p) => {
        const [name, rest] = p.split(':');
        const trimmed = name.trim();
        if (trimmed === 'reply') return `_reply${rest ? ':' + rest : ''}`;
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

function main() {
  const files = glob.sync('templates/backend/src/**/*.ts');
  let total = 0;
  for (const f of files) {
    const c = renameParamsInFile(f);
    if (c) console.log('Updated', f, c, 'occurrence(s)');
    total += c;
  }
  console.log('Total updated:', total);
}

main();
