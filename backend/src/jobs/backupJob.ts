import cron from 'node-cron';
import { backupService } from '../services/BackupService.js';
import { config } from '../config/index.js';
import { logger } from '../config/logger.js';

const schedule = config.BACKUP_SCHEDULE || '0 2 * * *';

if (process.env.NODE_ENV !== 'test') {
  cron.schedule(schedule, async () => {
    try {
      const result = await backupService.createBackup('full');
      logger.info(
        {
          event: 'backup_cron_completed',
          path: result.backupPath,
        },
        'Scheduled backup finished',
      );
    } catch (error) {
      logger.error(
        {
          err: error,
        },
        'Scheduled backup failed',
      );
    }
  });
}
