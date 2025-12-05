#!/usr/bin/env node
/**
 * Verificación de prerrequisitos para el plan de mejora.
 * - Comprueba dependencias npm opcionales (ej. glob, cross-env)
 * - Comprueba binarios externos (gitleaks, k6)
 * No instala nada automáticamente; solo informa.
 */
const { execSync } = require('child_process');

const npmDeps = ['glob', 'cross-env'];
const tools = [
  {
    name: 'gitleaks',
    cmd: 'gitleaks',
    winFallback:
      'C:\\Users\\Usuario\\AppData\\Local\\Programs\\gitleaks\\gitleaks.exe',
  },
  {
    name: 'k6',
    cmd: 'k6',
    winFallback: 'C:\\Users\\Usuario\\AppData\\Local\\Programs\\k6\\k6.exe',
  },
];

function checkCommand(cmd) {
  try {
    execSync(`${cmd} --version`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function checkWinFallback(fallbackPath) {
  try {
    execSync(`"${fallbackPath}" --version`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function main() {
  console.log('Verificando prerrequisitos...\n');

  // npm deps
  const missing = [];
  for (const dep of npmDeps) {
    try {
      require.resolve(dep);
    } catch {
      missing.push(dep);
    }
  }
  if (missing.length) {
    console.log(`Faltan dependencias npm: ${missing.join(', ')}`);
    console.log(`Ejecuta: npm install -D ${missing.join(' ')}`);
  } else {
    console.log('Dependencias npm: OK');
  }

  // external tools
  for (const { name, cmd, winFallback } of tools) {
    const ok =
      checkCommand(cmd) ||
      (process.platform === 'win32' &&
        winFallback &&
        checkWinFallback(winFallback));
    if (ok) console.log(`${name}: OK`);
    else
      console.log(`${name}: NO encontrado. Instalar desde releases oficiales.`);
  }
}

main();
