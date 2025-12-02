#!/usr/bin/env node
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

function getRandomPort() {
  return Math.floor(Math.random() * (9322 - 9222 + 1)) + 9222;
}

async function run() {
  const url = process.argv[2];
  const outPath = process.argv[3];
  const formFactor = process.argv[4] || 'desktop';
  const userDataDir =
    process.argv[5] ||
    path.join(process.cwd(), 'reports', 'tmp', `pl-chrome-${Date.now()}`);

  if (!url || !outPath) {
    console.error(
      'Usage: node run-lighthouse-with-playwright.cjs <url> <outPath> [desktop|mobile] [userDataDir]'
    );
    process.exit(2);
  }

  fs.mkdirSync(userDataDir, { recursive: true });

  const port = getRandomPort();
  console.log(
    `Launching Playwright Chromium with remote-debugging-port=${port} userDataDir=${userDataDir}`
  );

  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: true,
    args: [
      `--remote-debugging-port=${port}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-dev-shm-usage',
      '--disable-extensions',
      '--disable-gpu',
    ],
  });

  // Wait for Chrome to start and accept the remote debugging endpoint
  async function waitForRemote(port, attempts = 20, delayMs = 500) {
    const url = `http://127.0.0.1:${port}/json/version`;
    for (let i = 0; i < attempts; i++) {
      try {
        const res = await fetch(url, { method: 'GET' });
        if (res.ok) return true;
      } catch {
        // ignore and retry
      }
      await new Promise((r) => setTimeout(r, delayMs));
    }
    return false;
  }

  const remoteReady = await waitForRemote(port, 30, 500);
  if (!remoteReady) {
    console.error(
      `Playwright chrome did not expose remote-debugging on port ${port}`
    );
    try {
      await context.close();
    } catch {}
    process.exit(1);
  }

  // Ensure output parent dir exists
  try {
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
  } catch {
    /* ignore */
  }

  // wait until the inspected url is reachable (Lighthouse requires the page to be available)
  async function waitForUrl(target, attempts = 20, delayMs = 500) {
    for (let i = 0; i < attempts; i++) {
      try {
        const r = await fetch(target, { method: 'GET' });
        if (r.ok) return true;
      } catch {
        // ignore
      }
      await new Promise((r) => setTimeout(r, delayMs));
    }
    return false;
  }

  const urlReady = await waitForUrl(url, 30, 500);
  if (!urlReady) {
    console.error(
      `Target URL ${url} did not respond successfully before Lighthouse run`
    );
    try {
      await context.close();
    } catch {}
    process.exit(1);
  }

  const lhArgs = [
    url,
    '--port',
    String(port),
    '--output',
    'html',
    '--output',
    'json',
    '--output-path',
    outPath,
    '--quiet',
    '--emulated-form-factor=' + formFactor,
  ];
  console.log('Running lighthouse with args:', lhArgs.join(' '));

  // Run Lighthouse non-interactively. set CI to true to avoid prompts; avoid shell:true to keep args escaped.
  const env = Object.assign({}, process.env, { CI: 'true' });
  async function runLighthouse(args, timeoutMs = 3 * 60 * 1000) {
    return new Promise((resolve) => {
      // prefer a local install in node_modules/.bin to avoid relying on npx
      const localBin = path.join(
        process.cwd(),
        'node_modules',
        '.bin',
        process.platform === 'win32' ? 'lighthouse.cmd' : 'lighthouse'
      );
      let launcher = null;
      let spawnArgs = null;
      if (fs.existsSync(localBin)) {
        launcher = localBin;
        spawnArgs = args;
      } else {
        launcher = process.platform === 'win32' ? 'npx.cmd' : 'npx';
        spawnArgs = ['lighthouse', ...args];
      }
      const useShell = process.platform === 'win32' && launcher !== localBin;
      const child = spawn(launcher, spawnArgs, {
        stdio: 'inherit',
        shell: useShell,
        env,
      });
      let finished = false;
      const killTimer = setTimeout(() => {
        if (!finished) {
          try {
            child.kill('SIGKILL');
          } catch {}
          finished = true;
          resolve({ status: 1, timedOut: true });
        }
      }, timeoutMs);

      child.on('exit', (code) => {
        if (finished) return;
        finished = true;
        clearTimeout(killTimer);
        resolve({ status: code === null ? 1 : code, timedOut: false });
      });

      child.on('error', (err) => {
        if (finished) return;
        finished = true;
        clearTimeout(killTimer);
        console.error('Failed to start lighthouse:', err.message || err);
        resolve({ status: 1, timedOut: false });
      });
    });
  }

  let res = await runLighthouse(lhArgs);

  if (res.status !== 0) {
    console.warn(
      'Lighthouse run failed; retrying once with verbose output to collect diagnostics.'
    );
    const verboseArgs = [
      url,
      '--port',
      String(port),
      '--output',
      'html',
      '--output',
      'json',
      '--output-path',
      outPath,
      '--emulated-form-factor=' + formFactor,
    ];
    const second = await runLighthouse(verboseArgs);
    // prefer the second status if available
    res = second.status !== undefined ? second : res;
  }

  // try to close Playwright context gracefully; allow up to a couple seconds
  try {
    await context.close();
  } catch (e) {
    console.warn(
      'Failed to close Playwright context (attempting force):',
      e.message
    );
    try {
      const browser = context.browser();
      if (browser) await browser.close();
    } catch (ee) {
      console.warn('Force close failed:', ee.message);
    }
  }

  // If Lighthouse returned non-zero we surface its exit code
  const exitCode = res && typeof res.status === 'number' ? res.status : 1;

  // best-effort close
  try {
    await context.close();
  } catch {
    try {
      const browser = context.browser();
      if (browser) await browser.close();
    } catch {}
  }

  process.exit(exitCode);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
