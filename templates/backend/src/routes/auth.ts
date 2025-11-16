import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import {
  signup,
  login,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from '../services/authService';
import { signupSchema, loginSchema } from '../types/validation';
import { validate } from '../middleware/validate';
import { config } from '../config';

// TODO: Registrar todas las rutas de autenticación
export async function authRoutes(app: FastifyInstance) {
  
  // TODO: POST /signup - Registro de nuevo usuario
  app.post('/signup', {
    preHandler: validate(signupSchema)
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = request.body as { email: string; password: string; name: string };
      
      // Crear usuario
      const user = await signup(body);

      // Generar tokens
      const accessToken = generateAccessToken({
        userId: user.id,
        email: user.email
      });

      const refreshToken = generateRefreshToken({
        userId: user.id,
        email: user.email
      });

      // Setear cookies httpOnly
      reply.setCookie('accessToken', accessToken, {
        httpOnly: true,
        secure: config.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15 minutos
        path: '/'
      });

      reply.setCookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: config.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
        path: '/'
      });

      // Retornar usuario (sin password)
      return reply.status(201).send({ user });
      
    } catch (error) {
      const err = error as Error;
      
      if (err.message === 'El email ya está registrado') {
        return reply.status(409).send({
          error: 'Conflicto',
          message: err.message
        });
      }
      
      throw error;
    }
  });

  // TODO: POST /login - Iniciar sesión
  app.post('/login', {
    preHandler: validate(loginSchema)
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const body = request.body as { email: string; password: string };
    
    // Intentar login
    const user = await login(body);

    // Si las credenciales son inválidas
    if (!user) {
      return reply.status(401).send({
        error: 'No autorizado',
        message: 'Email o contraseña incorrectos'
      });
    }

    // Generar tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email
    });

    // Setear cookies httpOnly
    reply.setCookie('accessToken', accessToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
      path: '/'
    });

    reply.setCookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/'
    });

    // Retornar usuario
    return reply.send({ user });
  });

  // TODO: POST /logout - Cerrar sesión
  app.post('/logout', async (request: FastifyRequest, reply: FastifyReply) => {
    // Limpiar cookies
    reply.clearCookie('accessToken', { path: '/' });
    reply.clearCookie('refreshToken', { path: '/' });

    return reply.send({
      message: 'Sesión cerrada exitosamente'
    });
  });

  // TODO: POST /refresh - Refrescar access token
  app.post('/refresh', async (request: FastifyRequest, reply: FastifyReply) => {
    // Obtener refresh token de la cookie
    const refreshToken = request.cookies.refreshToken;

    if (!refreshToken) {
      return reply.status(401).send({
        error: 'No autenticado',
        message: 'No se encontró refresh token'
      });
    }

    // Verificar refresh token
    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded) {
      return reply.status(401).send({
        error: 'Token inválido',
        message: 'El refresh token es inválido o ha expirado'
      });
    }

    // Generar nuevo access token
    const newAccessToken = generateAccessToken({
      userId: decoded.userId,
      email: decoded.email
    });

    // Setear nuevo access token en cookie
    reply.setCookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
      path: '/'
    });

    return reply.send({
      message: 'Token refrescado exitosamente'
    });
  });

  // TODO: GET /me - Obtener usuario actual (protegido)
  app.get('/me', {
    preHandler: async (request, reply) => {
      // Reutilizar lógica de requireAuth inline
      const token = request.cookies.accessToken;
      if (!token) {
        return reply.status(401).send({ error: 'No autenticado' });
      }
      const decoded = verifyRefreshToken(token);
      if (!decoded) {
        return reply.status(401).send({ error: 'Token inválido' });
      }
      request.user = decoded;
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    // El usuario ya está en request.user gracias al preHandler
    return reply.send({
      user: {
        id: request.user!.userId,
        email: request.user!.email
      }
    });
  });
}
