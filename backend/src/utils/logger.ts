import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';

const logDirectory = path.join(process.cwd(), 'logs');

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

// Create the logger
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info', // Default to info level
  format: logFormat,
  defaultMeta: { service: 'puranatura-backend' },
  transports: [
    // Console transport
    new winston.transports.Console({
      format:
        process.env.NODE_ENV === 'development'
          ? winston.format.combine(
              winston.format.colorize(),
              winston.format.simple()
            )
          : logFormat,
    }),
    // Daily Rotate File transport
    new winston.transports.DailyRotateFile({
      filename: path.join(logDirectory, 'application-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'info',
    }),
    // Separate error log
    new winston.transports.DailyRotateFile({
      filename: path.join(logDirectory, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'error',
    }),
  ],
});

export type Logger = typeof logger;
