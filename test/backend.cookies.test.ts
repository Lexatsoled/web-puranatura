// @vitest-environment node
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { prisma } from '../backend/src/prisma';
import bcrypt from 'bcryptjs';

// Forzar flags de producción en cookies
process.env.NODE_ENV = 'production';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'file:./prisma/dev.db';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-cookie-secret';
process.env.JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || 'test-cookie-refresh';

let app: any;
let closeApp: () => Promise<void>;

beforeAll(async () => {
  const backend = await import('../backend/src/app');
  app = backend.app;
  closeApp = backend.closeApp;
}, 30000);

afterAll(async () => {
  if (closeApp) await closeApp();
});

const uniqueEmail = () => `user-${Date.now()}@test.dev`;

describe('Cookies de auth', () => {
  it('emite cookies HttpOnly, Secure y SameSite=Strict en producción', async () => {
    const email = uniqueEmail();
    const password = 'Test1234!';

    const agent = request.agent(app);

    // Mockear DB para evitar dependencias de esquema real
    vi.spyOn(prisma.user, 'findUnique')
      // register path: no existe usuario
      .mockResolvedValueOnce(null as any)
      // login path: usuario existente con hash
      .mockResolvedValueOnce({
        id: 'u-cookie',
        email,
        passwordHash:
          '$2a$10$uUpbYgvusZT6FJi1dV0t1Oc0wZqbt1zsa3RqeHGIcIvxZtmLhnJRC', // bcrypt("Test1234!")
        firstName: 'Test',
        lastName: 'User',
        phone: null,
      } as any);
    vi.spyOn(prisma.user, 'create').mockResolvedValue({
      id: 'u-cookie',
      email,
      firstName: 'Test',
      lastName: 'User',
      phone: null,
    } as any);
    vi.spyOn(bcrypt, 'compare').mockResolvedValue(true as any);

    // Obtener CSRF token de cookie
    const pre = await agent.get('/');
    const preSetCookie = pre.headers['set-cookie'] || [];
    const preCookies = Array.isArray(preSetCookie)
      ? preSetCookie
      : [String(preSetCookie)];
    const csrfCookie = preCookies.find((c: string) =>
      c.startsWith('csrfToken=')
    );
    const csrfToken = csrfCookie?.split(';')[0].split('=')[1];

    // Registrar usuario con CSRF válido
    const resRegister = await agent
      .post('/api/auth/register')
      .set('x-csrf-token', String(csrfToken))
      .send({
        email,
        password,
        firstName: 'Test',
        lastName: 'User',
      });

    expect(resRegister.status).toBe(201);

    // Validar flags de cookies emitidas en el registro (prod)
    const setCookieHeader = resRegister.headers['set-cookie'];
    const setCookie = Array.isArray(setCookieHeader)
      ? setCookieHeader
      : setCookieHeader
        ? [String(setCookieHeader)]
        : [];
    expect(setCookie.length).toBeGreaterThan(0);

    const allCookies = setCookie.join(';');
    expect(allCookies).toMatch(/HttpOnly/i);
    expect(allCookies).toMatch(/Secure/i);
    expect(allCookies).toMatch(/SameSite=Strict/i);
  });
});
