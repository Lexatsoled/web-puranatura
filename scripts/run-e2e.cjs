#!/usr/bin/env node
const { spawn } = require('child_process');
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

const spawnPreview = () =>
  spawn('npm', ['run', 'preview', '--', '--port', '5173'], {
    stdio: 'inherit',
    shell: true,
  });

const run = async () => {
  const backend = spawnBackend();

  try {
    await waitOnPromise({
      resources: [`http://localhost:${envWithDefaults.PORT}/api/health`],
      timeout: 30000,
    });
  } catch (err) {
    console.error('wait-on backend error:', err.message || err);
    return shutdown(1, [backend]);
  }

  const preview = spawnPreview();

  try {
    await waitOnPromise({
      resources: ['http://localhost:5173'],
      timeout: 30000,
    });
  } catch (err) {
    console.error('wait-on preview error:', err.message || err);
    return shutdown(1, [preview, backend]);
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
    shutdown(exitCode, [preview, backend]);
  });
};

run().catch((err) => {
  console.error('Unexpected error in run-e2e:', err.message || err);
  shutdown(1);
});

process.on('SIGINT', () => shutdown(130));
process.on('SIGTERM', () => shutdown(143));
