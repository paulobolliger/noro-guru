import { and, eq } from 'drizzle-orm';
import { paymentProviderAccounts, type ProviderAccountStatus } from '../schema';
import type { NoroDatabase } from '../index';

export async function getProviderAccount(db: NoroDatabase, tenantId: string, provider = 'asaas') {
  return db.query.paymentProviderAccounts.findFirst({
    where: and(
      eq(paymentProviderAccounts.tenantId, tenantId),
      eq(paymentProviderAccounts.provider, provider),
    ),
  });
}

export async function createProviderAccount(
  db: NoroDatabase,
  input: {
    tenantId: string;
    provider?: string;
    consentRegisteredAt: Date;
    consentRegisteredBy: string;
  },
) {
  const [created] = await db
    .insert(paymentProviderAccounts)
    .values({
      ...input,
      provider: input.provider ?? 'asaas',
      onboardingStatus: 'pending',
      status: 'inactive',
    })
    .returning();
  return created ?? null;
}

export async function updateProviderAccountOnboarding(
  db: NoroDatabase,
  tenantId: string,
  data: {
    providerAccountId?: string;
    providerWalletId?: string;
    onboardingStatus?: 'pending' | 'in_review' | 'approved' | 'rejected';
    status?: ProviderAccountStatus;
    metadata?: Record<string, unknown>;
  },
) {
  const [updated] = await db
    .update(paymentProviderAccounts)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(paymentProviderAccounts.tenantId, tenantId))
    .returning();
  return updated ?? null;
}
