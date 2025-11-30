import { randomBytes } from 'crypto';
import { NextFunction, Request, Response } from 'express';

const CSRF_COOKIE = 'csrfToken';
const CSRF_HEADER = 'x-csrf-token';

const isSafeMethod = (method: string) =>
  ['GET', 'HEAD', 'OPTIONS'].includes(method.toUpperCase());

const skipPaths = new Set([
  '/api/analytics/events',
  '/api/security/csp-report',
]);

const generateToken = () => randomBytes(16).toString('hex');

export const csrfDoubleSubmit = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookieToken = req.cookies?.[CSRF_COOKIE];

  // Siempre emitimos cookie para que el cliente pueda reenviar el token
  if (!cookieToken) {
    // Emit CSRF cookie with SameSite=strict to reduce cross-site leakage.
    res.cookie(CSRF_COOKIE, generateToken(), {
      httpOnly: false,
      sameSite: 'strict',
      secure: req.secure,
    });
  }

  if (skipPaths.has(req.path)) {
    return next();
  }

  if (isSafeMethod(req.method)) {
    return next();
  }

  const headerToken = req.headers[CSRF_HEADER] as string | undefined;
  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return res.status(403).json({
      code: 'CSRF_MISMATCH',
      message: 'CSRF token inválido o ausente',
    });
  }

  return next();
};
