import { uuid, text, numeric, timestamp, index, unique, foreignKey } from 'drizzle-orm/pg-core';
import { noro } from './_schema';
import { suppliers } from './suppliers';

export const agencyMemos = noro.table(
  'agency_memos',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull(),
    memoType: text('memo_type').notNull(), // 'ADM' | 'ACM'
    memoNumber: text('memo_number').notNull(),
    supplierId: uuid('supplier_id').notNull(),
    ticketNumber: text('ticket_number'),
    amount: numeric('amount', { precision: 14, scale: 2 }).notNull(),
    reason: text('reason'),
    status: text('status').default('OPEN').notNull(), // 'OPEN', 'IN_DISPUTE', 'RESOLVED', 'ACCEPTED', 'REJECTED'
    resolvedAt: timestamp('resolved_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    unique('agency_memos_tenant_id_id_uq').on(t.tenantId, t.id),
    unique('uq_memo_number').on(t.tenantId, t.memoNumber),
    index('ix_memos_supplier').on(t.tenantId, t.supplierId),
    index('ix_memos_status').on(t.tenantId, t.status),
    foreignKey({
      columns: [t.supplierId],
      foreignColumns: [suppliers.id],
      name: 'fk_agency_memos_supplier',
    }),
  ]
);
