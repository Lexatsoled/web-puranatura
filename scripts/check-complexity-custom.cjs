const fg = require('fast-glob');
const fs = require('node:fs');
const path = require('node:path');

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

  // Filter for complexity >= 10
  const highComplexity = results.filter((r) => r.complexity >= 10);
  highComplexity.sort((a, b) => b.complexity - a.complexity);

  console.log('Files with Cyclomatic Complexity >= 10:');
  if (highComplexity.length === 0) {
    console.log('None! All files are under 10.');
  } else {
    highComplexity.forEach((entry) => {
      console.log(`${entry.file}: ${entry.complexity}`);
    });
  }
};

analyze().catch((err) => console.error(err));
