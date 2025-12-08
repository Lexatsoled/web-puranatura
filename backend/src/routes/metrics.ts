import { Router } from 'express';
import { register } from 'prom-client';
import { logger } from '../utils/logger';

const router = Router();

register.setDefaultLabels({
  service: 'puranatura-api',
});

router.get('/metrics', async (req, res) => {
  try {
    const metricsToken = process.env.METRICS_TOKEN;
    const nodeEnv = process.env.NODE_ENV || 'development';

    // Si existe METRICS_TOKEN, exigir su presencia en la cabecera X-Metrics-Token.
    // En producción, insistimos en que exista un token o no exponemos métricas.
    if (metricsToken) {
      const provided = String(req.headers['x-metrics-token'] ?? '');
      if (!provided || provided !== metricsToken) {
        return res.status(403).json({ message: 'Forbidden' });
      }
    } else if (nodeEnv === 'production') {
      // En producción obligar a que METRICS_TOKEN esté configurado por seguridad.
      return res.status(503).json({
        message: 'Metrics not available (misconfigured in production)',
      });
    }

    const metrics = await register.metrics();
    res.setHeader('Content-Type', register.contentType);
    res.send(metrics);
  } catch (error) {
    logger.error('No se pudieron exponer las métricas', { error });
    res.status(500).send('Error generando métricas');
  }
});

export default router;
