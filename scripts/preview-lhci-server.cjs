#!/usr/bin/env node
const { spawn } = require('node:child_process');
const http = require('node:http');
const path = require('node:path');

const repoRoot = path.resolve('.');
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const previewArgs = [
  'run',
  'preview',
  '--',
  '--host',
  '127.0.0.1',
  '--strictPort',
  '--port',
  '4173',
];

const child = spawn(npmCmd, previewArgs, {
  stdio: ['ignore', 'pipe', 'pipe'],
  cwd: repoRoot,
  env: { ...process.env },
  shell: process.platform === 'win32',
});

child.stdout.on('data', (chunk) => {
  process.stdout.write(chunk);
});

child.stderr.on('data', (chunk) => {
  process.stderr.write(chunk);
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});

let ready = false;
const CHECK_INTERVAL_MS = 500;
const readyTimer = setInterval(() => {
  if (ready) {
    return;
  }
  const req = http.get('http://127.0.0.1:4173/', (res) => {
    res.destroy();
    if (!ready) {
      ready = true;
      console.log('LHCI_PREVIEW_READY http://127.0.0.1:4173/');
      clearInterval(readyTimer);
    }
  });
  req.on('error', () => {
    // server still starting
  });
  req.setTimeout(2000, () => {
    req.destroy();
  });
}, CHECK_INTERVAL_MS);

function cleanup(signal) {
  if (!child.killed) {
    child.kill(signal || 'SIGTERM');
  }
  clearInterval(readyTimer);
}

process.on('SIGINT', () => cleanup('SIGINT'));
process.on('SIGTERM', () => cleanup('SIGTERM'));
