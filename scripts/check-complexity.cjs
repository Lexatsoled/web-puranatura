#!/usr/bin/env node
const fg = require('fast-glob');
const fs = require('node:fs');
const path = require('node:path');

const REPORT_DIR = path.resolve('reports');
const REPORT_FILE = path.join(REPORT_DIR, 'complexity-report.json');
const KEYWORDS = [
  'if',
  'for',
  'while',
  'case',
  'catch',
  'switch',
  '&&',
  '||',
  '?',
  'return',
];

const countOccurrences = (text, pattern) => {
  const matches = text.match(pattern);
  return matches ? matches.length : 0;
};

const computeComplexity = (text) => {
  let score = 0;
  const sanitized = text
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '');
  KEYWORDS.forEach((keyword) => {
    const pattern =
      keyword === '?'
        ? /\?/g
        : keyword === '&&'
          ? /&&/g
          : keyword === '||'
            ? /\|\|/g
            : new RegExp(`\\b${keyword}\\b`, 'g');
    score += countOccurrences(sanitized, pattern);
  });
  return score;
};

const analyze = async () => {
  const patterns = ['src/**/*.{ts,tsx}', 'pages/**/*.{ts,tsx}'];
  const files = await fg(patterns, { absolute: true });
  const results = [];

  for (const file of files) {
    if (fs.statSync(file).isDirectory()) continue;
    const source = fs.readFileSync(file, 'utf8');
    const complexity = computeComplexity(source);
    results.push({
      file: path.relative(process.cwd(), file),
      complexity,
      lines: source.split(/\r?\n/).length,
    });
  }

  results.sort((a, b) => b.complexity - a.complexity);
  const summary = {
    timestamp: new Date().toISOString(),
    top: results.slice(0, 10),
    totalFiles: results.length,
  };

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(REPORT_FILE, JSON.stringify(summary, null, 2), 'utf8');
  return summary;
};

analyze()
  .then((summary) => {
    console.log('Complexity report saved to', REPORT_FILE);
    console.table(
      summary.top.map((entry) => ({
        file: entry.file,
        complexity: entry.complexity,
        lines: entry.lines,
      }))
    );
  })
  .catch((error) => {
    console.error('Failed to generate complexity report:', error);
    process.exit(1);
  });
