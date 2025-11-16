// TODO: Tipos de autenticación

export interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenPayload {
  userId: number;
  email: string;
}

export interface AuthResponse {
  user: User;
}

// TODO: Extender FastifyRequest para incluir user
declare module 'fastify' {
  interface FastifyRequest {
    user?: TokenPayload;
  }
}
