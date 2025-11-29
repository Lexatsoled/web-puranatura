import { test, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { execFile } from 'child_process';

function runScript(env: Record<string, string | undefined>) {
  return new Promise<{ stdout: string; stderr: string; code: number }>(
    (resolve) => {
      execFile(
        process.execPath,
        [path.join('scripts', 'cleanup-prisma-tmp.cjs')],
        { env: { ...process.env, ...env } },
        (err, stdout, stderr) => {
          if (err)
            return resolve({
              stdout,
              stderr,
              code: typeof err.code === 'number' ? err.code : 1,
            });
          resolve({ stdout, stderr, code: 0 });
        }
      );
    }
  );
}

test('cleanup-prisma-tmp removes .tmp files from provided candidate dir', async () => {
  const tmpBase = path.join(__dirname, 'tmp_cleanup_test');
  // cleanup before
  try {
    fs.rmSync(tmpBase, { recursive: true, force: true });
  } catch {}

  fs.mkdirSync(tmpBase, { recursive: true });
  // Create nested directories and .tmp files
  const nested = path.join(tmpBase, 'a', 'nested');
  fs.mkdirSync(nested, { recursive: true });
  const file1 = path.join(tmpBase, 'x.tmp');
  const file2 = path.join(nested, 'y.tmp');
  const file3 = path.join(tmpBase, 'keep.txt');
  fs.writeFileSync(file1, 'tmp1');
  fs.writeFileSync(file2, 'tmp2');
  fs.writeFileSync(file3, 'keep');

  const env = { PRISMA_TMP_CANDIDATES: JSON.stringify([tmpBase]) };
  const res = await runScript(env);

  // Expect output to mention removed files
  expect(res.stdout.toLowerCase()).toMatch(
    /removed\s+\d+\s+prisma|removed\s+\d+\s+tmp/i
  );
  // Two tmp files should be gone
  expect(fs.existsSync(file1)).toBe(false);
  expect(fs.existsSync(file2)).toBe(false);
  // non tmp file remains
  expect(fs.existsSync(file3)).toBe(true);

  // cleanup
  try {
    fs.rmSync(tmpBase, { recursive: true, force: true });
  } catch {}
});
