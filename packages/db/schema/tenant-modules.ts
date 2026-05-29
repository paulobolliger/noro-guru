import { index, uniqueIndex } from 'drizzle-orm/pg-core';
import { jsonb, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { noro } from './_schema';
import { modules } from './modules';
import { tenants } from './tenants';

export const tenantModuleStatusValues = ['enabled', 'disabled', 'trial', 'suspended'] as const;
export const tenantModuleSourceValues = ['plan', 'addon', 'manual', 'trial', 'system'] as const;

export type TenantModuleStatus = (typeof tenantModuleStatusValues)[number];
export type TenantModuleSource = (typeof tenantModuleSourceValues)[number];

export const tenantModules = noro.table(
  'tenant_modules',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id),
    moduleId: uuid('module_id')
      .notNull()
      .references(() => modules.id),
    status: text('status').$type<TenantModuleStatus>().notNull().default('disabled'),
    source: text('source').$type<TenantModuleSource>().notNull().default('manual'),
    startsAt: timestamp('starts_at', { withTimezone: true }),
    endsAt: timestamp('ends_at', { withTimezone: true }),
    limits: jsonb('limits').$type<Record<string, unknown>>(),
    settings: jsonb('settings').$type<Record<string, unknown>>(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('tenant_modules_tenant_module_uidx').on(table.tenantId, table.moduleId),
    index('tenant_modules_tenant_id_idx').on(table.tenantId),
    index('tenant_modules_module_id_idx').on(table.moduleId),
    index('tenant_modules_status_idx').on(table.status),
  ],
);
