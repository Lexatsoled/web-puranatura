import { Express } from 'express';
import authRouter from './auth';
import analyticsRouter from './analytics';
import cspReportsRouter from './cspReports';
import healthRouter from './health';
import ordersRouter from './orders';
import productsRouter from './products';

export const registerRoutes = (app: Express) => {
  app.use('/api/health', healthRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/analytics', analyticsRouter);
  app.use('/api/security', cspReportsRouter);
  app.use('/api/products', productsRouter);
  app.use('/api/orders', ordersRouter);
};
