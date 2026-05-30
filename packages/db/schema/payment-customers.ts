import { index, jsonb, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { noro } from './_schema';

export const paymentCustomers = noro.table(
  'payment_customers',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    tenantId: uuid('tenant_id').notNull(),
    // FK lógica para noro.clients
    clientId: uuid('client_id'),

    provider: text('provider').notNull().default('asaas'),
    providerCustomerId: text('provider_customer_id').notNull(),

    name: text('name'),
    email: text('email'),
    // CPF (PF) ou CNPJ (PJ) — ambos suportados, campo neutro
    cpfCnpj: text('cpf_cnpj'),

    metadata: jsonb('metadata').$type<Record<string, unknown>>(),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('pc_tenant_provider_customer_uidx').on(
      table.tenantId,
      table.provider,
      table.providerCustomerId,
    ),
    index('pc_tenant_id_idx').on(table.tenantId),
    index('pc_client_id_idx').on(table.clientId),
  ],
);
