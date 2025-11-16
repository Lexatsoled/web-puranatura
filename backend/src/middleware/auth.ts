import type { FastifyReply, FastifyRequest } from 'fastify';
import { verifyAccessToken } from '../services/authService';
import { config } from '../config';

const adminEmailSet = new Set(
  (config.ADMIN_EMAILS || '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean),
);

const extractTokenFromRequest = (request: FastifyRequest): string | undefined => {
  const cookieToken = request.cookies?.accessToken;
  if (cookieToken) {
    return cookieToken;
  }
  const authorization = request.headers.authorization;
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.slice(7).trim();
  }
  return undefined;
};

export function isAdminUser(email?: string | null): boolean {
  if (!email) return false;
  return adminEmailSet.has(email.toLowerCase());
}

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  const token = extractTokenFromRequest(request);

  if (!token) {
    return reply.status(401).send({
      error: 'No autenticado',
      message: 'Se requiere autenticacion para acceder a este recurso',
    });
  }

  const decoded = verifyAccessToken(token);
  if (!decoded) {
    return reply.status(401).send({
      error: 'Token invalido',
      message: 'El token de autenticacion es invalido o ha expirado',
    });
  }

  request.user = decoded;
}

export async function optionalAuth(request: FastifyRequest, _reply: FastifyReply) {
  const token = extractTokenFromRequest(request);

  if (token) {
    const decoded = verifyAccessToken(token);
    if (decoded) {
      request.user = decoded;
    }
  }
}

export function requireRole(role: 'admin') {
  return async function roleGuard(request: FastifyRequest, reply: FastifyReply) {
    await requireAuth(request, reply);
    if (reply.sent) {
      return;
    }

    if (role === 'admin' && !isAdminUser(request.user?.email ?? null)) {
      return reply.status(403).send({
        error: 'No autorizado',
        message: 'Se requiere rol de administrador',
      });
    }
  };
}
