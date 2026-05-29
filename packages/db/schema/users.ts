import { index } from 'drizzle-orm/pg-core';
import { jsonb, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { noro } from './_schema';

export const userStatusValues = ['active', 'invited', 'blocked', 'archived'] as const;
export type UserStatus = (typeof userStatusValues)[number];

export const users = noro.table(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    displayName: text('display_name'),
    email: text('email').notNull(),
    phone: text('phone'),
    avatarUrl: text('avatar_url'),
    status: text('status').$type<UserStatus>().notNull().default('active'),
    metadata: jsonb('metadata').$type<Record<string, unknown>>(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('users_email_idx').on(table.email),
    index('users_status_idx').on(table.status),
  ],
);
