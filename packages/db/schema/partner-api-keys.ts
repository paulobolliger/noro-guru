import { integer, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { noro } from './_schema';

export const partnerApiKeys = noro.table(
  'partner_api_keys',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    companyName: text('company_name').notNull(),
    document: text('document').notNull(),
    apiKeyHash: text('api_key_hash').unique().notNull(),
    status: text('status').default('pending_approval').notNull(), // pending_approval, active, suspended
    rateLimitPerMinute: integer('rate_limit_per_minute').default(60).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
  }
);
