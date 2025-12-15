const fs = require('fs');
const path = require('path');

const MAX_BUNDLE_SIZE_KB = 500;
const DIST_DIR = path.resolve(__dirname, '../dist/assets');

if (!fs.existsSync(DIST_DIR)) {
  console.error('❌ Error: Directory dist/assets not found. Run build first.');
  process.exit(1);
}

const files = fs.readdirSync(DIST_DIR);
let failed = false;

console.log('📦 Checking bundle sizes...');

files.forEach((file) => {
  if (file.endsWith('.js')) {
    const filePath = path.join(DIST_DIR, file);
    const stats = fs.statSync(filePath);
    const sizeKb = stats.size / 1024;

    if (sizeKb > MAX_BUNDLE_SIZE_KB) {
      console.error(
        `❌ FAILURE: ${file} is ${sizeKb.toFixed(2)}KB (Limit: ${MAX_BUNDLE_SIZE_KB}KB)`
      );
      failed = true;
    } else {
      console.log(`✅ OK: ${file} (${sizeKb.toFixed(2)}KB)`);
    }
  }
});

if (failed) {
  console.error('🚨 Performance Budget Exceeded!');
  process.exit(1);
} else {
  console.log('✨ All bundles are within limits.');
}
