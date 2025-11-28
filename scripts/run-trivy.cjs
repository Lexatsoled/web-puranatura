#!/usr/bin/env node
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const version = process.env.TRIVY_VERSION || '0.51.4';
console.log(`[trivy] Wrapper iniciado (version ${version})`);
const platformMap = { win32: 'Windows', linux: 'Linux', darwin: 'macOS' };
const archMap = { x64: '64bit', arm64: 'ARM64', arm: 'ARM' };
const platform = platformMap[process.platform];
const arch = archMap[process.arch] || archMap.x64;

if (!platform) {
  console.error(`[trivy] Plataforma no soportada: ${process.platform}`);
  process.exit(1);
}

const cacheDir = path.join(os.tmpdir(), 'puranatura-trivy');
const binaryName = process.platform === 'win32' ? 'trivy.exe' : 'trivy';
const cachedBinary = path.join(cacheDir, binaryName);

const hasBinary = () => {
  if (!fs.existsSync(cachedBinary)) return false;
  const res = spawnSync(cachedBinary, ['--version'], { stdio: 'ignore' });
  return res.status === 0;
};

const trySystemBinary = () => {
  const cmd = process.platform === 'win32' ? `${binaryName}` : binaryName;
  const res = spawnSync(cmd, ['--version'], { stdio: 'ignore' });
  return res.status === 0 ? cmd : null;
};

const downloadBinary = () => {
  fs.mkdirSync(cacheDir, { recursive: true });
  const isWin = process.platform === 'win32';
  const asset = isWin
    ? `trivy_${version}_${platform}-${arch}.zip`
    : `trivy_${version}_${platform}-${arch}.tar.gz`;
  const url = `https://github.com/aquasecurity/trivy/releases/download/v${version}/${asset}`;
  console.log(`[trivy] Descargando ${asset}...`);

  if (isWin) {
    const zipPath = path.join(cacheDir, asset);
    const psCommand = [
      `$ProgressPreference='SilentlyContinue';`,
      `Invoke-WebRequest -Uri '${url}' -OutFile '${zipPath}'`,
      `; Expand-Archive -Force '${zipPath}' '${cacheDir}'`,
    ].join(' ');
    const result = spawnSync(
      'powershell.exe',
      ['-NoProfile', '-Command', psCommand],
      {
        stdio: 'inherit',
      }
    );
    if (result.status !== 0) {
      throw new Error('No se pudo descargar trivy en Windows');
    }
  } else {
    const result = spawnSync(
      'bash',
      [
        '-c',
        `curl -sSL "${url}" | tar -xz -C "${cacheDir}" --strip-components=1`,
      ],
      { stdio: 'inherit' }
    );
    if (result.status !== 0) {
      throw new Error('No se pudo descargar trivy');
    }
  }

  // Ensure we actually found a binary at the expected path.
  let extractedBinary = cachedBinary;
  if (!fs.existsSync(extractedBinary)) {
    // Fallback: search recursively for any file that looks like the trivy binary
    const findCandidate = (dir) => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const e of entries) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) {
          const found = findCandidate(full);
          if (found) return found;
        } else if (e.isFile()) {
          const lower = e.name.toLowerCase();
          if (
            lower === binaryName ||
            lower.startsWith('trivy') ||
            lower.includes('trivy')
          ) {
            return full;
          }
        }
      }
      return null;
    };

    const found = findCandidate(cacheDir);
    if (!found) {
      // dump directory listing to aid debugging in CI logs
      const dump = (dir, indent = '') => {
        const items = fs.readdirSync(dir, { withFileTypes: true });
        for (const it of items) {
          const full = path.join(dir, it.name);
          console.log(`${indent}${it.name}${it.isDirectory() ? '/' : ''}`);
          if (it.isDirectory()) dump(full, indent + '  ');
        }
      };
      console.error('[trivy] Estructura de cacheDir:');
      dump(cacheDir);
      throw new Error('No se encontró binario Trivy tras la extracción');
    }

    // If we found a candidate, prefer an executable one — try version check
    const tryExec = (candidate) => {
      try {
        const r = spawnSync(candidate, ['--version'], { stdio: 'ignore' });
        return r.status === 0 ? candidate : null;
      } catch {
        return null;
      }
    };

    const execCandidate = tryExec(found);
    if (execCandidate) {
      extractedBinary = execCandidate;
    } else {
      // attempt chmod and test again
      try {
        fs.chmodSync(found, 0o755);
        const after = tryExec(found);
        if (after) extractedBinary = after;
      } catch {
        // ignore chmod errors here — we'll fail below if not executable
      }
    }

    if (!fs.existsSync(extractedBinary)) {
      throw new Error('No se encontró binario Trivy tras la extracción');
    }
  }

  fs.chmodSync(extractedBinary, 0o755);
  return extractedBinary;
};

const resolveBinary = () => {
  const systemBinary = trySystemBinary();
  if (systemBinary) {
    console.log('[trivy] Se usará binario del sistema');
    return systemBinary;
  }
  if (hasBinary()) {
    console.log('[trivy] Se usará binario cacheado');
    return cachedBinary;
  }
  console.log('[trivy] Binario no encontrado, descargando...');
  return downloadBinary();
};

try {
  const binary = resolveBinary();
  console.log(`[trivy] Usando binario: ${binary}`);
  const args = process.argv.slice(2);
  const defaultArgs = [
    'fs',
    '.',
    '--scanners',
    'vuln,secret',
    '--severity',
    'HIGH,CRITICAL',
  ];

  const result = spawnSync(binary, args.length ? args : defaultArgs, {
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    console.error(
      `[trivy] Salida con código ${result.status ?? 'desconocido'}. ${
        result.error ? result.error.message : ''
      }`
    );
  }

  process.exit(result.status ?? 1);
} catch (error) {
  console.error('[trivy] Error:', error.message || error);
  process.exit(1);
}
