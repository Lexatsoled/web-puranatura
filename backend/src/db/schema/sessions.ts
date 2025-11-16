import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

/**
 * Tabla para rastrear sesiones activas / refresh tokens.
 */
export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(), // jti del refresh token
  userId: text('user_id').notNull(),
  familyId: text('family_id').notNull(),
  tokenHash: text('token_hash').notNull().unique(),
  userAgent: text('user_agent'),
  ipAddress: text('ip_address'),
  isRevoked: integer('is_revoked', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  lastUsedAt: integer('last_used_at', { mode: 'timestamp' }),
  revokedAt: integer('revoked_at', { mode: 'timestamp' }),
  revokedReason: text('revoked_reason'),
});

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
