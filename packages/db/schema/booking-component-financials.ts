import { pgEnum, uuid, text, numeric, timestamp, index, uniqueIndex, foreignKey, unique } from 'drizzle-orm/pg-core';
import { noro } from './_schema';
import { bookings } from './bookings';
import { bookingItems } from './booking-items';
import { suppliers } from './suppliers';

export const operationModeEnum = pgEnum('operation_mode', ['INTERMEDIATION', 'OWN_ACCOUNT']);

export type OperationMode = (typeof operationModeEnum.enumValues)[number];


export const bookingComponentFinancials = noro.table(
  'booking_component_financials',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull(),
    bookingId: uuid('booking_id')
      .notNull()
      .references(() => bookings.id),
    componentId: uuid('component_id')
      .notNull()
      .references(() => bookingItems.id),
    operationMode: operationModeEnum('operation_mode').notNull(),
    // Decomposição granular
    supplierNetAmount: numeric('supplier_net_amount', { precision: 14, scale: 2 }).notNull(),
    supplierCommissionAmount: numeric('supplier_commission_amount', { precision: 14, scale: 2 }).default('0').notNull(),
    markupAmount: numeric('markup_amount', { precision: 14, scale: 2 }).default('0').notNull(),
    serviceFeeAmount: numeric('service_fee_amount', { precision: 14, scale: 2 }).default('0').notNull(),
    discountAmount: numeric('discount_amount', { precision: 14, scale: 2 }).default('0').notNull(),
    taxAmount: numeric('tax_amount', { precision: 14, scale: 2 }).default('0').notNull(),
    grossClientAmount: numeric('gross_client_amount', { precision: 14, scale: 2 }).notNull(),
    taxableServiceAmount: numeric('taxable_service_amount', { precision: 14, scale: 2 }).notNull(),
    currency: text('currency').default('BRL').notNull(),
    supplierId: uuid('supplier_id')
      .references(() => suppliers.id),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    unique('bcf_tenant_id_id_uq').on(t.tenantId, t.id),
    index('booking_comp_fin_booking_idx').on(t.tenantId, t.bookingId),
    foreignKey({
      columns: [t.tenantId, t.bookingId],
      foreignColumns: [bookings.tenantId, bookings.id],
      name: 'fk_bcf_booking_tenant',
    }),
    foreignKey({
      columns: [t.tenantId, t.componentId],
      foreignColumns: [bookingItems.tenantId, bookingItems.id],
      name: 'fk_bcf_component_tenant',
    }),
  ]
);
