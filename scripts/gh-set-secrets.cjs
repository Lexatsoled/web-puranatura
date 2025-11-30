#!/usr/bin/env node
/**
 * Helper for creating repository secrets using GitHub CLI (`gh secret set`).
 * Usage: node scripts/gh-set-secrets.cjs --file .github/required-secrets.yml --env-file .env.local
 * The script will read the secret names from the manifest and look up values from
 * the provided env file (or environment), then call `gh secret set NAME` for each.
 * NOTE: This script runs locally and requires `gh` to be installed and authenticated.
 */

const fs = require('fs');
const { execSync, execFileSync } = require('child_process');
const path = require('path');
let checkedGh = false;

function parseArgs() {
  const args = process.argv.slice(2);
  const res = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--file') res.file = args[++i];
    if (args[i] === '--env-file') res.envFile = args[++i];
    if (args[i] === '--org') res.org = args[++i];
    if (args[i] === '--dry-run') res.dryRun = true;
  }
  return res;
}

function parseYamlList(filepath) {
  const txt = fs.readFileSync(filepath, 'utf8');
  return txt
    .split('\n')
    .map(l => l.replace(/^[\s-]*/g, '').trim())
    .filter(Boolean)
    .filter(l => !l.startsWith('#')); // ignore commented lines
}

function parseEnvFile(envPath) {
  if (!fs.existsSync(envPath)) return {};
  const txt = fs.readFileSync(envPath, 'utf8');
  const out = {};
  for (const line of txt.split('\n')) {
    const cleaned = line.replace(/\r$/,'');
    const m = cleaned.match(/^([^=\s]+)=(.*)$/);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

(async function main(){
  const { file = '.github/required-secrets.yml', envFile = '.env.local', org, dryRun } = parseArgs();
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

  if (!fs.existsSync(path.resolve(envFile))) {
    console.error(`env-file not found: ${envFile} — crea un archivo .env.local a partir de .env.local.example antes de ejecutar este helper`);
    process.exit(2);
  }

  console.log('Will set the following repo secrets (if values found):');
  console.log(keys.join('\n'));

  for (const key of keys) {
    const val = process.env[key] || envValues[key];
    if (!val) {
      console.warn(`Missing value for ${key} — skipping (set via env or ${envFile})`);
      continue;
    }

    try {
      // Before attempting to set secrets, ensure gh is installed and the user
      // is authenticated when not running in dry-run. This avoids confusing
      // runtime errors on Windows or missing CLI.
      if (!dryRun && !checkedGh) {
        try {
          execFileSync('gh', ['--version'], { stdio: 'ignore' });
        } catch (err) {
          console.error('GitHub CLI (`gh`) not found in PATH. Install it from https://cli.github.com/ and authenticate with `gh auth login`.');
          process.exit(3);
        }

        try {
          // Check auth status, but allow this to fail gracefully with a helpful message
          execFileSync('gh', ['auth', 'status'], { stdio: 'ignore' });
        } catch (err) {
          console.error('GitHub CLI is installed but not authenticated or lacks permission. Run `gh auth login` and ensure your account has permission to set repository secrets.');
          process.exit(4);
        }

        checkedGh = true;
      }
      if (dryRun) {
        console.log(`[dry-run] would set secret ${key}` + (org ? ` (org ${org})` : ''));
        continue;
      }

      const args = org
        ? ['secret', 'set', key, '-R', process.env.GITHUB_REPOSITORY, '--org', org, '--body', val]
        : ['secret', 'set', key, '--body', val];

      console.log('Setting secret', key);
      // Use execFileSync to avoid shell quoting issues on Windows/cmd.exe/powershell
      execFileSync('gh', args, { stdio: 'inherit' });
    } catch (err) {
      console.error('Failed to set', key);
      if (err && err.message) console.error(err.message);
    }
  }
})();
