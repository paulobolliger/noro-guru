import { index, uniqueIndex } from 'drizzle-orm/pg-core';
import { jsonb, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { noro } from './_schema';

export const moduleStatusValues = ['active', 'inactive', 'deprecated', 'future'] as const;
export type ModuleStatus = (typeof moduleStatusValues)[number];

export const initialModuleKeys = [
  'crm',
  'sites',
  'finance',
  'proposals',
  'checkout',
  'billing',
  'suppliers',
  'groups',
  'ai',
  'academy',
] as const;

export const futureModuleKeys = [
  'catalog',
  'reservations',
  'booking_engine',
  'customer_portal',
  'reports',
  'marketing',
  'email_marketing',
  'social',
  'campaigns',
  'content',
  'communications',
  'whatsapp',
  'automation',
] as const;

export type InitialModuleKey = (typeof initialModuleKeys)[number];
export type FutureModuleKey = (typeof futureModuleKeys)[number];
export type ModuleKey = InitialModuleKey | FutureModuleKey;

export const modules = noro.table(
  'modules',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    key: text('key').$type<ModuleKey>().notNull(),
    name: text('name').notNull(),
    description: text('description'),
    status: text('status').$type<ModuleStatus>().notNull().default('future'),
    defaultLimits: jsonb('default_limits').$type<Record<string, unknown>>(),
    defaultSettings: jsonb('default_settings').$type<Record<string, unknown>>(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('modules_key_uidx').on(table.key),
    index('modules_status_idx').on(table.status),
  ],
);
