import { pgEnum, varchar, timestamp, date, uuid, index, unique, uniqueIndex } from 'drizzle-orm/pg-core';
import { noro } from './_schema';
import { tenants } from './tenants';
import { clients } from './clients';

export const bookingStatusEnum = pgEnum('booking_status', [
  'draft',
  'quoted',
  'confirmed',
  'voucher_issued',
  'travelling',
  'completed',
  'cancelled',
]);

export const currencyEnum = pgEnum('currency', ['BRL', 'USD', 'EUR', 'GBP']);

export type BookingStatus = (typeof bookingStatusEnum.enumValues)[number];
export type Currency = (typeof currencyEnum.enumValues)[number];


export const bookings = noro.table(
  'bookings',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id')
      .notNull()
      .references(() => tenants.id),
    reference: varchar('reference', { length: 20 }).notNull(), // OS sequencial legível
    clientId: uuid('client_id')
      .notNull()
      .references(() => clients.id),
    buyerPartyId: uuid('buyer_party_id'),
    payerPartyId: uuid('payer_party_id'),
    corporateAccountId: uuid('corporate_account_id'),
    status: bookingStatusEnum('status').default('draft').notNull(),
    currency: currencyEnum('currency').default('BRL').notNull(),
    saleDate: timestamp('sale_date', { withTimezone: true }),
    travelStartDate: date('travel_start_date'),
    travelEndDate: date('travel_end_date'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    unique('bookings_tenant_id_id_uq').on(t.tenantId, t.id), // Habilita FKs compostas por tenant
    uniqueIndex('booking_ref_uq').on(t.tenantId, t.reference),
    index('booking_tenant_id_idx').on(t.tenantId),
    index('booking_client_idx').on(t.tenantId, t.clientId),
    index('booking_status_idx').on(t.tenantId, t.status),
  ]
);
