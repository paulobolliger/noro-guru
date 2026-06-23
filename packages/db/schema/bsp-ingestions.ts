import { uuid, text, bigint, timestamp, index, unique } from 'drizzle-orm/pg-core';
import { noro } from './_schema';

export const bspIngestions = noro.table(
  'bsp_ingestions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull(),
    fileName: text('file_name').notNull(),
    fileSize: bigint('file_size', { mode: 'number' }).notNull(),
    status: text('status').default('PENDING').notNull(), // 'PENDING', 'PROCESSING', 'PROCESSED', 'FAILED'
    errorLog: text('error_log'),
    processedAt: timestamp('processed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    unique('bsp_ingestions_tenant_id_id_uq').on(t.tenantId, t.id),
    index('ix_bsp_ingestion_status').on(t.tenantId, t.status),
  ]
);
