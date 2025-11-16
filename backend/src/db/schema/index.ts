import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export type ProductComponent = {
  name: string;
  description: string;
  amount?: string | null;
};

export type ProductFaq = {
  question: string;
  answer: string;
};

export type ScientificReference = {
  title: string;
  authors: string[];
  journal: string;
  year: number;
  doi?: string;
  url?: string;
  summary?: string;
};

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
  compare_at_price: real('compare_at_price'),
  stock: integer('stock').notNull().default(0),
  category: text('category').notNull(),
  subcategory: text('subcategory'),
  categories: text('categories', { mode: 'json' }).$type<string[]>().default([]),
  sku: text('sku'),
  is_featured: integer('is_featured', { mode: 'boolean' }).default(false).notNull(),
  images: text('images', { mode: 'json' }).$type<string[]>().default([]), // Array de URLs
  benefits: text('benefits', { mode: 'json' }).$type<string[]>().default([]),
  ingredients: text('ingredients', { mode: 'json' }).$type<string[]>().default([]),
  usage: text('usage'),
  dosage: text('dosage'),
  administration_method: text('administration_method'),
  warnings: text('warnings'),
  rating: real('rating').default(0),
  reviews_count: integer('reviews_count').default(0),
  detailed_description: text('detailed_description'),
  mechanism_of_action: text('mechanism_of_action'),
  benefits_description: text('benefits_description', { mode: 'json' }).$type<string[]>().default([]),
  health_issues: text('health_issues', { mode: 'json' }).$type<string[]>().default([]),
  components: text('components', { mode: 'json' }).$type<ProductComponent[]>().default([]),
  faqs: text('faqs', { mode: 'json' }).$type<ProductFaq[]>().default([]),
  scientific_references: text('scientific_references', { mode: 'json' }).$type<ScientificReference[]>().default([]),
  tags: text('tags', { mode: 'json' }).$type<string[]>().default([]),
  price_note: text('price_note'),
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

// TODO: Tipos inferidos para TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type CartItem = typeof cart_items.$inferSelect;
export type NewCartItem = typeof cart_items.$inferInsert;

export { orders, orderItems } from './orders';
export type { Order, NewOrder, OrderItem, NewOrderItem } from './orders';
export { sessions } from './sessions';
export type { Session as DbSession, NewSession } from './sessions';
