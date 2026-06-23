import { uuid, text, numeric, timestamp, index, unique, foreignKey } from 'drizzle-orm/pg-core';
import { noro } from './_schema';
import { bspIngestions } from './bsp-ingestions';
import { trafficDocuments } from './traffic-documents';

export const bspRecords = noro.table(
  'bsp_records',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull(),
    bspIngestionId: uuid('bsp_ingestion_id').notNull(),
    ticketNumber: text('ticket_number').notNull(),
    transactionType: text('transaction_type').notNull(), // e.g. 'SALE', 'REFUND'
    issueDate: timestamp('issue_date', { withTimezone: true }),
    billingAmount: numeric('billing_amount', { precision: 14, scale: 2 }).notNull(),
    taxAmount: numeric('tax_amount', { precision: 14, scale: 2 }).default('0').notNull(),
    commissionAmount: numeric('commission_amount', { precision: 14, scale: 2 }).default('0').notNull(),
    reconciledState: text('reconciled_state').default('UNRECONCILED').notNull(), // 'UNRECONCILED', 'RECONCILED', 'DISPUTED'
    reconciledAt: timestamp('reconciled_at', { withTimezone: true }),
    matchedDocId: uuid('matched_doc_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    unique('bsp_records_tenant_id_id_uq').on(t.tenantId, t.id),
    index('ix_bsp_records_ticket').on(t.tenantId, t.ticketNumber),
    index('ix_bsp_records_reconciled').on(t.tenantId, t.reconciledState),
    foreignKey({
      columns: [t.tenantId, t.bspIngestionId],
      foreignColumns: [bspIngestions.tenantId, bspIngestions.id],
      name: 'fk_bsp_records_ingestion_tenant',
    }),
    foreignKey({
      columns: [t.tenantId, t.matchedDocId],
      foreignColumns: [trafficDocuments.tenantId, trafficDocuments.id],
      name: 'fk_bsp_records_doc_tenant',
    }),
  ]
);
