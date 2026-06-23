import { and, eq } from 'drizzle-orm';
import { travelCredits } from '../schema';
import type { NoroDatabase } from '../index';

export type CreateTravelCreditInput = {
  tenantId: string;
  ownerType: string;
  ownerPassengerId?: string | null;
  ownerCompanyId?: string | null;
  sourceDocId: string;
  creditDocNumber?: string | null;
  originalAmount: string;
  remainingAmount: string;
  currency?: string;
  isRefundable?: boolean;
  issuedAt: Date;
  expiresAt: Date;
  status?: string;
};

export type UpdateTravelCreditInput = Partial<CreateTravelCreditInput>;

export async function createTravelCredit(db: NoroDatabase, input: CreateTravelCreditInput) {
  const [created] = await db.insert(travelCredits).values(input).returning();
  return created ?? null;
}

export async function getTravelCreditById(db: NoroDatabase, tenantId: string, creditId: string) {
  return db.query.travelCredits.findFirst({
    where: and(eq(travelCredits.tenantId, tenantId), eq(travelCredits.id, creditId)),
  });
}

export async function getTravelCreditsByPassenger(db: NoroDatabase, tenantId: string, passengerId: string) {
  return db.query.travelCredits.findMany({
    where: and(eq(travelCredits.tenantId, tenantId), eq(travelCredits.ownerPassengerId, passengerId)),
    orderBy: (t, { desc }) => [desc(t.createdAt)],
  });
}

export async function getTravelCreditsByCompany(db: NoroDatabase, tenantId: string, companyId: string) {
  return db.query.travelCredits.findMany({
    where: and(eq(travelCredits.tenantId, tenantId), eq(travelCredits.ownerCompanyId, companyId)),
    orderBy: (t, { desc }) => [desc(t.createdAt)],
  });
}

export async function updateTravelCredit(
  db: NoroDatabase,
  tenantId: string,
  creditId: string,
  input: UpdateTravelCreditInput
) {
  const [updated] = await db
    .update(travelCredits)
    .set({ ...input, updatedAt: new Date() })
    .where(and(eq(travelCredits.tenantId, tenantId), eq(travelCredits.id, creditId)))
    .returning();
  return updated ?? null;
}

export async function deleteTravelCredit(db: NoroDatabase, tenantId: string, creditId: string) {
  const [deleted] = await db
    .delete(travelCredits)
    .where(and(eq(travelCredits.tenantId, tenantId), eq(travelCredits.id, creditId)))
    .returning();
  return deleted ?? null;
}
