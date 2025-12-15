const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const rootDir = path.resolve(__dirname, '..');
const outputFile = path.join(rootDir, 'inventory.json');

const ignoreDirs = [
  'node_modules',
  '.git',
  'dist',
  'coverage',
  'tmp',
  '.lighthouseci',
  'test-results',
  'playwright-report',
  '.gemini',
];

function getFileHash(filePath) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
  } catch (_e) {
    return 'error';
  }
}

function getModuleId(relPath) {
  if (relPath.startsWith('backend/') || relPath.startsWith('backend\\'))
    return 'backend-core';
  if (relPath.startsWith('src/') || relPath.startsWith('src\\'))
    return 'frontend-core';
  if (
    relPath.startsWith('scripts/') ||
    relPath.startsWith('scripts\\') ||
    relPath.startsWith('tools/') ||
    relPath.startsWith('tools\\')
  )
    return 'tooling';
  if (
    relPath.startsWith('e2e/') ||
    relPath.startsWith('e2e\\') ||
    relPath.startsWith('tests/') ||
    relPath.startsWith('tests\\') ||
    relPath.startsWith('test/') ||
    relPath.startsWith('test\\')
  )
    return 'testing';
  if (relPath.startsWith('docs/') || relPath.startsWith('docs\\'))
    return 'documentation';
  if (relPath.startsWith('infra/') || relPath.startsWith('infra\\'))
    return 'infrastructure';
  return 'root-config';
}

function scanDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (ignoreDirs.includes(file)) continue;
    const fullPath = path.join(dir, file);
    try {
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        scanDir(fullPath, fileList);
      } else {
        const relPath = path.relative(rootDir, fullPath).replace(/\\/g, '/');
        fileList.push({
          path: relPath,
          size: stat.size,
          lang: path.extname(file).substring(1),
          hash: getFileHash(fullPath),
          module_id: getModuleId(relPath),
        });
      }
    } catch (_err) {
      console.error('Error accessing ' + fullPath);
    }
  }
  return fileList;
}

console.log('Scanning...');
const files = scanDir(rootDir);

const modules = [
  { id: 'backend-core', description: 'Backend Node/Express/Prisma', files: [] },
  { id: 'frontend-core', description: 'Frontend React/Vite', files: [] },
  { id: 'tooling', description: 'Scripts and Tools', files: [] },
  { id: 'testing', description: 'Tests and configs', files: [] },
  { id: 'documentation', description: 'Docs', files: [] },
  { id: 'infrastructure', description: 'Infra and Docker', files: [] },
  { id: 'root-config', description: 'Root configurations', files: [] },
];

files.forEach((f) => {
  const mod = modules.find((m) => m.id === f.module_id);
  if (mod) mod.files.push(f.path);
});

const output = {
  scanned_at: new Date().toISOString(),
  root: 'web-puranatura---terapias-naturales',
  files: files,
  modules: modules.filter((m) => m.files.length > 0),
};

fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
console.log(`Inventory saved to ${outputFile} with ${files.length} files.`);
