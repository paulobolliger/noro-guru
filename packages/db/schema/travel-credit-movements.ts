import { uuid, text, numeric, timestamp, index, unique, foreignKey } from 'drizzle-orm/pg-core';
import { noro } from './_schema';
import { travelCredits } from './travel-credits';
import { bookings } from './bookings';
import { trafficDocuments } from './traffic-documents';

export const travelCreditMovements = noro.table(
  'travel_credit_movements',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull(),
    travelCreditId: uuid('travel_credit_id').notNull(),
    movementType: text('movement_type').notNull(), // 'issued', 'redeemed', 'refunded', 'expired', 'adjusted'
    amount: numeric('amount', { precision: 14, scale: 2 }).notNull(),
    currency: text('currency').default('BRL').notNull(),
    relatedBookingId: uuid('related_booking_id'),
    relatedDocId: uuid('related_doc_id'),
    occurredAt: timestamp('occurred_at', { withTimezone: true }).defaultNow().notNull(),
    idempotencyKey: text('idempotency_key').notNull(),
    metadata: text('metadata'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    createdBy: uuid('created_by'),
  },
  (t) => [
    unique('uq_credit_mvmt_idem').on(t.tenantId, t.idempotencyKey),
    index('ix_mvmt_credit').on(t.tenantId, t.travelCreditId),
    foreignKey({
      columns: [t.tenantId, t.travelCreditId],
      foreignColumns: [travelCredits.tenantId, travelCredits.id],
      name: 'fk_mvmt_credit_tenant',
    }),
    foreignKey({
      columns: [t.tenantId, t.relatedBookingId],
      foreignColumns: [bookings.tenantId, bookings.id],
      name: 'fk_mvmt_booking_tenant',
    }),
    foreignKey({
      columns: [t.tenantId, t.relatedDocId],
      foreignColumns: [trafficDocuments.tenantId, trafficDocuments.id],
      name: 'fk_mvmt_doc_tenant',
    }),
  ]
);
