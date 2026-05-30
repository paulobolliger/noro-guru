import { and, desc, eq } from 'drizzle-orm';
import { paymentCharges, type ChargeStatus, type ChargeRepasseModelo } from '../schema';
import type { NoroDatabase } from '../index';

export type CreateChargeInput = {
  tenantId: string;
  proposalId?: string | null;
  paymentCustomerId?: string | null;
  repasseModelo: ChargeRepasseModelo;
  amountCents: number;
  currency?: string;
  taxaCambioSnapshot?: string | null;
  billingType: 'PIX' | 'BOLETO' | 'CREDIT_CARD';
  installments?: number;
  dueDate?: string | null;
  splitNoroPct?: string | null;
  splitNoroCents?: number | null;
  splitTenantCents?: number | null;
  provider?: string;
};

export async function createCharge(db: NoroDatabase, input: CreateChargeInput) {
  const [created] = await db
    .insert(paymentCharges)
    .values({
      ...input,
      provider: input.provider ?? 'asaas',
      status: 'draft',
      // escrowStatus: null quando repasseModelo = 'agencia' (regra de negócio)
      // preenchido pelo serviço de billing quando repasseModelo = 'plataforma'
    })
    .returning();
  return created ?? null;
}

export async function getChargeById(db: NoroDatabase, chargeId: string) {
  return db.query.paymentCharges.findFirst({
    where: eq(paymentCharges.id, chargeId),
    with: { customer: true },
  });
}

export async function getChargesByProposal(db: NoroDatabase, proposalId: string) {
  return db.query.paymentCharges.findMany({
    where: eq(paymentCharges.proposalId, proposalId),
    orderBy: [desc(paymentCharges.createdAt)],
  });
}

export async function getChargesByTenant(
  db: NoroDatabase,
  tenantId: string,
  filters: { status?: ChargeStatus; limit?: number; offset?: number } = {},
) {
  const { status, limit = 50, offset = 0 } = filters;
  const conditions = [eq(paymentCharges.tenantId, tenantId)];
  if (status) conditions.push(eq(paymentCharges.status, status));

  return db.query.paymentCharges.findMany({
    where: and(...conditions),
    orderBy: [desc(paymentCharges.createdAt)],
    limit,
    offset,
  });
}

export async function updateChargeFromWebhook(
  db: NoroDatabase,
  chargeId: string,
  data: {
    providerPaymentId?: string;
    status?: ChargeStatus;
    netAmountCents?: number;
    paidAt?: Date;
    confirmedAt?: Date;
    receivedAt?: Date;
    checkoutUrl?: string;
    invoiceUrl?: string;
    bankSlipUrl?: string;
    pixQrCode?: string;
    pixCopyPaste?: string;
    providerPayload?: Record<string, unknown>;
  },
) {
  const [updated] = await db
    .update(paymentCharges)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(paymentCharges.id, chargeId))
    .returning();
  return updated ?? null;
}

export async function setChargeEscrow(
  db: NoroDatabase,
  chargeId: string,
  escrowStatus: 'held' | 'released' | 'refunded',
  releaseAt?: Date,
) {
  const [updated] = await db
    .update(paymentCharges)
    .set({
      escrowStatus,
      ...(releaseAt ? { escrowReleaseAt: releaseAt } : {}),
      ...(escrowStatus === 'released' ? { escrowReleasedAt: new Date() } : {}),
      updatedAt: new Date(),
    })
    .where(eq(paymentCharges.id, chargeId))
    .returning();
  return updated ?? null;
}
