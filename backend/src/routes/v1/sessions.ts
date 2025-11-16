import type { FastifyInstance, FastifyRequest } from 'fastify';
import { SessionService } from '../../services/sessionService';
import { requireAuth } from '../../middleware/auth';

type SessionResponse = {
  id: string;
  device: string | null;
  ipAddress: string | null;
  createdAt: Date;
  lastUsedAt: Date | null;
  expiresAt: Date;
  isCurrent: boolean;
};

const mapSession = (
  session: Awaited<ReturnType<typeof SessionService.getUserSessions>>[number],
  currentHash: string | null,
): SessionResponse => ({
  id: session.id,
  device: session.userAgent ?? 'Dispositivo desconocido',
  ipAddress: session.ipAddress ?? 'N/A',
  createdAt: session.createdAt,
  lastUsedAt: session.lastUsedAt ?? session.createdAt,
  expiresAt: session.expiresAt,
  isCurrent: currentHash ? session.tokenHash === currentHash : false,
});

export async function sessionsRoutes(app: FastifyInstance) {
  app.get(
    '/sessions',
    {
      preHandler: [requireAuth],
    },
    async (request, reply) => {
      const userId = request.user?.userId;
      if (!userId) {
        return reply.status(401).send({
          error: 'No autenticado',
          message: 'Sesión inválida',
        });
      }

      const currentRefreshToken = request.cookies.refreshToken;
      const currentHash = currentRefreshToken
        ? SessionService.getTokenHash(currentRefreshToken)
        : null;

      const userSessions = await SessionService.getUserSessions(String(userId));

      return reply.send({
        sessions: userSessions.map((session) => mapSession(session, currentHash)),
      });
    },
  );

  app.delete(
    '/sessions/:id',
    {
      preHandler: [requireAuth],
    },
    async (request: FastifyRequest, reply) => {
      const { id } = request.params as { id: string };
      const userId = request.user?.userId;
      if (!userId) {
        return reply.status(401).send({
          error: 'No autenticado',
          message: 'Sesión inválida',
        });
      }

      const userSessions = await SessionService.getUserSessions(String(userId));
      const session = userSessions.find((s) => s.id === id);

      if (!session) {
        return reply.status(404).send({ error: 'Session not found' });
      }

      await SessionService.revokeSession(id, 'user_revoked_session');
      return reply.send({ message: 'Session revoked' });
    },
  );
}
