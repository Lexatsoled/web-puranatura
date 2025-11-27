#!/usr/bin/env node
/**
 * Ensures LHCI runs with deterministic temp directories and consistent Node resolution.
 */
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const tmpDir = path.resolve('reports', 'tmp');
fs.mkdirSync(tmpDir, { recursive: true });
process.env.TMP = tmpDir;
process.env.TEMP = tmpDir;
process.env.LHCI_BUILD_CONTEXT__CURRENT_HASH =
  process.env.LHCI_BUILD_CONTEXT__CURRENT_HASH || 'local-dev';

const cliPath = require.resolve('@lhci/cli/src/cli.js');
const args = [
  cliPath,
  'autorun',
  '--config=GPT-51-Codex-Max/perf/lhci-config.json',
];

const child = spawn(process.execPath, args, { stdio: 'inherit' });
child.on('exit', (code) => process.exit(code ?? 1));
child.on('error', (error) => {
  console.error('[perf:web] Error lanzando LHCI:', error);
  process.exit(1);
});
