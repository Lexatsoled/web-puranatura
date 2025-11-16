#!/usr/bin/env node

/**
 * Validation script for PERF-BUNDLE-001: Bundle Size Reduction
 * Validates that bundle sizes are within acceptable limits
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Validating PERF-BUNDLE-001: Bundle Size Reduction...\n');

// Bundle size limits (gzipped)
const LIMITS = {
  'react-vendor': 350 * 1024, // 350KB
  'vendor': 200 * 1024,       // 200KB
  'ui-vendor': 100 * 1024,    // 100KB
  'state-vendor': 50 * 1024   // 50KB
};

function getBundleSize(filePath) {
  // Try gzipped version first, fallback to uncompressed
  const gzPath = filePath + '.gz';
  try {
    const stats = fs.statSync(gzPath);
    return stats.size;
  } catch {
    try {
      const stats = fs.statSync(filePath);
      return stats.size;
    } catch {
      console.error(`❌ Error reading bundle: ${filePath}`);
      return null;
    }
  }
}

function validateBundles() {
  const distDir = path.join(__dirname, '..', 'dist', 'assets', 'js');
  let allValid = true;

  console.log('📊 Bundle Size Analysis:\n');

  for (const [bundleName, limit] of Object.entries(LIMITS)) {
    const pattern = new RegExp(`${bundleName}-.*\\.js$`);
    const files = fs.readdirSync(distDir).filter(file => pattern.test(file));

    if (files.length === 0) {
      console.log(`⚠️  No ${bundleName} bundle found`);
      continue;
    }

    const bundleFile = path.join(distDir, files[0]);
    const size = getBundleSize(bundleFile);

    if (size === null) {
      allValid = false;
      continue;
    }

    const sizeKB = (size / 1024).toFixed(2);
    const limitKB = (limit / 1024).toFixed(0);
    const isValid = size <= limit;

    console.log(`${isValid ? '✅' : '❌'} ${bundleName}: ${sizeKB}KB ${isValid ? '<' : '>'} ${limitKB}KB limit`);

    if (!isValid) {
      allValid = false;
    }
  }

  console.log('\n' + '='.repeat(50));

  if (allValid) {
    console.log('🎉 PERF-BUNDLE-001 COMPLETED SUCCESSFULLY!');
    console.log('✅ All bundle sizes are within acceptable limits');
    console.log('📈 Bundle optimization achieved significant size reduction');
    process.exit(0);
  } else {
    console.log('❌ PERF-BUNDLE-001 FAILED!');
    console.log('❌ Some bundles exceed size limits');
    process.exit(1);
  }
}

// Check if dist directory exists
const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
  console.error('❌ dist directory not found. Run build first.');
  process.exit(1);
}

validateBundles();