import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ISO_DATE = new Date().toISOString().slice(0, 10);
const OUTPUT_DIR =
  process.argv.includes('--output') && process.argv[process.argv.indexOf('--output') + 1]
    ? process.argv[process.argv.indexOf('--output') + 1]
    : `reports/execution-${ISO_DATE}`;

const TARGETS = [
  { name: 'frontend', cwd: process.cwd() },
  { name: 'backend', cwd: path.join(process.cwd(), 'backend') },
];

mkdirSync(OUTPUT_DIR, { recursive: true });

const runAudit = (target) => {
  const jsonPath = path.join(OUTPUT_DIR, `npm-audit-${target.name}.json`);
  const textPath = path.join(OUTPUT_DIR, `npm-audit-${target.name}.txt`);

  const run = (command) => {
    try {
      return execSync(command, { cwd: target.cwd, stdio: 'pipe' }).toString();
    } catch (error) {
      if (error.stdout) {
        return error.stdout.toString();
      }
      throw error;
    }
  };

  const jsonResult = run('npm audit --omit=dev --json');
  const textResult = run('npm audit --omit=dev');

  writeFileSync(jsonPath, jsonResult, 'utf8');
  writeFileSync(textPath, textResult, 'utf8');

  const parsed = JSON.parse(jsonResult);
  const summary = parsed.metadata?.vulnerabilities || parsed.vulnerabilities || {};
  return { name: target.name, summary };
};

const summaries = TARGETS.map(runAudit);

console.log('Dependency audit summary:');
for (const { name, summary } of summaries) {
  console.log(
    `- ${name}: critical=${summary.critical || 0}, high=${summary.high || 0}, moderate=${
      summary.moderate || 0
    }, low=${summary.low || 0}`,
  );
}

console.log(`Reports saved to ${OUTPUT_DIR}`);