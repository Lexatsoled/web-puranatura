#!/usr/bin/env node
/**
 * Helper for creating repository secrets using GitHub CLI (`gh secret set`).
 * Usage: node scripts/gh-set-secrets.cjs --file .github/required-secrets.yml --env-file .env.local
 * The script will read the secret names from the manifest and look up values from
 * the provided env file (or environment), then call `gh secret set NAME` for each.
 * NOTE: This script runs locally and requires `gh` to be installed and authenticated.
 */

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

function parseArgs() {
  const args = process.argv.slice(2);
  const res = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--file') res.file = args[++i];
    if (args[i] === '--env-file') res.envFile = args[++i];
    if (args[i] === '--org') res.org = args[++i];
  }
  return res;
}

function parseYamlList(filepath) {
  const txt = fs.readFileSync(filepath, 'utf8');
  return txt
    .split('\n')
    .map(l => l.replace(/^[\s-]*/g, '').trim())
    .filter(Boolean);
}

function parseEnvFile(envPath) {
  if (!fs.existsSync(envPath)) return {};
  const txt = fs.readFileSync(envPath, 'utf8');
  const out = {};
  for (const line of txt.split('\n')) {
    const m = line.match(/^([^=\s]+)=(.*)$/);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

(async function main(){
  const { file = '.github/required-secrets.yml', envFile = '.env.local', org } = parseArgs();
  const absFile = path.resolve(file);
  if (!fs.existsSync(absFile)) {
    console.error('manifest not found:', absFile);
    process.exit(1);
  }

  const keys = parseYamlList(absFile);
  if (!keys.length) {
    console.log('No keys found in', file);
    return;
  }

  const envValues = parseEnvFile(path.resolve(envFile));

  console.log('Will set the following repo secrets (if values found):');
  console.log(keys.join('\n'));

  for (const key of keys) {
    const val = process.env[key] || envValues[key];
    if (!val) {
      console.warn(`Missing value for ${key} — skipping (set via env or ${envFile})`);
      continue;
    }

    try {
      const cmd = org
        ? `gh secret set ${key} -R ${process.env.GITHUB_REPOSITORY} --org ${org} --body '${val.replace(/'/g,"'\\''")}'`
        : `gh secret set ${key} --body '${val.replace(/'/g,"'\\''")}'`;
      console.log('Setting secret', key);
      execSync(cmd, { stdio: 'inherit' });
    } catch (err) {
      console.error('Failed to set', key, err && err.message ? err.message : err);
    }
  }
})();
