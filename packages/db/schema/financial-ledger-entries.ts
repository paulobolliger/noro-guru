import { uuid, text, numeric, timestamp, index, foreignKey } from 'drizzle-orm/pg-core';
import { noro } from './_schema';
import { bookings } from './bookings';
import { bookingItems } from './booking-items';

export const financialLedgerEntries = noro.table(
  'financial_ledger_entries',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull(),
    bookingId: uuid('booking_id')
      .notNull()
      .references(() => bookings.id),
    componentId: uuid('component_id'),
    sourceType: text('source_type').notNull(), // 'booking', 'ticket', 'refund', 'credit', 'fiscal_doc', 'bsp_file'
    sourceId: uuid('source_id').notNull(),
    entryType: text('entry_type').notNull(), // 'receivable', 'payable', 'revenue', 'cost', 'tax', 'credit_liability'
    debitAccount: text('debit_account').notNull(),
    creditAccount: text('credit_account').notNull(),
    amount: numeric('amount', { precision: 14, scale: 2 }).notNull(),
    currency: text('currency').notNull(),
    occurredAt: timestamp('occurred_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index('financial_ledger_booking_idx').on(t.tenantId, t.bookingId),
    index('financial_ledger_source_idx').on(t.tenantId, t.sourceType, t.sourceId),
    foreignKey({
      columns: [t.tenantId, t.bookingId],
      foreignColumns: [bookings.tenantId, bookings.id],
      name: 'fk_ledger_booking_tenant',
    }),
    foreignKey({
      columns: [t.tenantId, t.componentId],
      foreignColumns: [bookingItems.tenantId, bookingItems.id],
      name: 'fk_ledger_component_tenant',
    }),
  ]
);
