const { spawnSync } = require('child_process');
const chalk = {
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
};

function runStep(name, command, args) {
  console.log(chalk.blue(`\n[REGRESSION] Running: ${name}...`));
  const result = spawnSync(command, args, { stdio: 'inherit', shell: true });

  if (result.status !== 0) {
    console.error(chalk.red(`[FAILED] ${name}`));
    process.exit(1);
  } else {
    console.log(chalk.green(`[SUCCESS] ${name}`));
  }
}

console.log(chalk.yellow('Starting Full Regression Suite...'));
const startTime = Date.now();

// 1. Linting
runStep('Linting', 'npm', ['run', 'lint']);

// 2. Type Checking
runStep('Type Checking (Frontend)', 'npm', ['run', 'type-check']);

// 3. Unit Tests
runStep('Unit Tests', 'npm', ['run', 'test:unit', '--', '--run']);

// 4. Build
runStep('Production Build', 'npm', ['run', 'build']);

// 5. Security Audit
runStep('Security Audit', 'npm', ['run', 'audit']);

const duration = ((Date.now() - startTime) / 1000).toFixed(2);
console.log(
  chalk.green(`\n\nAll checks passed in ${duration}s! Ready for deploy. 🚀`)
);
