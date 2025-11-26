import { Router } from 'express';
import { register } from 'prom-client';
import { logger } from '../utils/logger';

const router = Router();

register.setDefaultLabels({
  service: 'puranatura-api',
});

router.get('/metrics', async (_req, res) => {
  try {
    const metrics = await register.metrics();
    res.setHeader('Content-Type', register.contentType);
    res.send(metrics);
  } catch (error) {
    logger.error({ error }, 'No se pudieron exponer las métricas');
    res.status(500).send('Error generando métricas');
  }
});

export default router;
