import { uuid, text, numeric, timestamp, index, unique, foreignKey, pgEnum } from 'drizzle-orm/pg-core';
import { noro } from './_schema';
import { bookings } from './bookings';

export const fiscalDocTypeEnum = pgEnum('fiscal_doc_type', ['NFSE', 'DEBIT_NOTE']);
export const fiscalDocStatusEnum = pgEnum('fiscal_doc_status', ['PENDING', 'EMITTED', 'CANCELLED', 'ERROR']);

export type FiscalDocType = (typeof fiscalDocTypeEnum.enumValues)[number];
export type FiscalDocStatus = (typeof fiscalDocStatusEnum.enumValues)[number];

export const fiscalDocuments = noro.table(
  'fiscal_documents',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull(),
    bookingId: uuid('booking_id').notNull(),
    docType: fiscalDocTypeEnum('doc_type').notNull(),
    docNumber: text('doc_number'),
    serie: text('serie'),
    amount: numeric('amount', { precision: 14, scale: 2 }).notNull(),
    taxableAmount: numeric('taxable_amount', { precision: 14, scale: 2 }).default('0').notNull(),
    taxRate: numeric('tax_rate', { precision: 5, scale: 4 }).default('0').notNull(),
    taxAmount: numeric('tax_amount', { precision: 14, scale: 2 }).default('0').notNull(),
    status: fiscalDocStatusEnum('status').default('PENDING').notNull(),
    pdfUrl: text('pdf_url'),
    xmlUrl: text('xml_url'),
    externalId: text('external_id'),
    errorMessage: text('error_message'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    unique('fiscal_documents_tenant_id_id_uq').on(t.tenantId, t.id),
    index('ix_fiscal_booking').on(t.tenantId, t.bookingId),
    index('ix_fiscal_status').on(t.tenantId, t.status),
    foreignKey({
      columns: [t.tenantId, t.bookingId],
      foreignColumns: [bookings.tenantId, bookings.id],
      name: 'fk_fiscal_docs_booking_tenant',
    }),
  ]
);
