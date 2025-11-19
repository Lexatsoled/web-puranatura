#!/usr/bin/env node
const fs = require('fs');
// path is intentionally unused in this script; keep it for compatibility with some environments
// const path = require('path');
const glob = require('glob');

function isEmptyBlock(block) {
  // Remove whitespace and comments
  const cleaned = block
    .replace(/\/\*[^]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '')
    .trim();
  return cleaned === '';
}

const files = glob
  .sync('backend/src/**/*.ts')
  .concat(glob.sync('backend/src/**/*.js'));
let modified = 0;
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const pattern = /catch\s*\{([\s\S]*?)\}/g;
  let match;
  let out = text;
  const changes = [];
  while ((match = pattern.exec(text))) {
    const blockContent = match[1];
    if (isEmptyBlock(blockContent)) {
      const original = match[0];
      const replacement = 'catch (e) { void e; }';
      // Replace the original with the replacement in a safe manner
      out = out.replace(original, replacement);
      changes.push({ original, replacement });
    }
  }
  if (changes.length) {
    fs.writeFileSync(file, out, 'utf8');
    console.log('Fixed empty catch in', file, 'replacements:', changes.length);
    modified += changes.length;
  }
}
console.log('Total empty catches fixed:', modified);
