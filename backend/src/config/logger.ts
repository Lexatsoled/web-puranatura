import pino from 'pino';
import pinoHttp from 'pino-http';

const targets = [];

// Console output en desarrollo
if (process.env.NODE_ENV !== 'production') {
  targets.push({
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss',
      ignore: 'pid,hostname',
    },
  });
}

// Loki en producción
if (process.env.NODE_ENV === 'production') {
  targets.push({
    target: 'pino-loki',
    options: {
      batching: true,
      interval: 5,
      host: process.env.LOKI_URL,
      labels: {
        application: 'purezanaturalis',
        environment: process.env.NODE_ENV,
      },
    },
  });
}

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: targets.length > 0 ? {
    targets,
  } : undefined,
  timestamp: pino.stdTimeFunctions.isoTime,
});

export const httpLogger = pinoHttp({
  logger,
  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 500 || err) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  customSuccessMessage: (req, res) => {
    return `${req.method} ${req.url} ${res.statusCode}`;
  },
});
