import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import Fastify, { type FastifyInstance } from 'fastify';

// Configure all required env vars with valid values
process.env.DATABASE_URL = ':memory:';
process.env.DATABASE_PATH = ':memory:';
process.env.ADMIN_EMAILS = 'admin@test.com';
process.env.JWT_SECRET = 'test_jwt_secret_value_that_is_long_enough_for_orders_32chars';
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_value_long_enough_orders_refresh_32c';
process.env.COOKIE_SECRET = 'orders_cookie_secret_value_long_enough_for_tests_32chars';
process.env.CSRF_SECRET = 'csrf_secret_value_that_is_long_enough_for_tests_32chars';
process.env.BACKUP_DIR = './backups-tests';
process.env.BACKUP_ENCRYPTION_KEY = 'test_backup_encryption_key_32c';
process.env.BACKUP_DAILY_RETENTION = '5';
process.env.BACKUP_MONTHLY_RETENTION = '2';
process.env.BACKUP_COMPRESS = 'false';
process.env.BACKUP_SCHEDULE = '0 3 * * *';
process.env.NODE_ENV = 'test';
process.env.PORT = '3000';
process.env.FRONTEND_URL = 'http://localhost:5173';

describe('Orders API', () => {
  let app: FastifyInstance;
  let userToken: string;
  let adminToken: string;
  let userOrderId: string;
  let otherOrderId: string;
  let sqliteInstance: unknown = null;

  beforeAll(async () => {
    const dbModule = await import('../../db/client.js');
    const dbInfra = await import('../../db/index.js');
    const schemaModule = await import('../../db/schema/index.js');
    const orderSchema = await import('../../db/schema/orders.js');
    const authModule = await import('../../services/authService.js');
    const { orderRoutes } = await import('../v1/orders.js');

    await dbInfra.closeConnectionPool();

    const { sqlite } = dbModule;
    sqliteInstance = sqlite;
    const { db } = dbModule;
    const { users } = schemaModule;
    const { orders, orderItems } = orderSchema;
    const { generateAccessToken } = authModule;

    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
    `);

    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        shipping_address TEXT NOT NULL,
        payment_method TEXT NOT NULL,
        order_notes TEXT,
        subtotal REAL NOT NULL,
        shipping REAL NOT NULL,
        tax REAL NOT NULL,
        discount REAL DEFAULT 0,
        total REAL NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        tracking_number TEXT,
        admin_notes TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
    `);

    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS order_items (
        id TEXT PRIMARY KEY,
        order_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        product_name TEXT NOT NULL,
        product_image TEXT,
        variant_id TEXT,
        variant_name TEXT,
        price REAL NOT NULL,
        quantity INTEGER NOT NULL,
        subtotal REAL NOT NULL,
        created_at INTEGER NOT NULL,
        FOREIGN KEY(order_id) REFERENCES orders(id) ON DELETE CASCADE
      );
    `);

    const [user] = await db
      .insert(users)
      .values({
        email: 'user@test.com',
        password_hash: 'hash',
        name: 'Test User',
      })
      .returning();

    const [admin] = await db
      .insert(users)
      .values({
        email: 'admin@test.com',
        password_hash: 'hash',
        name: 'Admin',
      })
      .returning();

    const now = Date.now();
    const [orderA] = await db
      .insert(orders)
      .values({
        userId: String(user.id),
        shippingAddress: {
          firstName: 'Test',
          lastName: 'User',
          street: 'Main St',
          city: 'Madrid',
          state: 'Madrid',
          postalCode: '28001',
          country: 'Spain',
          phone: '+34 600 000 001',
        },
        paymentMethod: { type: 'credit_card' },
        subtotal: 50,
        shipping: 5,
        tax: 10,
        total: 65,
        status: 'pending',
        createdAt: new Date(now - 1000),
        updatedAt: new Date(now - 1000),
      })
      .returning();

    const [orderB] = await db
      .insert(orders)
      .values({
        userId: String(user.id),
        shippingAddress: {
          firstName: 'Test',
          lastName: 'User',
          street: 'Second St',
          city: 'Barcelona',
          state: 'Catalunya',
          postalCode: '08001',
          country: 'Spain',
          phone: '+34 600 000 002',
        },
        paymentMethod: { type: 'credit_card' },
        subtotal: 120,
        shipping: 10,
        tax: 20,
        total: 150,
        status: 'shipped',
        trackingNumber: 'TRACK-123',
        createdAt: new Date(now - 500),
        updatedAt: new Date(now - 500),
      })
      .returning();

    const [otherOrder] = await db
      .insert(orders)
      .values({
        userId: String(admin.id),
        shippingAddress: {
          firstName: 'Admin',
          lastName: 'User',
          street: 'Admin St',
          city: 'Madrid',
          state: 'Madrid',
          postalCode: '28002',
          country: 'Spain',
          phone: '+34 611 111 111',
        },
        paymentMethod: { type: 'credit_card' },
        subtotal: 80,
        shipping: 5,
        tax: 15,
        total: 100,
        status: 'delivered',
        createdAt: new Date(now - 200),
        updatedAt: new Date(now - 200),
      })
      .returning();

    await db.insert(orderItems).values([
      {
        orderId: orderA.id,
        productId: 'prod-1',
        productName: 'Producto 1',
        price: 25,
        quantity: 2,
        subtotal: 50,
      },
      {
        orderId: orderB.id,
        productId: 'prod-2',
        productName: 'Producto 2',
        price: 50,
        quantity: 3,
        subtotal: 150,
      },
      {
        orderId: otherOrder.id,
        productId: 'prod-3',
        productName: 'Producto 3',
        price: 100,
        quantity: 1,
        subtotal: 100,
      },
    ]);

    userOrderId = orderA.id;
    otherOrderId = otherOrder.id;

    userToken = generateAccessToken({ userId: user.id, email: user.email });
    adminToken = generateAccessToken({ userId: admin.id, email: admin.email });

    app = Fastify({ logger: false });
    await app.register(orderRoutes, { prefix: '/api' });
    await app.ready();
  }, 30000);

  afterAll(async () => {
    if (app) {
      await app.close();
    }
    if (sqliteInstance && typeof (sqliteInstance as { close: () => void }).close === 'function') {
      (sqliteInstance as { close: () => void }).close();
    }
    const { closeConnectionPool } = await import('../../db/index.js');
    await closeConnectionPool();
  });

  it('lists orders for the authenticated user', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/orders',
      headers: {
        authorization: `Bearer ${userToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    const payload = JSON.parse(response.body);
    expect(Array.isArray(payload.data)).toBe(true);
    expect(payload.data.length).toBeGreaterThanOrEqual(2);
    payload.data.forEach((order: any) => {
      expect(order.userId).toBeDefined();
    });
  });

  it('prevents users from reading orders that are not theirs', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `/api/orders/${otherOrderId}`,
      headers: {
        authorization: `Bearer ${userToken}`,
      },
    });

    expect(response.statusCode).toBe(404);
  });

  it('allows admin to update order status and tracking', async () => {
    const response = await app.inject({
      method: 'PATCH',
      url: `/api/orders/${userOrderId}`,
      headers: {
        authorization: `Bearer ${adminToken}`,
      },
      payload: {
        status: 'confirmed',
        trackingNumber: 'TRACK-999',
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.order.status).toBe('confirmed');
    expect(body.order.trackingNumber).toBe('TRACK-999');
  });

  it('returns aggregated stats for admin', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/orders/stats',
      headers: {
        authorization: `Bearer ${adminToken}`,
      },
    });

    expect(response.statusCode).toBe(200);
    const stats = JSON.parse(response.body);
    expect(stats.totalOrders).toBeGreaterThan(0);
    expect(Array.isArray(stats.ordersByStatus)).toBe(true);
    expect(Array.isArray(stats.recentOrders)).toBe(true);
  });
});
