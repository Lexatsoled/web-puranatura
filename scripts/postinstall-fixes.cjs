#!/usr/bin/env node
/**
 * Ensures nested chrome-launcher copies inherit the patched cleanup behavior.
 */
const fs = require('node:fs');
const path = require('node:path');

const source = path.resolve(
  'node_modules',
  'chrome-launcher',
  'dist',
  'chrome-launcher.js'
);
const nested = path.resolve(
  'node_modules',
  'lighthouse',
  'node_modules',
  'chrome-launcher',
  'dist',
  'chrome-launcher.js'
);

if (fs.existsSync(source) && fs.existsSync(nested)) {
  fs.copyFileSync(source, nested);
  console.log(
    '[postinstall] Copied patched chrome-launcher into lighthouse dependency.'
  );
}
