#!/usr/bin/env node
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

// Run Lighthouse in a way that avoids Windows EPERM temp-dir cleanup errors
// Strategy:
//  - Use a project-local TEMP/TMP directory: ./tmp/lighthouse-temp
//  - Use Chrome user-data-dir inside ./tmp to keep all files under repo
//  - If Lighthouse exits with non-zero but report files exist, treat as success and surface a warning

const root = process.cwd();
const tmpDir = path.join(root, 'tmp', 'lighthouse-temp');
const chromeProfile = path.join(root, 'tmp', 'lighthouse-chrome-profile');
const jsonReport = path.join(root, 'tmp', 'lighthouse-report.json');
const htmlReport = path.join(root, 'tmp', 'lighthouse-report.html');

for (const d of [tmpDir, chromeProfile, path.join(root, 'tmp')]) {
  try {
    fs.mkdirSync(d, { recursive: true });
  } catch {}
}

const env = Object.assign({}, process.env, {
  // Force Chrome to use our repo-local tmp directory (Windows honors TMP/TEMP)
  TMP: tmpDir,
  TEMP: tmpDir,
});

// Construct args for npx lighthouse
// lighthouseArgs removed — build commands are constructed below when needed

console.log('Running Lighthouse with TMP/TEMP ->', tmpDir);
console.log('Writing JSON ->', jsonReport);
console.log('Writing HTML  ->', htmlReport);

// spawn without shell so args are passed as-is (no accidental splitting on spaces)
// Build a single command string and run it via shell so `npx` resolution works cross-platform.
// We'll quote file paths to avoid issues with spaces in Windows paths.
const baseFlags = `--chrome-flags="--headless --no-sandbox --disable-gpu --user-data-dir=\"${chromeProfile}\" --single-process" --only-categories=performance,accessibility,best-practices,seo`;

function runShell(cmdStr) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmdStr, { env, stdio: 'inherit', shell: true });
    p.on('exit', (code, signal) => resolve({ code, signal }));
    p.on('error', (err) => reject(err));
  });
}

async function runAll() {
  try {
    // Run JSON output first
    const cmdJson = `npx lighthouse "http://127.0.0.1:5173" --output=json --output-path="${jsonReport}" ${baseFlags}`;
    console.log('\nRunning (JSON):', cmdJson);
    const res1 = await runShell(cmdJson);

    // Run HTML output
    const cmdHtml = `npx lighthouse "http://127.0.0.1:5173" --output=html --output-path="${htmlReport}" ${baseFlags}`;
    console.log('\nRunning (HTML):', cmdHtml);
    const res2 = await runShell(cmdHtml);

    // if either run had non-zero exit but produced the respective file, treat as success
    const jExists =
      fs.existsSync(jsonReport) && fs.statSync(jsonReport).size > 0;
    const hExists =
      fs.existsSync(htmlReport) && fs.statSync(htmlReport).size > 0;

    if ((res1.code === 0 || jExists) && (res2.code === 0 || hExists)) {
      console.log('\nLighthouse runs finished (reports generated).');
      cleanupAndExit(0);
      return;
    }

    console.error('\nLighthouse runs failed and expected reports are missing.');
    cleanupAndExit(1);
  } catch {
    console.error('Error while running lighthouse: (see logs)');
    // check for existing reports anyway
    const jExists =
      fs.existsSync(jsonReport) && fs.statSync(jsonReport).size > 0;
    const hExists =
      fs.existsSync(htmlReport) && fs.statSync(htmlReport).size > 0;
    if (jExists || hExists) {
      console.warn(
        'Reports were created despite the error, treating as success.'
      );
      cleanupAndExit(0);
    } else {
      cleanupAndExit(1);
    }
  }
}

runAll();

function cleanupAndExit(code) {
  // Try to remove the chromeProfile and tmpDir, but don't fail when EPERM occurs
  try {
    if (fs.existsSync(chromeProfile)) {
      fs.rmSync(chromeProfile, { recursive: true, force: true });
    }
  } catch {
    console.warn(
      'Warning: could not remove chrome profile dir (safe to ignore on Windows):',
      chromeProfile
    );
  }

  // DON'T aggressively delete tmpDir — Chrome sometimes holds handles and removal will fail.
  // Leave the tmpDir for inspection if removal fails.
  try {
    if (fs.existsSync(tmpDir)) {
      // try one more gentle removal
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  } catch {
    console.warn('Warning: could not remove tmp dir (safe to ignore):', tmpDir);
  }

  process.exit(code);
}
