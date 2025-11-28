#!/usr/bin/env node
/**
 * Cross-platform wrapper to execute the PowerShell accessibility audits.
 * Falls back to Windows PowerShell when PowerShell Core (pwsh) isn't present.
 */
const { spawn } = require('node:child_process');
const path = require('node:path');

const scriptPath = path.resolve('scripts', 'run-accessibility-audits.ps1');
const shellCandidates =
  process.platform === 'win32'
    ? ['pwsh', 'powershell']
    : ['pwsh', 'powershell'];

const args = [
  '-NoProfile',
  '-ExecutionPolicy',
  'Bypass',
  '-File',
  scriptPath,
  ...process.argv.slice(2),
];

const tryRun = async () => {
  for (const shell of shellCandidates) {
    const exitCode = await new Promise((resolve) => {
      const child = spawn(shell, args, { stdio: 'inherit' });
      child.on('error', () => resolve(null));
      child.on('exit', (code) => resolve(code));
    });

    if (exitCode !== null) {
      process.exit(exitCode);
    }
  }

  console.error(
    'No se encontró ninguna instalación de PowerShell (pwsh/powershell) para ejecutar los audits de accesibilidad.'
  );
  process.exit(1);
};

tryRun();
