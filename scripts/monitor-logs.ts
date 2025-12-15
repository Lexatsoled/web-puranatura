import fs from 'fs/promises';
import path from 'path';

const LOG_DIR = path.join(process.cwd(), 'logs');
const ERROR_LOG_PREFIX = 'error-';
const MAX_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB threshold

async function monitorLogs() {
  console.log(`[MONITOR] Checking logs in ${LOG_DIR}...`);

  try {
    const files = await fs.readdir(LOG_DIR);
    const errorLogs = files.filter(
      (f) => f.startsWith(ERROR_LOG_PREFIX) && f.endsWith('.log')
    );

    if (errorLogs.length === 0) {
      console.log('[MONITOR] No error logs found. Status: GREEN');
      return;
    }

    let hasWaitning = false;

    for (const file of errorLogs) {
      const filePath = path.join(LOG_DIR, file);
      const stats = await fs.stat(filePath);
      const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);

      if (stats.size > MAX_SIZE_BYTES) {
        console.error(
          `[ALERT] Log file ${file} is too large: ${sizeMb} MB (Limit: 50 MB)`
        );
        hasWaitning = true;
      } else {
        console.log(`[OK] ${file}: ${sizeMb} MB`);
      }
    }

    if (hasWaitning) {
      process.exit(1);
    } else {
      console.log('[MONITOR] All logs within limits. Status: GREEN');
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.log(
        '[MONITOR] Log directory not found (fresh install?). Status: GREEN'
      );
      return;
    }
    console.error('[MONITOR] Failed to check logs:', error);
    process.exit(1);
  }
}

monitorLogs();
