import { and, eq } from 'drizzle-orm';
import { agencyMemos } from '../schema';
import type { NoroDatabase } from '../index';

export type CreateAgencyMemoInput = {
  tenantId: string;
  memoType: string; // 'ADM' | 'ACM'
  memoNumber: string;
  supplierId: string;
  ticketNumber?: string | null;
  amount: string;
  reason?: string | null;
  status?: string;
  resolvedAt?: Date | null;
};

export type UpdateAgencyMemoInput = Partial<CreateAgencyMemoInput>;

export async function createAgencyMemo(db: NoroDatabase, input: CreateAgencyMemoInput) {
  const [created] = await db.insert(agencyMemos).values(input).returning();
  return created ?? null;
}

export async function getAgencyMemoById(db: NoroDatabase, tenantId: string, memoId: string) {
  return db.query.agencyMemos.findFirst({
    where: and(eq(agencyMemos.tenantId, tenantId), eq(agencyMemos.id, memoId)),
  });
}

export async function getAgencyMemosByTenant(db: NoroDatabase, tenantId: string) {
  return db.query.agencyMemos.findMany({
    where: eq(agencyMemos.tenantId, tenantId),
    orderBy: (t, { desc }) => [desc(t.createdAt)],
  });
}

export async function updateAgencyMemo(
  db: NoroDatabase,
  tenantId: string,
  memoId: string,
  input: UpdateAgencyMemoInput
) {
  const [updated] = await db
    .update(agencyMemos)
    .set({ ...input, updatedAt: new Date() })
    .where(and(eq(agencyMemos.tenantId, tenantId), eq(agencyMemos.id, memoId)))
    .returning();
  return updated ?? null;
}

export async function deleteAgencyMemo(db: NoroDatabase, tenantId: string, memoId: string) {
  const [deleted] = await db
    .delete(agencyMemos)
    .where(and(eq(agencyMemos.tenantId, tenantId), eq(agencyMemos.id, memoId)))
    .returning();
  return deleted ?? null;
}
