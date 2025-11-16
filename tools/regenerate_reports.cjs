#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const scripts = [
  'tools/product_audit_merge.cjs',
  'tools/components_audit.cjs',
  'tools/encoding_audit.cjs',
  'tools/links_check.cjs',
];

function run(script) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [path.resolve(ROOT, script)], {
      stdio: 'inherit',
    });
    child.on('close', (code) => resolve({ script, code }));
  });
}

async function main() {
  console.log('Regenerando reportes...');
  for (const s of scripts) {
     
    const { code } = await run(s);
    if (code !== 0)
      console.warn(`[WARN] Script ${s} finalizó con código ${code}`);
  }
  console.log('Listo. Revisa el directorio reports/.');
}

if (require.main === module) main();
