import { sqliteTable, text, real, integer } from 'drizzle-orm/sqlite-core';
import { createId } from '@paralleldrive/cuid2';

export const orderStatusEnum = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
] as const;
export type OrderStatus = (typeof orderStatusEnum)[number];

export const orders = sqliteTable('orders', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => `ORD-${Date.now()}-${createId()}`),
  userId: text('user_id'),
  shippingAddress: text('shipping_address', { mode: 'json' })
    .$type<{
      firstName: string;
      lastName: string;
      company?: string;
      street: string;
      apartment?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      phone: string;
    }>()
    .notNull(),
  paymentMethod: text('payment_method', { mode: 'json' })
    .$type<{
      type: 'credit_card' | 'debit_card' | 'bank_transfer' | 'cash_on_delivery';
    }>()
    .notNull(),
  orderNotes: text('order_notes'),
  subtotal: real('subtotal').notNull(),
  shipping: real('shipping').notNull(),
  tax: real('tax').notNull(),
  discount: real('discount').default(0),
  total: real('total').notNull(),
  status: text('status', {
    enum: orderStatusEnum,
  })
    .notNull()
    .default('pending'),
  trackingNumber: text('tracking_number'),
  adminNotes: text('admin_notes'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
});

export const orderItems = sqliteTable('order_items', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  orderId: text('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  productId: text('product_id').notNull(),
  productName: text('product_name').notNull(),
  productImage: text('product_image'),
  variantId: text('variant_id'),
  variantName: text('variant_name'),
  price: real('price').notNull(),
  quantity: integer('quantity').notNull(),
  subtotal: real('subtotal').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
    .notNull(),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
