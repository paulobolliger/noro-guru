import { index, uniqueIndex } from 'drizzle-orm/pg-core';
import { jsonb, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { noro } from './_schema';
import { plans } from './plans';
import { userStatusValues } from './users';

export const tenantStatusValues = userStatusValues;
export const tenantBillingStatusValues = [
  'trialing',
  'current',
  'past_due',
  'suspended',
  'cancelled',
  'exempt',
] as const;

export type TenantStatus = (typeof tenantStatusValues)[number];
export type TenantBillingStatus = (typeof tenantBillingStatusValues)[number];

export const tenants = noro.table(
  'tenants',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    legalName: text('legal_name'),
    document: text('document'),
    email: text('email'),
    phone: text('phone'),
    status: text('status').$type<TenantStatus>().notNull().default('active'),
    planId: uuid('plan_id').references(() => plans.id),
    billingStatus: text('billing_status').$type<TenantBillingStatus>().notNull().default('trialing'),
    metadata: jsonb('metadata').$type<Record<string, unknown>>(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('tenants_slug_uidx').on(table.slug),
    index('tenants_status_idx').on(table.status),
    index('tenants_plan_id_idx').on(table.planId),
    index('tenants_billing_status_idx').on(table.billingStatus),
  ],
);
