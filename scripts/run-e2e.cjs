#!/usr/bin/env node
const { spawn } = require('child_process');
const waitOn = require('wait-on');

function spawnPreview() {
  const p = spawn('npm', ['run', 'preview', '--', '--port', '5173'], {
    stdio: 'inherit',
    shell: true,
  });
  return p;
}

const preview = spawnPreview();

const opts = {
  resources: ['http://localhost:5173'],
  timeout: 30000,
};

function shutdown(code) {
  try {
    if (!preview.killed) preview.kill('SIGTERM');
  } catch {
    // Ignorar errores al terminar preview (usado en CI/local)
  }
  process.exit(code);
}

process.on('SIGINT', () => shutdown(130));
process.on('SIGTERM', () => shutdown(143));

waitOn(opts, (err) => {
  if (err) {
    console.error('wait-on error:', err.message || err);
    shutdown(1);
    return;
  }

  console.log(
    'Preview ready at http://localhost:5173 — launching Playwright tests'
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
    // attempt graceful shutdown of preview
    try {
      if (!preview.killed) preview.kill('SIGTERM');
    } catch {
      // Ignorar errores al terminar preview (usado en CI/local)
    }

    // wait for preview to exit then exit with test code
    const timeout = setTimeout(() => shutdown(exitCode), 5000);
    preview.on('exit', () => {
      clearTimeout(timeout);
      shutdown(exitCode);
    });
  });
});
