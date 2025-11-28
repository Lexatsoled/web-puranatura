const { spawn } = require('child_process');
const { resolve } = require('path');

const flag = process.env.CANARY_FLAG ?? 'flag.analyticsIngest';
const steps = [5, 25, 50, 100];
const scriptPath = resolve('scripts/update-flag.cjs');

const run = (rollout) =>
  new Promise((resolvePromise, reject) => {
    const args = [scriptPath, '--flag', flag, '--rollout', String(rollout)];
    const child = spawn(process.execPath, args, { stdio: 'inherit' });
    child.on('exit', (code) => {
      if (code === 0) {
        resolvePromise();
      } else {
        reject(new Error(`update-flag exit ${code}`));
      }
    });
  });

const main = async () => {
  console.log(`Iniciando canary en ${flag}`);
  for (const rollout of steps) {
    console.log(`Aplicando rollout ${rollout}%`);
    await run(rollout);
  }
  console.log('Canary completado');
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
