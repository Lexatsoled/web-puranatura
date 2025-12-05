import { Request } from 'express';

export const getClientIp = (req: Request) =>
  Array.isArray(req.headers['x-forwarded-for'])
    ? req.headers['x-forwarded-for'][0]
    : req.headers['x-forwarded-for'] || req.socket.remoteAddress;
