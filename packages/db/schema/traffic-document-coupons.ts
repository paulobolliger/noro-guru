import { uuid, integer, varchar, timestamp, index, unique, foreignKey } from 'drizzle-orm/pg-core';
import { noro } from './_schema';
import { trafficDocuments, docStateEnum } from './traffic-documents';

export const trafficDocumentCoupons = noro.table(
  'traffic_document_coupons',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull(),
    trafficDocumentId: uuid('traffic_document_id').notNull(),
    couponNumber: integer('coupon_number').notNull(),
    segmentId: uuid('segment_id'),
    origin: varchar('origin', { length: 3 }).notNull(),
    destination: varchar('destination', { length: 3 }).notNull(),
    departureAt: timestamp('departure_at', { withTimezone: true }),
    status: docStateEnum('status').notNull(),
    fareBasis: varchar('fare_basis', { length: 30 }),
    bookingClass: varchar('booking_class', { length: 5 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    unique('uq_doc_coupon').on(t.tenantId, t.trafficDocumentId, t.couponNumber),
    index('ix_coupon_doc').on(t.tenantId, t.trafficDocumentId),
    foreignKey({
      columns: [t.tenantId, t.trafficDocumentId],
      foreignColumns: [trafficDocuments.tenantId, trafficDocuments.id],
      name: 'fk_coupons_doc_tenant',
    }),
  ]
);
