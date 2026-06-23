import { pgEnum, uuid, text, numeric, timestamp, index, unique, foreignKey } from 'drizzle-orm/pg-core';
import { noro } from './_schema';
import { bookings } from './bookings';
import { bookingItems } from './booking-items';

export const docTypeEnum = pgEnum('doc_type', ['TKTT', 'EMDA', 'EMDS', 'MCO', 'HOTEL_VOUCHER', 'SVC']);
export const docStateEnum = pgEnum('doc_state', ['DRAFT', 'ISSUED', 'VOIDED', 'EXCHANGED', 'PARTIALLY_REFUNDED', 'REFUNDED', 'FLOWN']);

export type DocType = (typeof docTypeEnum.enumValues)[number];
export type DocState = (typeof docStateEnum.enumValues)[number];

export const trafficDocuments = noro.table(
  'traffic_documents',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull(),
    bookingId: uuid('booking_id').notNull(),
    bookingItemId: uuid('booking_item_id').notNull(),
    paxId: uuid('pax_id').notNull(),
    docType: docTypeEnum('doc_type').notNull(),
    docNumber: text('doc_number').notNull(),
    checkDigit: text('check_digit'),
    validatingCarrier: text('validating_carrier'),
    state: docStateEnum('state').default('DRAFT').notNull(),
    exchangedFromDocId: uuid('exchanged_from_doc_id'),
    originalIssueDocNumber: text('original_issue_doc_number'),
    originalIssueDate: timestamp('original_issue_date', { withTimezone: true }),
    originalIssueAgent: text('original_issue_agent'),
    issuedAt: timestamp('issued_at', { withTimezone: true }),
    voidDeadline: timestamp('void_deadline', { withTimezone: true }),
    fareAmount: numeric('fare_amount', { precision: 14, scale: 2 }).default('0').notNull(),
    taxAmount: numeric('tax_amount', { precision: 14, scale: 2 }).default('0').notNull(),
    currency: text('currency').default('BRL').notNull(),
    metadata: text('metadata'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    unique('traffic_docs_tenant_id_id_uq').on(t.tenantId, t.id),
    unique('uq_doc_number').on(t.tenantId, t.docNumber),
    index('ix_doc_booking').on(t.tenantId, t.bookingId),
    index('ix_doc_item').on(t.tenantId, t.bookingItemId),
    index('ix_doc_state').on(t.tenantId, t.state),
    foreignKey({
      columns: [t.tenantId, t.bookingId],
      foreignColumns: [bookings.tenantId, bookings.id],
      name: 'fk_traffic_docs_booking_tenant',
    }),
    foreignKey({
      columns: [t.tenantId, t.bookingItemId],
      foreignColumns: [bookingItems.tenantId, bookingItems.id],
      name: 'fk_traffic_docs_item_tenant',
    }),
  ]
);
