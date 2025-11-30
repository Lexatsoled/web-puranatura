#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const targets = [
  '.env',
  'backend/.env',
  'backend/*.sqlite',
  'backend/*.sqlite-*',
  'backend/database.sqlite.backup',
  'backend/out.log',
  'backend/logs',
  'backend/backups',
];

function sanitizeFile(fp) {
  try {
    fs.writeFileSync(
      fp,
      '*** SANITIZED - removed sensitive content (see .env.example) ***\n'
    );
    console.log('[sanitize] sanitized', fp);
  } catch (err) {
    console.error('[sanitize] failed to sanitize', fp, err.message);
  }
}

function sanitizeDir(dir) {
  try {
    const items = fs.readdirSync(dir);
    for (const it of items) {
      const full = path.join(dir, it);
      const stats = fs.statSync(full);
      if (stats.isFile()) {
        sanitizeFile(full);
      } else if (stats.isDirectory()) {
        sanitizeDir(full);
      }
    }
    // add README placeholder to dir
    const readme = path.join(dir, 'README.md');
    fs.writeFileSync(
      readme,
      '# This directory previously contained backups or logs — contents removed for security.'
    );
    console.log('[sanitize] wrote README to', readme);
  } catch (err) {
    console.error('[sanitize] failed to sanitize dir', dir, err.message);
  }
}

for (const t of targets) {
  // handle globs roughly by reading target dir or file
  if (t.endsWith('/*.sqlite') || t.endsWith('/*.sqlite-*')) {
    const dir = path.join(repoRoot, 'backend');
    if (fs.existsSync(dir)) {
      const items = fs.readdirSync(dir);
      for (const it of items) {
        if (
          it.endsWith('.sqlite') ||
          it.includes('.sqlite-') ||
          it.endsWith('.backup')
        ) {
          sanitizeFile(path.join(dir, it));
        }
      }
    }
    continue;
  }

  const full = path.join(repoRoot, t);
  if (!fs.existsSync(full)) continue;
  const st = fs.statSync(full);
  if (st.isFile()) sanitizeFile(full);
  else if (st.isDirectory()) sanitizeDir(full);
}

console.log(
  'Sanitization complete — review git status and then purge history (BFG/git filter-repo) if required.'
);
