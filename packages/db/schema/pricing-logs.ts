import { boolean, index, numeric, text, timestamp, uuid, integer } from 'drizzle-orm/pg-core';
import { noro } from './_schema';
import { tenants } from './tenants';
import { products } from './products';
import { proposals } from './proposals';
import { bookings } from './bookings';
import { suppliers } from './suppliers';
import { exchangeRates } from './exchange-rates';
import { pricingRules } from './pricing-rules';
import { users } from './users';

export const pricingLogs = noro.table(
  'pricing_logs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    
    tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
    
    // Contextos Opcionais
    productId: uuid('product_id').references(() => products.id),
    proposalId: uuid('proposal_id').references(() => proposals.id),
    bookingId: uuid('booking_id').references(() => bookings.id),
    supplierId: uuid('supplier_id').references(() => suppliers.id),
    
    // Input bruto original
    netPriceOriginal: numeric('net_price_original', { precision: 14, scale: 2 }).notNull(),
    netCurrency: text('net_currency').notNull(),
    
    // Câmbio aplicado
    exchangeRateId: uuid('exchange_rate_id').references(() => exchangeRates.id),
    exchangeRate: numeric('exchange_rate', { precision: 12, scale: 6 }).notNull(),
    netPriceBRL: numeric('net_price_brl', { precision: 14, scale: 2 }).notNull(),
    
    // Markup resolvido
    markupRuleId: uuid('markup_rule_id').references(() => pricingRules.id),
    markupPercentage: numeric('markup_percentage', { precision: 6, scale: 4 }).notNull(),
    markupAmount: numeric('markup_amount', { precision: 14, scale: 2 }).notNull(),
    
    // Custos operacionais calculados
    operationalCost: numeric('operational_cost', { precision: 14, scale: 2 }).default('0.00').notNull(),
    
    // Configurações de pagamento no momento da simulação
    paymentInstallments: integer('payment_installments').default(1).notNull(),
    paymentMethod: text('payment_method').notNull(),
    acquirer: text('acquirer').default('asaas').notNull(),
    mdrRate: numeric('mdr_rate', { precision: 7, scale: 5 }).default('0.00000').notNull(),
    paymentFeeAmount: numeric('payment_fee_amount', { precision: 14, scale: 2 }).default('0.00').notNull(),
    interestRepasse: numeric('interest_repasse', { precision: 14, scale: 2 }).default('0.00').notNull(),
    
    // Resultados calculados de venda
    grossPrice: numeric('gross_price', { precision: 14, scale: 2 }).notNull(),
    finalPrice: numeric('final_price', { precision: 14, scale: 2 }).notNull(), // Preço de venda
    installmentValue: numeric('installment_value', { precision: 14, scale: 2 }),
    
    // Margens resultantes
    netMargin: numeric('net_margin', { precision: 14, scale: 2 }).notNull(),
    marginPercentage: numeric('margin_percentage', { precision: 6, scale: 4 }).notNull(),
    isMarginPositive: boolean('is_margin_positive').notNull(),
    
    // Origem da simulação
    channel: text('channel').default('admin').notNull(), // 'admin', 'portal_traveler', 'api'
    createdById: uuid('created_by_id').references(() => users.id),
    
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('pricing_logs_tenant_id_idx').on(table.tenantId),
    index('pricing_logs_booking_idx').on(table.bookingId),
    index('pricing_logs_proposal_idx').on(table.proposalId),
    index('pricing_logs_created_at_idx').on(table.createdAt),
  ],
);
