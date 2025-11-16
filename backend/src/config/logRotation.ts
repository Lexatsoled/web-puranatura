import fs from 'fs';
import path from 'path';
import { createStream, type Generator } from 'rotating-file-stream';

const LOG_DIR = path.resolve(process.cwd(), 'logs');
fs.mkdirSync(LOG_DIR, { recursive: true });

export type LogSizeUnit = 'B' | 'K' | 'M' | 'G';
export type LogSize = `${number}${LogSizeUnit}`;

export interface LogRotationOptions {
  retentionDays?: number;
  maxSize?: LogSize;
}

const createFileName = (prefix: string, time?: Date | number) => {
  if (!time) {
    return `${prefix}-current.log`;
  }

  const date = time instanceof Date ? time : new Date(time);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${prefix}-${year}-${month}-${day}.log`;
};

const DEFAULT_LOG_SIZE: LogSize = '10M';

export const createLogStream = (prefix: string, options: LogRotationOptions = {}) => {
  const generator: Generator = (time) => createFileName(prefix, time);

  return createStream(generator, {
    path: LOG_DIR,
    interval: '1d',
    compress: 'gzip',
    size: options.maxSize ?? DEFAULT_LOG_SIZE,
    maxFiles: options.retentionDays ?? 30,
  });
};
