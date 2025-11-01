import { InferModel } from 'drizzle-orm';
import {
  boolean,
  decimal,
  json,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar
} from 'drizzle-orm/pg-core';

// Referência às tabelas do schema cp
export const tenants = pgTable('cp.tenants', {
  id: uuid('id').primaryKey(),
  adminUserIds: uuid('admin_user_ids').array()
});

export const settings = pgTable('cp.settings', {
  key: text('key').primaryKey(),
  value: json('value').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const stripeWebhookLogs = pgTable('cp.stripe_webhook_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventType: text('event_type').notNull(),
  status: text('status').notNull(),
  payload: json('payload').notNull(),
  error: text('error'),
  createdAt: timestamp('created_at').defaultNow(),
  metadata: json('metadata').default({})
});

// Enums
export const billingIntervalEnum = pgEnum('billing_interval', [
  'monthly',
  'quarterly',
  'yearly'
]);

export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'active',
  'canceled',
  'past_due',
  'pending',
  'trialing',
  'incomplete',
  'incomplete_expired'
]);

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'processing',
  'succeeded',
  'failed',
  'refunded',
  'canceled'
]);

export const paymentProviderEnum = pgEnum('payment_provider', [
  'stripe',
  'cielo'
]);

export const paymentMethodTypeEnum = pgEnum('payment_method_type', [
  'credit_card',
  'debit_card',
  'boleto',
  'pix'
]);

// Tabelas
export const plans = pgTable('billing.plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  priceBrl: decimal('price_brl', { precision: 10, scale: 2 }).notNull(),
  priceUsd: decimal('price_usd', { precision: 10, scale: 2 }).notNull(),
  interval: billingIntervalEnum('interval').notNull().default('monthly'),
  features: json('features').$type<Record<string, string>>().default({}),
  stripePriceId: varchar('stripe_price_id', { length: 100 }),
  cieloPlanId: varchar('cielo_plan_id', { length: 100 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  metadata: json('metadata').$type<Record<string, unknown>>().default({})
});

export const subscriptions = pgTable('billing.subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  planId: uuid('plan_id').notNull().references(() => plans.id),
  status: subscriptionStatusEnum('status').notNull().default('pending'),
  currentPeriodStart: timestamp('current_period_start').notNull(),
  currentPeriodEnd: timestamp('current_period_end').notNull(),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
  canceledAt: timestamp('canceled_at'),
  trialStart: timestamp('trial_start'),
  trialEnd: timestamp('trial_end'),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 100 }),
  cieloSubscriptionId: varchar('cielo_subscription_id', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  metadata: json('metadata').$type<Record<string, unknown>>().default({})
});

export const paymentMethods = pgTable('billing.payment_methods', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  provider: paymentProviderEnum('provider').notNull(),
  type: paymentMethodTypeEnum('type').notNull(),
  lastFour: varchar('last_four', { length: 4 }),
  expiryMonth: varchar('expiry_month', { length: 2 }),
  expiryYear: varchar('expiry_year', { length: 4 }),
  cardBrand: varchar('card_brand', { length: 50 }),
  isDefault: boolean('is_default').default(false),
  stripePaymentMethodId: varchar('stripe_payment_method_id', { length: 100 }),
  cieloPaymentMethodId: varchar('cielo_payment_method_id', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  metadata: json('metadata').$type<Record<string, unknown>>().default({})
});

export const invoices = pgTable('billing.invoices', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  subscriptionId: uuid('subscription_id').notNull().references(() => subscriptions.id),
  amountBrl: decimal('amount_brl', { precision: 10, scale: 2 }).notNull(),
  amountUsd: decimal('amount_usd', { precision: 10, scale: 2 }).notNull(),
  status: paymentStatusEnum('status').notNull().default('pending'),
  dueDate: timestamp('due_date').notNull(),
  paidAt: timestamp('paid_at'),
  stripeInvoiceId: varchar('stripe_invoice_id', { length: 100 }),
  cieloInvoiceId: varchar('cielo_invoice_id', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  metadata: json('metadata').$type<Record<string, unknown>>().default({})
});

export const transactions = pgTable('billing.transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenants.id),
  invoiceId: uuid('invoice_id').notNull().references(() => invoices.id),
  paymentMethodId: uuid('payment_method_id').references(() => paymentMethods.id),
  amountBrl: decimal('amount_brl', { precision: 10, scale: 2 }).notNull(),
  amountUsd: decimal('amount_usd', { precision: 10, scale: 2 }).notNull(),
  provider: paymentProviderEnum('provider').notNull(),
  status: paymentStatusEnum('status').notNull().default('pending'),
  stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 100 }),
  cieloPaymentId: varchar('cielo_payment_id', { length: 100 }),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  metadata: json('metadata').$type<Record<string, unknown>>().default({})
});

// Types inferidos
export type Plan = InferModel<typeof plans>;
export type Subscription = InferModel<typeof subscriptions>;
export type PaymentMethod = InferModel<typeof paymentMethods>;
export type Invoice = InferModel<typeof invoices>;
export type Transaction = InferModel<typeof transactions>;