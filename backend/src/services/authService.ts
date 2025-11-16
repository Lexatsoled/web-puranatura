import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { SignOptions, Secret } from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { eq } from 'drizzle-orm';
import { db } from '../db/client';
import { users } from '../db/schema';
import { config } from '../config';
import type { SignupInput, LoginInput } from '../types/validation';
import type { User, TokenPayload } from '../types/auth';
import { SessionService } from './sessionService';

const SALT_ROUNDS = 12;
const REFRESH_TOKEN_DEFAULT_MS = 7 * 24 * 60 * 60 * 1000;

interface RefreshTokenPayload extends TokenPayload {
  familyId: string;
  jti: string;
}

const durationRegex = /^(\d+)([smhd])$/i;
const durationMap: Record<string, number> = {
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
};

function parseDuration(value?: string): number {
  if (!value) {
    return REFRESH_TOKEN_DEFAULT_MS;
  }
  const match = value.trim().match(durationRegex);
  if (!match) {
    return REFRESH_TOKEN_DEFAULT_MS;
  }
  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  return amount * (durationMap[unit] ?? durationMap.d);
}

const REFRESH_TOKEN_TTL_MS = parseDuration(config.JWT_REFRESH_EXPIRES_IN);

export async function signup(data: SignupInput): Promise<User> {
  const existingUser = await db.select().from(users).where(eq(users.email, data.email)).get();

  if (existingUser) {
    throw new Error('El email ya está registrado');
  }

  const password_hash = await bcrypt.hash(data.password, SALT_ROUNDS);

  const newUser = await db
    .insert(users)
    .values({
      email: data.email,
      password_hash,
      name: data.name,
    })
    .returning()
    .get();

  const { password_hash: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword as User;
}

export async function login(data: LoginInput): Promise<User | null> {
  const user = await db.select().from(users).where(eq(users.email, data.email)).get();

  if (!user) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password_hash);

  if (!isPasswordValid) {
    return null;
  }

  const { password_hash: _, ...userWithoutPassword } = user;
  return userWithoutPassword as User;
}

export function generateAccessToken(payload: TokenPayload): string {
  const tokenPayload: TokenPayload = {
    userId: payload.userId,
    email: payload.email,
  };

  const options: SignOptions = {
    expiresIn: config.JWT_EXPIRES_IN as unknown as SignOptions['expiresIn'],
  };

  return jwt.sign(tokenPayload, config.JWT_SECRET as Secret, options);
}

export function generateRefreshToken(payload: RefreshTokenPayload): string {
  const options: SignOptions = {
    expiresIn: config.JWT_REFRESH_EXPIRES_IN as unknown as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, config.JWT_REFRESH_SECRET as Secret, options);
}

export function verifyAccessToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as TokenPayload;
    return decoded;
  } catch {
    return null;
  }
}

export function verifyRefreshToken(token: string): RefreshTokenPayload | null {
  try {
    return jwt.verify(token, config.JWT_REFRESH_SECRET) as RefreshTokenPayload;
  } catch {
    return null;
  }
}

const createFamilyId = () => randomBytes(16).toString('hex');
const createTokenId = () => randomBytes(16).toString('hex');
const getRefreshExpiryDate = () => new Date(Date.now() + REFRESH_TOKEN_TTL_MS);

interface IssueTokenParams {
  userId: number;
  email: string;
  familyId?: string;
  userAgent?: string;
  ipAddress?: string;
}

async function issueTokens(params: IssueTokenParams) {
  const familyId = params.familyId ?? createFamilyId();
  const accessToken = generateAccessToken({
    userId: params.userId,
    email: params.email,
  });

  const refreshToken = generateRefreshToken({
    userId: params.userId,
    email: params.email,
    familyId,
    jti: createTokenId(),
  });

  await SessionService.createSession({
    userId: String(params.userId),
    familyId,
    token: refreshToken,
    userAgent: params.userAgent,
    ipAddress: params.ipAddress,
    expiresAt: getRefreshExpiryDate(),
  });

  return { accessToken, refreshToken, familyId };
}

export async function issueTokensForUser(
  user: User,
  userAgent?: string,
  ipAddress?: string,
) {
  return issueTokens({
    userId: user.id,
    email: user.email,
    userAgent,
    ipAddress,
  });
}

export async function refreshTokensWithRotation(
  refreshToken: string,
  userAgent?: string,
  ipAddress?: string,
) {
  const payload = verifyRefreshToken(refreshToken);
  if (!payload) {
    throw new Error('Invalid refresh token');
  }

  const isReused = await SessionService.detectReuse(refreshToken);
  if (isReused) {
    await SessionService.revokeFamilyTokens(payload.familyId, 'token_reuse_detected');
    throw new Error('Token reuse detected');
  }

  const session = await SessionService.verifyToken(refreshToken);
  if (!session) {
    throw new Error('Session not found or revoked');
  }

  await SessionService.revokeSession(session.id, 'rotated');

  const tokens = await issueTokens({
    userId: payload.userId,
    email: payload.email,
    familyId: payload.familyId,
    userAgent,
    ipAddress,
  });

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
}

export async function revokeSessionByToken(refreshToken: string, reason = 'user_logout') {
  await SessionService.revokeByToken(refreshToken, reason);
}

export async function revokeAllSessions(userId: number, reason = 'user_logout_all') {
  await SessionService.revokeUserSessions(String(userId), reason);
}
