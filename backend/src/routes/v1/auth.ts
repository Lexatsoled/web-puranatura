import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import {
  signup,
  login,
  verifyAccessToken,
  issueTokensForUser,
  refreshTokensWithRotation,
  revokeSessionByToken,
  revokeAllSessions,
} from '../../services/authService';
import { signupSchema, loginSchema } from '../../types/validation';
import { validate } from '../../middleware/validate';
import { config } from '../../config';
import { createRateLimitConfig } from '../../config/rateLimitRules';
import { requireAuth } from '../../middleware/auth';
import { logAuthAttempt, logSecurityEvent } from '../../utils/logging.js';

const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000;
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const setAuthCookies = (
  reply: FastifyReply,
  tokens: { accessToken: string; refreshToken: string },
) => {
  reply.setCookie('accessToken', tokens.accessToken, {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: ACCESS_TOKEN_MAX_AGE,
    path: '/',
  });

  reply.setCookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: REFRESH_TOKEN_MAX_AGE,
    path: '/',
  });
};

export async function authRoutes(app: FastifyInstance) {
  app.post(
    '/signup',
    {
      config: {
        rateLimit: createRateLimitConfig('register'),
      },
      preHandler: validate(signupSchema),
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const body = request.body as { email: string; password: string; name: string };
        const user = await signup(body);
        const tokens = await issueTokensForUser(user, request.headers['user-agent'], request.ip);
        setAuthCookies(reply, tokens);

        return reply.status(201).send({ user });
      } catch (error) {
        const err = error as Error;

        if (err.message === 'El email ya está registrado') {
          return reply.status(409).send({
            error: 'Conflicto',
            message: err.message,
          });
        }

        throw error;
      }
    },
  );

  app.post(
    '/login',
    {
      config: {
        rateLimit: createRateLimitConfig('login'),
      },
      preHandler: validate(loginSchema),
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const body = request.body as { email: string; password: string };
      const user = await login(body);

      if (!user) {
        logAuthAttempt(body.email, false, request.ip);
        logSecurityEvent('login_failed', {
          ip: request.ip,
          email: body.email,
        });

        return reply.status(401).send({
          error: 'No autorizado',
          message: 'Email o contraseña incorrectos',
        });
      }

      logAuthAttempt(body.email, true, request.ip);
      const tokens = await issueTokensForUser(user, request.headers['user-agent'], request.ip);
      setAuthCookies(reply, tokens);

      return reply.send({ user });
    },
  );

  app.post('/logout', async (request: FastifyRequest, reply: FastifyReply) => {
    const refreshToken = request.cookies.refreshToken;
    if (refreshToken) {
      await revokeSessionByToken(refreshToken, 'user_logout');
    }

    reply.clearCookie('accessToken', { path: '/' });
    reply.clearCookie('refreshToken', { path: '/' });

    return reply.send({
      message: 'Sesión cerrada exitosamente',
    });
  });

  app.post('/refresh', async (request: FastifyRequest, reply: FastifyReply) => {
    const refreshToken = request.cookies.refreshToken;

    if (!refreshToken) {
      return reply.status(401).send({
        error: 'No autenticado',
        message: 'No se encontró refresh token',
      });
    }

    try {
      const tokens = await refreshTokensWithRotation(
        refreshToken,
        request.headers['user-agent'],
        request.ip,
      );
      setAuthCookies(reply, tokens);

      return reply.send({ message: 'Token refrescado exitosamente' });
    } catch (error) {
      app.log.warn(error);
      await revokeSessionByToken(refreshToken, 'invalid_refresh_attempt');
      reply.clearCookie('accessToken', { path: '/' });
      reply.clearCookie('refreshToken', { path: '/' });

      return reply.status(401).send({
        error: 'Token inválido',
        message: 'El refresh token es inválido o ha expirado',
      });
    }
  });

  app.get('/me', async (request: FastifyRequest, reply: FastifyReply) => {
    const token = request.cookies.accessToken;
    if (!token) {
      return reply.send({ user: null });
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return reply.send({ user: null });
    }

    return reply.send({
      user: {
        id: decoded.userId,
        email: decoded.email,
      },
    });
  });

  app.post(
    '/logout-all',
    {
      preHandler: [requireAuth],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user?.userId;
      if (!userId) {
        return reply.status(401).send({
          error: 'No autenticado',
          message: 'No se pudo validar la sesión',
        });
      }

      await revokeAllSessions(userId);
      reply.clearCookie('accessToken', { path: '/' });
      reply.clearCookie('refreshToken', { path: '/' });

      return reply.send({ message: 'Sesiones revocadas exitosamente' });
    },
  );
}


