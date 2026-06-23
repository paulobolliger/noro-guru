import { pgEnum, uuid, timestamp, jsonb, index, uniqueIndex, foreignKey, unique } from 'drizzle-orm/pg-core';
import { noro } from './_schema';
import { bookings } from './bookings';
import { suppliers } from './suppliers';

export const serviceTypeEnum = pgEnum('service_type', [
  'flight',
  'hotel',
  'transfer',
  'ticket',
  'insurance',
  'tour',
  'car_rental',
  'visa',
]);

export const itemStatusEnum = pgEnum('item_status', [
  'pending',
  'confirmed',
  'cancelled',
  'modified',
  'no_show',
]);

export type ServiceType = (typeof serviceTypeEnum.enumValues)[number];
export type ItemStatus = (typeof itemStatusEnum.enumValues)[number];


export const bookingItems = noro.table(
  'booking_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull(),
    bookingId: uuid('booking_id')
      .notNull()
      .references(() => bookings.id, { onDelete: 'cascade' }),
    serviceType: serviceTypeEnum('service_type').notNull(),
    supplierId: uuid('supplier_id')
      .notNull()
      .references(() => suppliers.id),
    status: itemStatusEnum('status').default('pending').notNull(),
    serviceDate: timestamp('service_date', { withTimezone: true }),
    supplierPayloadSnapshot: jsonb('supplier_payload_snapshot'),
    normalizedSnapshot: jsonb('normalized_snapshot'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    unique('booking_items_tenant_id_id_uq').on(t.tenantId, t.id),
    index('booking_items_booking_idx').on(t.bookingId),
    index('booking_items_supplier_idx').on(t.tenantId, t.supplierId),
    index('booking_items_status_idx').on(t.tenantId, t.status),
    foreignKey({
      columns: [t.tenantId, t.bookingId],
      foreignColumns: [bookings.tenantId, bookings.id],
      name: 'fk_booking_items_booking_tenant',
    }),
  ]
);
