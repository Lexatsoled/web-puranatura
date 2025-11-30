#!/usr/bin/env node
/**
 * scripts/generate-env-local.cjs
 *
 * Helper to create a `.env.local` file populated with secure random values
 * for the keys listed in `.github/required-secrets.yml` and by copying any
 * defaults present in `.env.local.example`.
 *
 * Usage:
 *  - Dry-run (shows what would be generated):
 *      node scripts/generate-env-local.cjs --file .env.local --dry-run
 *  - Actually write `.env.local` (will prompt when file exists):
 *      node scripts/generate-env-local.cjs --file .env.local --yes
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function parseArgs() {
  const args = process.argv.slice(2);
  const res = { file: '.env.local', example: '.env.local.example', dryRun: true, yes: false };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--file') res.file = args[++i];
    if (args[i] === '--example') res.example = args[++i];
    if (args[i] === '--dry-run') res.dryRun = true;
    if (args[i] === '--no-dry-run') res.dryRun = false;
    if (args[i] === '--yes') { res.yes = true; res.dryRun = false; }
  }
  return res;
}

function parseYamlList(filepath) {
  if (!fs.existsSync(filepath)) return [];
  const txt = fs.readFileSync(filepath, 'utf8');
  return txt
    .split('\n')
    .map(l => l.replace(/^[\s-]*/g, '').trim())
    .filter(Boolean)
    .filter(l => !l.startsWith('#')); // ignore comments
}

function parseExampleFile(examplePath) {
  if (!fs.existsSync(examplePath)) return {};
  const txt = fs.readFileSync(examplePath, 'utf8');
  const out = {};
  for (const line of txt.split('\n')) {
    const m = line.match(/^([^=\s]+)=(.*)$/);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

function genSecretForKey(key) {
  // Select length and format depending on key name
  const lower = key.toLowerCase();
  if (lower.includes('jwt') || lower.includes('secret')) {
    return crypto.randomBytes(64).toString('base64');
  }
  if (lower.includes('encryption') || lower.includes('key')) {
    return crypto.randomBytes(48).toString('base64');
  }
  if (lower.includes('password')) {
    // base64 without trailing = to make it shell friendly
    return crypto.randomBytes(24).toString('base64').replace(/=+$/,'');
  }
  if (lower.includes('url')) {
    return 'file:./prisma/database.sqlite';
  }
  // fallback
  return crypto.randomBytes(32).toString('base64');
}

async function main() {
  const { file, example, dryRun, yes } = parseArgs();
  const manifest = path.resolve('.github', 'required-secrets.yml');

  const keys = parseYamlList(manifest);
  const exampleValues = parseExampleFile(path.resolve(example));

  const output = [];

  // For each required key prefer a generated secure value unless the example
  // file contains a non-placeholder default (eg. a real DB URL). If the
  // example has a placeholder like REPLACE_WITH or is empty, we'll generate.
  for (const key of keys) {
    const exampleVal = exampleValues[key];
    const isPlaceholder = !exampleVal || /^REPLACE_/i.test(exampleVal) || exampleVal.trim() === '';
    if (!isPlaceholder) {
      output.push(`${key}=${exampleVal}`);
    } else {
      const val = genSecretForKey(key);
      output.push(`${key}=${val}`);
    }
  }

  console.log('Will produce the following .env.local (first 20 lines):\n');
  console.log(output.slice(0, 20).join('\n'));

  if (dryRun) return;

  const absFile = path.resolve(file);
  if (fs.existsSync(absFile) && !yes) {
    console.error(`${file} already exists. Re-run with --yes to overwrite.`);
    process.exit(2);
  }

  fs.writeFileSync(absFile, output.join('\n') + '\n', { encoding: 'utf8', flag: 'w' });
  console.log(`Wrote ${absFile}`);
}

main().catch(err => { console.error(err); process.exit(1); });
