import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// TODO: Tabla de usuarios
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  password_hash: text('password_hash').notNull(),
  name: text('name').notNull(),
  created_at: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
});

// TODO: Tabla de productos
export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  price: real('price').notNull(),
  stock: integer('stock').notNull().default(0),
  category: text('category').notNull(),
  subcategory: text('subcategory'),
  images: text('images', { mode: 'json' }).$type<string[]>().default([]), // Array de URLs
  benefits: text('benefits', { mode: 'json' }).$type<string[]>().default([]),
  ingredients: text('ingredients', { mode: 'json' }).$type<string[]>().default([]),
  usage: text('usage'),
  warnings: text('warnings'),
  rating: real('rating').default(0),
  reviews_count: integer('reviews_count').default(0),
  created_at: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
});

// TODO: Tabla de items del carrito
export const cart_items = sqliteTable('cart_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  user_id: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  product_id: integer('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').notNull().default(1),
  created_at: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
});

// TODO: Tabla de pedidos
export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  user_id: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  total: real('total').notNull(),
  status: text('status', { enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] })
    .notNull()
    .default('pending'),
  shipping_address: text('shipping_address', { mode: 'json' }).$type<{
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  }>(),
  created_at: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
  updated_at: text('updated_at')
    .notNull()
    .default(sql`(datetime('now'))`),
});

// TODO: Tabla de items de pedidos
export const order_items = sqliteTable('order_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  order_id: integer('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  product_id: integer('product_id')
    .notNull()
    .references(() => products.id),
  quantity: integer('quantity').notNull(),
  price: real('price').notNull(), // Precio al momento de la compra
  created_at: text('created_at')
    .notNull()
    .default(sql`(datetime('now'))`),
});

// TODO: Tipos inferidos para TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type CartItem = typeof cart_items.$inferSelect;
export type NewCartItem = typeof cart_items.$inferInsert;

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

export type OrderItem = typeof order_items.$inferSelect;
export type NewOrderItem = typeof order_items.$inferInsert;
