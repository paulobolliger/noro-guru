import {
  bigint,
  boolean,
  date,
  index,
  integer,
  jsonb,
  numeric,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { noro } from './_schema';
import { paymentCustomers } from './payment-customers';

export const chargeStatusValues = [
  'draft',
  'pending',
  'processing',
  'confirmed',
  'received',
  'overdue',
  'refunded',
  'canceled',
  'failed',
] as const;

export const chargeBillingTypeValues = ['PIX', 'BOLETO', 'CREDIT_CARD'] as const;

export const chargeRepasseModeloValues = ['plataforma', 'agencia'] as const;

export const chargeEscrowStatusValues = ['held', 'released', 'refunded'] as const;

export const chargeSinalMeioValues = ['pix', 'dinheiro', 'ted', 'outro'] as const;

export type ChargeStatus = (typeof chargeStatusValues)[number];
export type ChargeBillingType = (typeof chargeBillingTypeValues)[number];
export type ChargeRepasseModelo = (typeof chargeRepasseModeloValues)[number];
export type ChargeEscrowStatus = (typeof chargeEscrowStatusValues)[number];

export const paymentCharges = noro.table(
  'payment_charges',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    tenantId: uuid('tenant_id').notNull(),
    // FK lógica para noro.proposals
    proposalId: uuid('proposal_id'),
    paymentCustomerId: uuid('payment_customer_id').references(() => paymentCustomers.id),

    provider: text('provider').notNull().default('asaas'),
    providerPaymentId: text('provider_payment_id'),

    // Modelo de repasse — determina quem recebe o valor bruto
    // 'plataforma': cliente paga → entra na NORO → NORO repassa à agência
    // 'agencia'   : cliente paga → entra direto na subconta da agência
    repasseModelo: text('repasse_modelo').$type<ChargeRepasseModelo>().notNull(),

    // Financeiro
    amountCents: bigint('amount_cents', { mode: 'number' }).notNull(),
    netAmountCents: bigint('net_amount_cents', { mode: 'number' }),
    currency: text('currency').notNull().default('BRL'),
    taxaCambioSnapshot: numeric('taxa_cambio_snapshot', { precision: 10, scale: 6 }),

    // Método e parcelamento
    billingType: text('billing_type').$type<ChargeBillingType>().notNull(),
    installments: integer('installments').default(1),

    // Status interno (independente do gateway)
    status: text('status').$type<ChargeStatus>().notNull().default('draft'),

    dueDate: date('due_date'),
    paidAt: timestamp('paid_at', { withTimezone: true }),
    confirmedAt: timestamp('confirmed_at', { withTimezone: true }),
    receivedAt: timestamp('received_at', { withTimezone: true }),

    // Escrow lógico — NORO controla regras de liberação
    // REGRA: só populado quando repasseModelo = 'plataforma'
    // Quando repasseModelo = 'agencia', fica null — dinheiro cai direto na subconta
    escrowStatus: text('escrow_status').$type<ChargeEscrowStatus>(),
    escrowReleaseAt: timestamp('escrow_release_at', { withTimezone: true }),
    escrowReleasedAt: timestamp('escrow_released_at', { withTimezone: true }),

    // Split snapshot (imutável — captura no momento da emissão)
    splitNoroPct: numeric('split_noro_pct', { precision: 5, scale: 2 }),
    splitNoroCents: bigint('split_noro_cents', { mode: 'number' }),
    splitTenantCents: bigint('split_tenant_cents', { mode: 'number' }),

    // URLs de pagamento
    checkoutUrl: text('checkout_url'),
    invoiceUrl: text('invoice_url'),
    bankSlipUrl: text('bank_slip_url'),
    pixQrCode: text('pix_qr_code'),
    pixCopyPaste: text('pix_copy_paste'),

    // Sinal — funcionalidade futura (sem lógica nesta sprint)
    // Habilitado por tenant no apps/control; quando usado, lançado manualmente no /financeiro
    sinelValorCents: bigint('sinal_valor_cents', { mode: 'number' }),
    sinalPagoAt: timestamp('sinal_pago_at', { withTimezone: true }),
    sinalMeio: text('sinal_meio').$type<(typeof chargeSinalMeioValues)[number]>(),

    // Payload bruto do gateway (imutável após recebimento)
    providerPayload: jsonb('provider_payload').$type<Record<string, unknown>>(),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('pch_tenant_id_idx').on(table.tenantId),
    index('pch_proposal_id_idx').on(table.proposalId),
    index('pch_status_idx').on(table.status),
    index('pch_repasse_modelo_idx').on(table.repasseModelo),
    index('pch_provider_payment_id_idx').on(table.providerPaymentId),
    index('pch_escrow_status_idx').on(table.escrowStatus),
  ],
);
