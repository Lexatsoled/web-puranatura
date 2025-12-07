#!/usr/bin/env node
const { execSync } = require('node:child_process');

// This script detects forbidden artifacts either in the staged files (for
// pre-commit usage) or in the full repository (for CI checks). If any
// forbidden patterns are found the script exits with status 1.

const forbiddenPatterns = [
  /(^|\/)tmp\//i,
  /(^|\/)temp\//i,
  /(^|\/)coverage\//i,
  /dev\.db(\b|$)/i,
  /\.db$|\.db\b/i,
  /\.sqlite$/i,
];

function checkList(files) {
  const matches = [];
  files.forEach((f) => {
    for (const re of forbiddenPatterns) {
      if (re.test(f)) {
        matches.push({ file: f, pattern: re.toString() });
        break;
      }
    }
  });
  return matches;
}

function listStagedFiles() {
  try {
    const out = execSync('git diff --cached --name-only', { encoding: 'utf8' }).trim();
    if (!out) return [];
    return out.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  } catch (err) {
    // Not a git repo or no staged files
    return [];
  }
}

function listAllTrackedFiles() {
  try {
    const out = execSync('git ls-files', { encoding: 'utf8' }).trim();
    if (!out) return [];
    return out.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  } catch (err) {
    // If git not available, return empty (CI should have git)
    return [];
  }
}

function fail(matches, context) {
  console.error('\n❌ Forbidden artifact(s) detected (' + context + ')');
  for (const m of matches) console.error(' -', m.file);
  console.error('\nThese patterns are intentionally blocked: tmp/, coverage/, *.db, *.sqlite, dev.db');
  console.error('If this block is incorrect, add an allowlist in .github/.gitleaks.toml or update .trivyignore (but prefer keeping artifacts out of the repository).');
  process.exit(1);
}

// First look at staged files (pre-commit case)
const staged = listStagedFiles();
if (staged.length > 0) {
  const matches = checkList(staged);
  if (matches.length > 0) fail(matches, 'staged files');
  // nothing found in staged files — pass
  process.exit(0);
}

// If no staged files, check the full tracked files set (CI or full repo check)
const all = listAllTrackedFiles();
const matches = checkList(all);
if (matches.length > 0) fail(matches, 'repo tracked files');

console.log('✅ No forbidden artifacts detected (staged or tracked files).');
process.exit(0);
