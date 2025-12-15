#!/usr/bin/env node
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const { stripVTControlCharacters } = require('node:util');

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

console.log('Running Lighthouse with TMP/TEMP ->', tmpDir);
console.log('Writing JSON ->', jsonReport);
console.log('Writing HTML  ->', htmlReport);

const baseFlags = `--chrome-flags="--headless --no-sandbox --disable-gpu" --only-categories=performance,accessibility,best-practices,seo`;

function runShell(cmdStr) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmdStr, { env, stdio: 'inherit', shell: true });
    p.on('exit', (code, signal) => resolve({ code, signal }));
    p.on('error', (err) => reject(err));
  });
}

async function runAll() {
  let serverProcess = null;

  try {
    // 1. Start Server
    console.log('Starting preview server...');
    // We use 'npm run preview' which usually runs 'vite preview'
    // Add --host to ensure binding to 0.0.0.0 (fixes 127.0.0.1 vs localhost issues)
    // Also use random port 0 to avoid conflicts, but let's stick to default or detected.
    serverProcess = spawn(
      'npm',
      ['run', 'preview', '--', '--host', '--port', '0'],
      {
        env,
        stdio: 'pipe',
        shell: true,
      }
    );

    let port = '5173';

    // Wait for server to be ready
    await new Promise((resolve) => {
      const timeout = setTimeout(() => {
        console.warn(
          'Server startup timeout, proceeding anyway hoping it is up...'
        );
        resolve();
      }, 15000);

      serverProcess.stdout.on('data', (data) => {
        const rawStr = data.toString();
        const str = stripVTControlCharacters(rawStr);
        console.log('[Server]:', str.trim());

        // Match "http://localhost:PORT/" anywhere
        const match = str.match(/http:\/\/localhost:(\d+)\//);
        if (match) {
          port = match[1];
          console.log(`Detected server port: ${port}`);
          clearTimeout(timeout);
          resolve();
        }
      });

      serverProcess.stderr.on('data', (data) =>
        console.error('[Server Error]:', data.toString())
      );
      serverProcess.on('exit', (code) => {
        if (code !== 0 && code !== null) {
          console.error(`Server exited early with ${code}`);
        }
      });
    });

    console.log(
      `Server is supposedly ready on port ${port}. Running Lighthouse...`
    );

    // Run JSON output first
    const cmdJson = `npx lighthouse "http://localhost:${port}" --output=json --output-path="${jsonReport}" ${baseFlags}`;
    console.log('\\nRunning (JSON):', cmdJson);
    const res1 = await runShell(cmdJson);

    // Run HTML output
    const cmdHtml = `npx lighthouse "http://localhost:${port}" --output=html --output-path="${htmlReport}" ${baseFlags}`;
    console.log('\\nRunning (HTML):', cmdHtml);
    const res2 = await runShell(cmdHtml);

    // if either run had non-zero exit but produced the respective file, treat as success
    const jExists =
      fs.existsSync(jsonReport) && fs.statSync(jsonReport).size > 0;
    const hExists =
      fs.existsSync(htmlReport) && fs.statSync(htmlReport).size > 0;

    if ((res1.code === 0 || jExists) && (res2.code === 0 || hExists)) {
      console.log('\\nLighthouse runs finished (reports generated).');
      cleanupAndExit(0, serverProcess);
      return;
    }

    console.error(
      '\\nLighthouse runs failed and expected reports are missing.'
    );
    cleanupAndExit(1, serverProcess);
  } catch (err) {
    console.error('Error while running lighthouse:', err);
    // check for existing reports anyway
    const jExists =
      fs.existsSync(jsonReport) && fs.statSync(jsonReport).size > 0;
    const hExists =
      fs.existsSync(htmlReport) && fs.statSync(htmlReport).size > 0;
    if (jExists || hExists) {
      console.warn(
        'Reports were created despite the error, treating as success.'
      );
      cleanupAndExit(0, serverProcess);
    } else {
      cleanupAndExit(1, serverProcess);
    }
  }
}

runAll();

function cleanupAndExit(code, serverProcess) {
  if (serverProcess) {
    console.log('Stopping server...');
    try {
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', serverProcess.pid, '/f', '/t']);
      } else {
        serverProcess.kill();
      }
    } catch (e) {
      console.error('Error killing server:', e);
    }
  }

  // Try to remove the chromeProfile and tmpDir, but don't fail when EPERM occurs
  try {
    if (fs.existsSync(chromeProfile)) {
      // fs.rmSync(chromeProfile, { recursive: true, force: true });
      // Skipping aggression cleanup to avoid EPERM on Windows
    }
  } catch {}

  try {
    if (fs.existsSync(tmpDir)) {
      // fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  } catch {}

  process.exit(code);
}
