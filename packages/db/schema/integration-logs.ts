import { boolean, index, text, timestamp, uuid, integer, jsonb } from 'drizzle-orm/pg-core';
import { noro } from './_schema';
import { tenants } from './tenants';
import { suppliers } from './suppliers';
import { bookings } from './bookings';

export const integrationLogs = noro.table(
  'integration_logs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
    supplierId: uuid('supplier_id').references(() => suppliers.id),
    bookingId: uuid('booking_id').references(() => bookings.id),
    
    adapterKey: text('adapter_key').notNull(), // 'ratehawk', 'civitatis', 'manual', etc.
    operation: text('operation').notNull(), // 'search', 'get_product', 'book', 'confirm', 'cancel', 'ping'
    
    requestPayload: jsonb('request_payload'),
    responsePayload: jsonb('response_payload'),
    
    statusCode: integer('status_code'),
    latencyMs: integer('latency_ms'),
    isSuccess: boolean('is_success').notNull(),
    
    errorMessage: text('error_message'),
    errorCode: text('error_code'),
    
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('integration_logs_tenant_id_idx').on(table.tenantId),
    index('integration_logs_supplier_idx').on(table.supplierId),
    index('integration_logs_booking_idx').on(table.bookingId),
    index('integration_logs_created_at_idx').on(table.createdAt),
  ],
);
