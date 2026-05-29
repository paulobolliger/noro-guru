import { index, integer, uniqueIndex } from 'drizzle-orm/pg-core';
import { jsonb, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { noro } from './_schema';
import { modules } from './modules';

export const planStatusValues = ['active', 'draft', 'archived', 'deprecated'] as const;
export const planModuleStatusValues = ['enabled', 'disabled'] as const;

export const initialPlanKeys = ['free_site', 'starter', 'professional', 'agency', 'enterprise'] as const;

export type PlanStatus = (typeof planStatusValues)[number];
export type PlanModuleStatus = (typeof planModuleStatusValues)[number];
export type PlanKey = (typeof initialPlanKeys)[number] | string;

export const plans = noro.table(
  'plans',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    key: text('key').$type<PlanKey>().notNull(),
    name: text('name').notNull(),
    description: text('description'),
    status: text('status').$type<PlanStatus>().notNull().default('draft'),
    billingInterval: text('billing_interval'),
    priceCents: integer('price_cents'),
    currency: text('currency'),
    limits: jsonb('limits').$type<Record<string, unknown>>(),
    settings: jsonb('settings').$type<Record<string, unknown>>(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('plans_key_uidx').on(table.key),
    index('plans_status_idx').on(table.status),
  ],
);

export const planModules = noro.table(
  'plan_modules',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    planId: uuid('plan_id')
      .notNull()
      .references(() => plans.id),
    moduleId: uuid('module_id')
      .notNull()
      .references(() => modules.id),
    status: text('status').$type<PlanModuleStatus>().notNull().default('enabled'),
    limits: jsonb('limits').$type<Record<string, unknown>>(),
    settings: jsonb('settings').$type<Record<string, unknown>>(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('plan_modules_plan_module_uidx').on(table.planId, table.moduleId),
    index('plan_modules_plan_id_idx').on(table.planId),
    index('plan_modules_module_id_idx').on(table.moduleId),
  ],
);
