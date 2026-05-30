import { boolean, index, jsonb, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { noro } from './_schema';

export const paymentWebhookEvents = noro.table(
  'payment_webhook_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    provider: text('provider').notNull().default('asaas'),
    // ID único do evento no gateway — garante idempotência junto com provider
    providerEventId: text('provider_event_id').notNull(),

    eventType: text('event_type').notNull(),

    // FK lógica para noro.payment_charges
    chargeId: uuid('charge_id'),

    // Payload bruto recebido do gateway — nunca alterado
    payload: jsonb('payload').$type<Record<string, unknown>>().notNull(),

    processed: boolean('processed').notNull().default(false),
    processedAt: timestamp('processed_at', { withTimezone: true }),

    // Mensagem de erro se o processamento falhou
    error: text('error'),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    // Chave de idempotência — duplicatas são rejeitadas pelo banco
    uniqueIndex('pwe_provider_event_uidx').on(table.provider, table.providerEventId),
    index('pwe_charge_id_idx').on(table.chargeId),
    index('pwe_processed_idx').on(table.processed),
    index('pwe_event_type_idx').on(table.eventType),
  ],
);
