import { and, eq } from 'drizzle-orm';
import { bspRecords } from '../schema';
import type { NoroDatabase } from '../index';

export type CreateBspRecordInput = {
  tenantId: string;
  bspIngestionId: string;
  ticketNumber: string;
  transactionType: string;
  issueDate?: Date | null;
  billingAmount: string;
  taxAmount?: string;
  commissionAmount?: string;
  reconciledState?: string;
  reconciledAt?: Date | null;
  matchedDocId?: string | null;
};

export type UpdateBspRecordInput = Partial<CreateBspRecordInput>;

export async function createBspRecord(db: NoroDatabase, input: CreateBspRecordInput) {
  const [created] = await db.insert(bspRecords).values(input).returning();
  return created ?? null;
}

export async function getBspRecordsByIngestion(
  db: NoroDatabase,
  tenantId: string,
  bspIngestionId: string
) {
  return db.query.bspRecords.findMany({
    where: and(eq(bspRecords.tenantId, tenantId), eq(bspRecords.bspIngestionId, bspIngestionId)),
    orderBy: (t, { asc }) => [asc(t.createdAt)],
  });
}

export async function updateBspRecord(
  db: NoroDatabase,
  tenantId: string,
  recordId: string,
  input: UpdateBspRecordInput
) {
  const [updated] = await db
    .update(bspRecords)
    .set({ ...input, updatedAt: new Date() })
    .where(and(eq(bspRecords.tenantId, tenantId), eq(bspRecords.id, recordId)))
    .returning();
  return updated ?? null;
}

export async function deleteBspRecord(db: NoroDatabase, tenantId: string, recordId: string) {
  const [deleted] = await db
    .delete(bspRecords)
    .where(and(eq(bspRecords.tenantId, tenantId), eq(bspRecords.id, recordId)))
    .returning();
  return deleted ?? null;
}

export async function getBspRecords(db: NoroDatabase, tenantId: string) {
  return db.query.bspRecords.findMany({
    where: eq(bspRecords.tenantId, tenantId),
    orderBy: (t, { desc }) => [desc(t.createdAt)],
  });
}
