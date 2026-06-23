import { and, eq } from 'drizzle-orm';
import { trafficDocuments, type DocType, type DocState } from '../schema';
import type { NoroDatabase } from '../index';

export type CreateTrafficDocumentInput = {
  tenantId: string;
  bookingId: string;
  bookingItemId: string;
  paxId: string;
  docType: DocType;
  docNumber: string;
  checkDigit?: string | null;
  validatingCarrier?: string | null;
  state?: DocState;
  exchangedFromDocId?: string | null;
  originalIssueDocNumber?: string | null;
  originalIssueDate?: Date | null;
  originalIssueAgent?: string | null;
  issuedAt?: Date | null;
  voidDeadline?: Date | null;
  fareAmount?: string;
  taxAmount?: string;
  currency?: string;
  metadata?: string | null;
};

export type UpdateTrafficDocumentInput = Partial<CreateTrafficDocumentInput>;

export async function createTrafficDocument(db: NoroDatabase, input: CreateTrafficDocumentInput) {
  const [created] = await db.insert(trafficDocuments).values(input).returning();
  return created ?? null;
}

export async function getTrafficDocumentById(db: NoroDatabase, tenantId: string, docId: string) {
  return db.query.trafficDocuments.findFirst({
    where: and(eq(trafficDocuments.tenantId, tenantId), eq(trafficDocuments.id, docId)),
  });
}

export async function getTrafficDocumentsByBooking(db: NoroDatabase, tenantId: string, bookingId: string) {
  return db.query.trafficDocuments.findMany({
    where: and(eq(trafficDocuments.tenantId, tenantId), eq(trafficDocuments.bookingId, bookingId)),
    orderBy: (t, { desc }) => [desc(t.createdAt)],
  });
}

export async function updateTrafficDocument(
  db: NoroDatabase,
  tenantId: string,
  docId: string,
  input: UpdateTrafficDocumentInput
) {
  const [updated] = await db
    .update(trafficDocuments)
    .set({ ...input, updatedAt: new Date() })
    .where(and(eq(trafficDocuments.tenantId, tenantId), eq(trafficDocuments.id, docId)))
    .returning();
  return updated ?? null;
}

export async function deleteTrafficDocument(db: NoroDatabase, tenantId: string, docId: string) {
  const [deleted] = await db
    .delete(trafficDocuments)
    .where(and(eq(trafficDocuments.tenantId, tenantId), eq(trafficDocuments.id, docId)))
    .returning();
  return deleted ?? null;
}
