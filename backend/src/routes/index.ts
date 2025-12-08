import { Express } from 'express';
import authRouter from './auth';
import analyticsRouter from './analytics';
import cspReportsRouter from './cspReports';
import healthRouter from './health';
import ordersRouter from './orders';
import productsRouter from './products';
import logsRouter from './logs';

export const registerRoutes = (app: Express) => {
  app.use('/api/health', healthRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/analytics', analyticsRouter);
  app.use('/api/security', cspReportsRouter);
  app.use('/api/products', productsRouter);
  app.use('/api/orders', ordersRouter);
  app.use('/api/logs', logsRouter);
  // /api/ai removed — this project intentionally does not include a built-in
  // LLM provider integration. Use external orchestration (e.g. n8n webhooks)
  // if you need to add AI provider integration later.
};
