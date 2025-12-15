#!/usr/bin/env node
const { spawn } = require('child_process');
const http = require('node:http');
const waitOn = require('wait-on');
const path = require('node:path');
const { randomBytes } = require('node:crypto');

const envWithDefaults = {
  ...process.env,
  PORT: process.env.PORT || '3001',
  DATABASE_URL:
    process.env.DATABASE_URL ||
    `file:${path.join(process.cwd(), 'backend', 'prisma', 'database.sqlite')}`,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || 'http://localhost:5173',
  // If JWT secrets are not provided via environment, generate ephemeral
  // non-deterministic secrets at runtime. This avoids committing static
  // secret literals into the repo (reduces gitleaks false positives) and
  // is fine for ephemeral CI/test runs.
  JWT_SECRET: process.env.JWT_SECRET || randomBytes(32).toString('hex'),
  JWT_REFRESH_SECRET:
    process.env.JWT_REFRESH_SECRET || randomBytes(32).toString('hex'),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
};

const waitOnPromise = (opts) =>
  new Promise((resolve, reject) => {
    waitOn(opts, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });

const shutdown = (code, procs = []) => {
  for (const proc of procs.filter(Boolean)) {
    try {
      if (!proc.killed) proc.kill('SIGTERM');
    } catch {
      // Ignorar errores al finalizar
    }
  }
  process.exit(code);
};

const spawnBackend = () =>
  spawn('node', ['backend/dist/server.js'], {
    stdio: 'inherit',
    shell: true,
    env: envWithDefaults,
  });

const checkBackendUp = (
  baseUrl = `http://127.0.0.1:${envWithDefaults.PORT}/api/health`,
  timeout = 2000
) =>
  new Promise((resolve) => {
    const req = http.get(baseUrl, (res) => {
      const ok =
        res.statusCode && res.statusCode >= 200 && res.statusCode < 400;
      // consume and close
      res.resume();
      resolve(Boolean(ok));
    });
    req.on('error', () => resolve(false));
    req.setTimeout(timeout, () => {
      req.destroy();
      resolve(false);
    });
  });

// Ensure backend is running, or start it (only when not present). If
// SKIP_START_BACKEND=1 is set, do a health check and fail if unreachable.
const ensureBackend = async () => {
  const skip = String(process.env.SKIP_START_BACKEND || '').trim() === '1';

  if (skip) {
    const healthy = await checkBackendUp();
    if (!healthy) {
      throw new Error(
        'SKIP_START_BACKEND is set but backend is not reachable at http://127.0.0.1:' +
          envWithDefaults.PORT +
          '/api/health'
      );
    }
    console.log('SKIP_START_BACKEND set and backend is up — skipping start.');
    return { proc: null, startedByUs: false };
  }

  const already = await checkBackendUp();
  if (already) {
    // lgtm[js/clear-text-logging] - This is a test script, not production code
    console.log(
      'Backend already running at http://127.0.0.1:' +
        envWithDefaults.PORT +
        ' — skipping start.'
    );
    return { proc: null, startedByUs: false };
  }

  console.log('Backend not found — starting backend...');
  const proc = spawnBackend();
  // wait for health using waitOnPromise
  try {
    await waitOnPromise({
      resources: [`http://127.0.0.1:${envWithDefaults.PORT}/api/health`],
      timeout: 30000,
    });
    console.log('Backend ready');
    return { proc, startedByUs: true };
  } catch (err) {
    // if starting fails, ensure we kill child
    try {
      if (proc && !proc.killed) proc.kill('SIGTERM');
    } catch {}
    throw new Error(
      'Backend failed to become healthy in time: ' +
        (err && err.message ? err.message : String(err))
    );
  }
};

const spawnPreview = () =>
  spawn('npm', ['run', 'preview', '--', '--port', '5173'], {
    stdio: 'inherit',
    shell: true,
  });

const run = async () => {
  let backend = null;
  let backendStartedByUs = false;

  try {
    const res = await ensureBackend();
    backend = res.proc;
    backendStartedByUs = res.startedByUs;
  } catch (err) {
    // lgtm[js/clear-text-logging] - This is a test script, not production code
    console.error('wait-on backend error:', err.message || err);
    return shutdown(1, backend ? [backend] : []);
  }

  const preview = spawnPreview();

  try {
    await waitOnPromise({
      resources: ['http://localhost:5173'],
      timeout: 30000,
    });
  } catch (err) {
    console.error('wait-on preview error:', err.message || err);
    return shutdown(1, backendStartedByUs ? [preview, backend] : [preview]);
  }

  console.log(
    'Preview ready at http://localhost:5173 - launching Playwright tests'
  );

  const test = spawn(
    'npx',
    [
      'cross-env',
      'BASE_URL=http://localhost:5173',
      'playwright',
      'test',
      '--project=chromium',
      '--reporter=dot',
    ],
    {
      stdio: 'inherit',
      shell: true,
    }
  );

  test.on('exit', (code, signal) => {
    const exitCode = typeof code === 'number' ? code : signal ? 1 : 0;
    console.log('Playwright exited with', exitCode);
    shutdown(exitCode, backendStartedByUs ? [preview, backend] : [preview]);
  });
};

run().catch((err) => {
  console.error('Unexpected error in run-e2e:', err.message || err);
  shutdown(1);
});

process.on('SIGINT', () => shutdown(130));
process.on('SIGTERM', () => shutdown(143));
