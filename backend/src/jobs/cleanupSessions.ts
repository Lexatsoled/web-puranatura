import { SessionService } from '../services/sessionService';

export async function cleanupExpiredSessions() {
  try {
    const deleted = await SessionService.cleanupExpiredSessions();
    console.log(`[CRON] ${deleted} sesiones expiradas eliminadas`);
  } catch (error) {
    console.error('[CRON] Error limpiando sesiones expiradas', error);
  }
}

if (process.env.NODE_ENV !== 'test') {
  setInterval(() => {
    cleanupExpiredSessions().catch((error) => {
      console.error('[CRON] Error en ejecución programada de limpieza', error);
    });
  }, 24 * 60 * 60 * 1000);
}
