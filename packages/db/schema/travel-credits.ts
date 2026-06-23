import { uuid, text, numeric, boolean, timestamp, index, unique, foreignKey } from 'drizzle-orm/pg-core';
import { noro } from './_schema';
import { trafficDocuments } from './traffic-documents';

export const travelCredits = noro.table(
  'travel_credits',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull(),
    ownerType: text('owner_type').notNull(), // 'passenger' | 'company'
    ownerPassengerId: uuid('owner_passenger_id'),
    ownerCompanyId: uuid('owner_company_id'),
    sourceDocId: uuid('source_doc_id').notNull(),
    creditDocNumber: text('credit_doc_number'),
    originalAmount: numeric('original_amount', { precision: 14, scale: 2 }).notNull(),
    remainingAmount: numeric('remaining_amount', { precision: 14, scale: 2 }).notNull(),
    currency: text('currency').default('BRL').notNull(),
    isRefundable: boolean('is_refundable').default(false).notNull(),
    issuedAt: timestamp('issued_at', { withTimezone: true }).notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    status: text('status').default('OPEN').notNull(), // 'OPEN', 'CLOSED', 'EXPIRED'
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    unique('travel_credits_tenant_id_id_uq').on(t.tenantId, t.id),
    index('ix_credit_owner_pax').on(t.tenantId, t.ownerPassengerId),
    index('ix_credit_owner_company').on(t.tenantId, t.ownerCompanyId),
    index('ix_credit_expiry').on(t.tenantId, t.expiresAt, t.status),
    foreignKey({
      columns: [t.tenantId, t.sourceDocId],
      foreignColumns: [trafficDocuments.tenantId, trafficDocuments.id],
      name: 'fk_travel_credits_source_doc_tenant',
    }),
  ]
);
