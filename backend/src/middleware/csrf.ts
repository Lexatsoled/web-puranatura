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
  // Parse cookies manually to avoid dependency on cookieParser middleware order
  const cookieHeader = req.headers.cookie;
  let cookieToken: string | undefined;

  if (cookieHeader) {
    const cookies = cookieHeader.split(';').reduce(
      (acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      },
      {} as Record<string, string>
    );
    cookieToken = cookies[CSRF_COOKIE];
  }

  // Siempre emitimos cookie para que el cliente pueda reenviar el token
  if (!cookieToken) {
    // Emit CSRF cookie with SameSite=strict to reduce cross-site leakage.
    const newToken = generateToken();
    res.cookie(CSRF_COOKIE, newToken, {
      httpOnly: false,
      sameSite: 'strict',
      secure: req.secure,
    });
    cookieToken = newToken;
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
