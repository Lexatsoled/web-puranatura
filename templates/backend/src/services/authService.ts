import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../db/client';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { config } from '../config';
import type { SignupInput, LoginInput } from '../types/validation';
import type { User, TokenPayload } from '../types/auth';

const SALT_ROUNDS = 12;

// TODO: Implementar signup
export async function signup(data: SignupInput): Promise<User> {
  // 1. Verificar que el email no exista
  const existingUser = await db.select().from(users).where(eq(users.email, data.email)).get();
  
  if (existingUser) {
    throw new Error('El email ya está registrado');
  }

  // 2. Hash de la contraseña con bcrypt
  const password_hash = await bcrypt.hash(data.password, SALT_ROUNDS);

  // 3. Insertar usuario en la base de datos
  const newUser = await db.insert(users).values({
    email: data.email,
    password_hash,
    name: data.name
  }).returning().get();

  // 4. Retornar usuario sin el hash de contraseña
  const { password_hash: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword as User;
}

// TODO: Implementar login
export async function login(data: LoginInput): Promise<User | null> {
  // 1. Buscar usuario por email
  const user = await db.select().from(users).where(eq(users.email, data.email)).get();
  
  if (!user) {
    return null; // Usuario no encontrado
  }

  // 2. Comparar password con bcrypt
  const isPasswordValid = await bcrypt.compare(data.password, user.password_hash);
  
  if (!isPasswordValid) {
    return null; // Contraseña incorrecta
  }

  // 3. Retornar usuario sin el hash de contraseña
  const { password_hash: _, ...userWithoutPassword } = user;
  return userWithoutPassword as User;
}

// TODO: Generar access token
export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN
  });
}

// TODO: Generar refresh token
export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, config.JWT_REFRESH_SECRET, {
    expiresIn: config.JWT_REFRESH_EXPIRES_IN
  });
}

// TODO: Verificar access token
export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    return null; // Token inválido o expirado
  }
}

// TODO: Verificar refresh token
export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, config.JWT_REFRESH_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    return null; // Token inválido o expirado
  }
}
