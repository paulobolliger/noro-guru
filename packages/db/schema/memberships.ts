import { index, uniqueIndex } from 'drizzle-orm/pg-core';
import { jsonb, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { noro } from './_schema';
import { tenantRoleValues } from './roles';
import { tenants } from './tenants';
import { users, userStatusValues } from './users';

export const membershipStatusValues = userStatusValues;
export type MembershipStatus = (typeof membershipStatusValues)[number];
export type TenantRole = (typeof tenantRoleValues)[number];

export const tenantMemberships = noro.table(
  'tenant_memberships',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    role: text('role').$type<TenantRole>().notNull(),
    status: text('status').$type<MembershipStatus>().notNull().default('invited'),
    invitedByUserId: uuid('invited_by_user_id').references(() => users.id),
    joinedAt: timestamp('joined_at', { withTimezone: true }),
    metadata: jsonb('metadata').$type<Record<string, unknown>>(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    // Drizzle partial unique indexes should be reviewed with the generated SQL before use.
    // Until then, repositories must prevent more than one active membership per tenant/user.
    uniqueIndex('tenant_memberships_tenant_user_uidx').on(table.tenantId, table.userId),
    index('tenant_memberships_tenant_id_idx').on(table.tenantId),
    index('tenant_memberships_user_id_idx').on(table.userId),
    index('tenant_memberships_role_idx').on(table.role),
  ],
);
