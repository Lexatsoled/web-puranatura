#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const manifest = path.join(process.cwd(), '.github', 'required-secrets.yml');

if (!fs.existsSync(manifest)) {
  console.error(
    'required-secrets.yml manifest not found in .github/. Run scripts/list-required-secrets.cjs --write to generate one.'
  );
  process.exit(1);
}

const keys = fs
  .readFileSync(manifest, 'utf8')
  .split('\n')
  // strip leading -/spaces, remove inline or full-line comments, trim and ignore empty lines
  .map((l) =>
    l
      .replace(/^[\s-]*/, '')
      .replace(/#.*/g, '')
      .trim()
  )
  .filter(Boolean);

const missing = keys.filter((k) => !process.env[k]);
if (missing.length) {
  console.error('Missing required secrets for deployment:', missing.join(', '));
  process.exit(2);
}

console.log(
  'All required secrets available in environment — deployment dry-run OK'
);
process.exit(0);
