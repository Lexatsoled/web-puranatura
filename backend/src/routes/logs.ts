import { Router } from 'express';
import { logger } from '../utils/logger';
import { z } from 'zod';

const logsRouter = Router();

const logEntrySchema = z.object({
  level: z.enum(['info', 'warn', 'error']),
  message: z.string(),
  context: z.record(z.string(), z.any()).optional(),
  timestamp: z.string().optional(),
});

logsRouter.post('/', (req, res) => {
  const result = logEntrySchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ error: 'Invalid log format' });
    return;
  }

  const { level, message, context } = result.data;

  // Log with a specific tag to distinguish client logs
  logger.child({ source: 'client', ...context })[level](message);

  res.status(202).send();
});

export default logsRouter;
