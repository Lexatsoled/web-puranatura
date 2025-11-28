const { readFile, writeFile } = require('fs/promises');
const { resolve } = require('path');

const FLAGS_PATH = resolve('config/flags.json');

const args = process.argv.slice(2);
const opts = {};

for (let i = 0; i < args.length; i += 2) {
  const key = args[i]?.replace(/^--/, '');
  const value = args[i + 1];
  if (key && value !== undefined) {
    opts[key] = value;
  }
}

const setFlag = async () => {
  if (!opts.flag) {
    throw new Error('Se requiere --flag');
  }
  const data = JSON.parse(await readFile(FLAGS_PATH, 'utf-8'));
  const current = data[opts.flag] ?? { enabled: false, rollout: 0 };

  if (opts.enabled !== undefined) {
    current.enabled = opts.enabled === 'true';
  }
  if (opts.rollout !== undefined) {
    const rollout = Number(opts.rollout);
    if (Number.isNaN(rollout) || rollout < 0 || rollout > 100) {
      throw new Error(`Rollout inválido: ${opts.rollout}`);
    }
    current.rollout = rollout;
  }

  data[opts.flag] = current;
  await writeFile(FLAGS_PATH, JSON.stringify(data, null, 2) + '\n', 'utf-8');
  console.log(
    `Flag ${opts.flag} => enabled=${current.enabled}, rollout=${current.rollout}%`
  );
};

setFlag().catch((error) => {
  console.error(error);
  process.exit(1);
});
