// @vitest-environment node
import bcrypt from 'bcryptjs';
import request from 'supertest';
import { describe, it, beforeAll, afterAll, expect, vi } from 'vitest';

const smokeCredentials = {
  email: 'smoke@puranatura.test',
  password: 'SmokeP@ss123',
};

const smokeUserRecord = {
  id: 'smoke-user',
  email: smokeCredentials.email,
  firstName: 'Smoke',
  lastName: 'User',
  phone: null,
  passwordHash: bcrypt.hashSync(smokeCredentials.password, 12),
};

vi.mock('../backend/src/prisma', () => {
  return {
    prisma: {
      $queryRawUnsafe: async () => [{ ok: 1 }],
      product: {
        count: async () => 3,
      },
      user: {
        findUnique: async ({
          where,
        }: {
          where?: { email?: string; id?: string };
        }) => {
          if (where?.email && where.email === smokeCredentials.email) {
            return smokeUserRecord;
          }
          if (where?.id && where.id === smokeUserRecord.id) {
            return smokeUserRecord;
          }
          return null;
        },
      },
      $disconnect: async () => {},
      $connect: async () => {},
    },
  };
});

let app: any;
let closeApp: (() => Promise<void>) | undefined;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  process.env.ADMIN_EMAILS = 'not-admin@puranatura.test';
  const backend = await import('../backend/src/app');
  app = backend.app;
  closeApp = backend.closeApp;
});

afterAll(async () => {
  if (closeApp) {
    await closeApp();
  }
});

describe('Guardas auth/de rol de administrador', () => {
  it('devuelve 401 en /api/orders si no hay token', async () => {
    const res = await request(app).get('/api/orders');
    expect(res.status).toBe(401);
    expect(res.body?.message).toMatch(/autenticado/i);
  });

  it('bloquea la creaci├│n de productos a usuarios no administradores (403)', async () => {
    const csrfResponse = await request(app).get('/api/health');
    const csrfCookie = Array.isArray(csrfResponse.headers['set-cookie'])
      ? csrfResponse.headers['set-cookie'].find((cookie) =>
          cookie.startsWith('csrfToken=')
        )
      : undefined;
    const csrfToken = csrfCookie?.split(';')[0].split('=')[1];

    const login = await request(app)
      .post('/api/auth/login')
      .set('x-csrf-token', csrfToken ?? '')
      .set('Cookie', csrfCookie ? csrfCookie.split(';')[0] : '')
      .send({
        email: smokeCredentials.email,
        password: smokeCredentials.password,
      });
    expect(login.status).toBe(200);

    const authCookies = Array.isArray(login.headers['set-cookie'])
      ? login.headers['set-cookie']
      : [];
    const cookieHeader = [
      ...authCookies.map((cookie) => cookie.split(';')[0]),
      csrfCookie ? csrfCookie.split(';')[0] : '',
    ]
      .filter(Boolean)
      .join('; ');

    const create = await request(app)
      .post('/api/products')
      .set('x-csrf-token', csrfToken ?? '')
      .set('Cookie', cookieHeader)
      .send({
        name: 'Producto Test',
        slug: 'producto-test-403',
        price: 1,
        stock: 1,
      });

    expect(create.status).toBe(403);
    expect(create.body?.message).toMatch(/admin/i);
  });
});
