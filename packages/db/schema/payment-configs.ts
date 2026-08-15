import { boolean, index, numeric, text, timestamp, uuid, integer } from 'drizzle-orm/pg-core';
import { noro } from './_schema';
import { tenants } from './tenants';

export const paymentConfigs = noro.table(
  'payment_configs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    
    // null para configs globais da plataforma; preenchido para configs customizadas do tenant (ex: credenciais/taxas próprias Asaas)
    tenantId: uuid('tenant_id').references(() => tenants.id),
    
    acquirer: text('acquirer').default('asaas').notNull(), // 'asaas', 'rede', 'stripe', 'cielo'
    paymentMethod: text('payment_method').notNull(), // 'credit_visa', 'credit_master', 'credit_elo', 'credit_amex', 'debit', 'pix', 'boleto'
    installments: integer('installments').notNull(), // de 1 a 21
    
    mdrRate: numeric('mdr_rate', { precision: 7, scale: 5 }).notNull(), // ex: 0.03470 = 3.47%
    maxAbsorbedInstallments: integer('max_absorbed_installments').default(10).notNull(), // até quantas parcelas absorvemos o MDR no bruto
    monthlyInterestRate: numeric('monthly_interest_rate', { precision: 7, scale: 5 }).default('0.01990').notNull(), // taxa de juros a.m. (repassada nas parcelas não-absorvidas)
    
    isActive: boolean('is_active').default(true).notNull(),
    validFrom: timestamp('valid_from', { withTimezone: true }).defaultNow().notNull(),
    validUntil: timestamp('valid_until', { withTimezone: true }),
    
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('payment_configs_tenant_id_idx').on(table.tenantId),
    index('payment_configs_lookup_idx').on(table.acquirer, table.paymentMethod, table.installments),
    index('payment_configs_active_idx').on(table.isActive, table.validFrom),
  ],
);
