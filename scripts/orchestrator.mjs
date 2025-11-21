import { execSync } from 'node:child_process';

const commands = {
  lint: 'npm run lint',
  unit: 'npm run test:unit',
  integration: 'npm run test:ci',
  e2e: 'npm run test:e2e',
  security: 'npm run ci:security',
  build: 'npm run build',
};

function run(cmd) {
  console.log(`Ejecutando ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

const arg = process.argv[2];
  if (arg === 'ci') {
  const pkg = JSON.parse(execSync('node -e "console.log(JSON.stringify(require(\'./package.json\')))"').toString());
  run(commands.lint);
  run(commands.unit);
  run(commands.integration);
  run(commands.e2e);
  // Ejecutar paso de seguridad solo si existe el script en package.json
  if (pkg.scripts && pkg.scripts['ci:security']) {
    run(commands.security);
  } else {
    console.log('Nota: script ci:security no definido — saltando paso.');
  }
  run(commands.build);
} else if (commands[arg]) {
  run(commands[arg]);
} else {
  console.log(
    'Uso: node scripts/orchestrator.mjs <ci|lint|unit|integration|e2e|security|build>'
  );
}
