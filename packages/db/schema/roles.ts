import { index, uniqueIndex } from 'drizzle-orm/pg-core';
import { text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { noro } from './_schema';
import { users, userStatusValues } from './users';

export const tenantRoleValues = [
  'tenant_owner',
  'tenant_admin',
  'tenant_manager',
  'tenant_agent',
  'tenant_finance',
  'tenant_viewer',
] as const;

export const platformRoleValues = [
  'platform_owner',
  'platform_admin',
  'platform_ops',
  'platform_finance',
  'platform_support',
] as const;

export const platformRoleStatusValues = userStatusValues;

export type PlatformRole = (typeof platformRoleValues)[number];
export type PlatformRoleStatus = (typeof platformRoleStatusValues)[number];

export const platformRoleAssignments = noro.table(
  'platform_role_assignments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    role: text('role').$type<PlatformRole>().notNull(),
    status: text('status').$type<PlatformRoleStatus>().notNull().default('active'),
    grantedByUserId: uuid('granted_by_user_id').references(() => users.id),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    // Drizzle partial unique indexes should be reviewed with the generated SQL before use.
    // Until then, repositories must prevent more than one active assignment per user/role.
    uniqueIndex('platform_role_assignments_user_role_uidx').on(table.userId, table.role),
    index('platform_role_assignments_user_id_idx').on(table.userId),
    index('platform_role_assignments_role_idx').on(table.role),
  ],
);
