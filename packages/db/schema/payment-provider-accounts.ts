import { index, jsonb, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { noro } from './_schema';

export const providerAccountOnboardingStatusValues = [
  'pending',
  'in_review',
  'approved',
  'rejected',
] as const;

export const providerAccountStatusValues = ['inactive', 'active', 'suspended'] as const;

export type ProviderAccountOnboardingStatus =
  (typeof providerAccountOnboardingStatusValues)[number];
export type ProviderAccountStatus = (typeof providerAccountStatusValues)[number];

export const paymentProviderAccounts = noro.table(
  'payment_provider_accounts',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    // Um tenant = uma subconta por provider
    tenantId: uuid('tenant_id').notNull(),
    provider: text('provider').notNull().default('asaas'),

    // Identificadores da subconta no gateway
    providerAccountId: text('provider_account_id'),
    providerWalletId: text('provider_wallet_id'),   // walletId para split

    onboardingStatus: text('onboarding_status')
      .$type<ProviderAccountOnboardingStatus>()
      .notNull()
      .default('pending'),

    // Consentimento explícito — o tenant clicou em "Ativar billing"
    consentRegisteredAt: timestamp('consent_registered_at', { withTimezone: true }),
    // FK lógica para noro.users — quem ativou
    consentRegisteredBy: uuid('consent_registered_by'),

    status: text('status')
      .$type<ProviderAccountStatus>()
      .notNull()
      .default('inactive'),

    // Resposta bruta da API de onboarding
    metadata: jsonb('metadata').$type<Record<string, unknown>>(),

    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    // Um tenant só pode ter uma conta por provider
    uniqueIndex('ppa_tenant_provider_uidx').on(table.tenantId, table.provider),
    index('ppa_status_idx').on(table.status),
    index('ppa_onboarding_status_idx').on(table.onboardingStatus),
  ],
);
