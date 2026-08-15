import { boolean, index, numeric, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { noro } from './_schema';
import { tenants } from './tenants';
import { users } from './users';

export const exchangeRates = noro.table(
  'exchange_rates',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    
    // null para taxas globais da plataforma; preenchido para taxas customizadas da agência
    tenantId: uuid('tenant_id').references(() => tenants.id),
    
    fromCurrency: text('from_currency').notNull(), // 'USD', 'EUR', 'GBP', 'ARS', etc.
    toCurrency: text('to_currency').default('BRL').notNull(),
    
    rate: numeric('rate', { precision: 12, scale: 6 }).notNull(), // ex: 5.842500
    spreadPct: numeric('spread_pct', { precision: 5, scale: 4 }).default('0.0150').notNull(), // spread comercial (ex: 0.0150 = 1.5%)
    effectiveRate: numeric('effective_rate', { precision: 12, scale: 6 }).notNull(), // rate * (1 + spreadPct)
    
    source: text('source').default('manual').notNull(), // 'awesomeapi', 'manual', etc.
    isActive: boolean('is_active').default(true).notNull(),
    validFrom: timestamp('valid_from', { withTimezone: true }).defaultNow().notNull(),
    validUntil: timestamp('valid_until', { withTimezone: true }),
    notes: text('notes'),
    
    createdById: uuid('created_by_id').references(() => users.id),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('exchange_rates_tenant_id_idx').on(table.tenantId),
    index('exchange_rates_currency_idx').on(table.fromCurrency, table.toCurrency),
    index('exchange_rates_active_idx').on(table.isActive, table.validFrom),
  ],
);
