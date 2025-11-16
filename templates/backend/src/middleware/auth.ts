import type { FastifyRequest, FastifyReply } from 'fastify';
import { verifyAccessToken } from '../services/authService';

// TODO: Middleware para requerir autenticación
export async function requireAuth(
  request: FastifyRequest,
  reply: FastifyReply
) {
  // 1. Obtener token de la cookie
  const token = request.cookies.accessToken;

  // 2. Si no hay token, retornar 401 Unauthorized
  if (!token) {
    return reply.status(401).send({
      error: 'No autenticado',
      message: 'Se requiere autenticación para acceder a este recurso'
    });
  }

  // 3. Verificar el token
  const decoded = verifyAccessToken(token);

  // 4. Si el token es inválido o expiró, retornar 401
  if (!decoded) {
    return reply.status(401).send({
      error: 'Token inválido',
      message: 'El token de autenticación es inválido o ha expirado'
    });
  }

  // 5. Asignar el usuario al request para uso posterior
  request.user = decoded;
}

// TODO: Middleware opcional para endpoints públicos que pueden usar auth
export async function optionalAuth(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const token = request.cookies.accessToken;

  if (token) {
    const decoded = verifyAccessToken(token);
    if (decoded) {
      request.user = decoded;
    }
  }
  
  // No hacer nada si no hay token o es inválido
  // El endpoint puede verificar si request.user existe
}
