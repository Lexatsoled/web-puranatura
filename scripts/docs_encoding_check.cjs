#!/usr/bin/env node
/*
  docs_encoding_check.cjs
  Recorre README.md, CONTRIBUTING.md y todos los .md en docs/ y aplica reparación de encoding vía force_repair_encoding.cjs
*/
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function collectMarkdown(dir) {
  const files = [];
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...collectMarkdown(full));
    else if (full.toLowerCase().endsWith('.md')) files.push(full);
  }
  return files;
}

const repoRoot = process.cwd();
const targets = [
  path.join(repoRoot, 'README.md'),
  path.join(repoRoot, 'CONTRIBUTING.md'),
  ...collectMarkdown(path.join(repoRoot, 'docs')),
];

const args = [path.join(repoRoot, 'scripts', 'force_repair_encoding.cjs'), ...targets];
const res = spawnSync(process.execPath, args, { stdio: 'inherit' });
process.exit(res.status ?? 0);

