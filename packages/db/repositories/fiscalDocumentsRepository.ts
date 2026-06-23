import { and, eq } from 'drizzle-orm';
import { fiscalDocuments, type FiscalDocType, type FiscalDocStatus } from '../schema';
import type { NoroDatabase } from '../index';

export type CreateFiscalDocumentInput = {
  tenantId: string;
  bookingId: string;
  docType: FiscalDocType;
  docNumber?: string | null;
  serie?: string | null;
  amount: string;
  taxableAmount?: string;
  taxRate?: string;
  taxAmount?: string;
  status?: FiscalDocStatus;
  pdfUrl?: string | null;
  xmlUrl?: string | null;
  externalId?: string | null;
  errorMessage?: string | null;
};

export type UpdateFiscalDocumentInput = Partial<CreateFiscalDocumentInput>;

export async function createFiscalDocument(db: NoroDatabase, input: CreateFiscalDocumentInput) {
  const [created] = await db.insert(fiscalDocuments).values(input).returning();
  return created ?? null;
}

export async function getFiscalDocumentById(db: NoroDatabase, tenantId: string, docId: string) {
  return db.query.fiscalDocuments.findFirst({
    where: and(eq(fiscalDocuments.tenantId, tenantId), eq(fiscalDocuments.id, docId)),
  });
}

export async function getFiscalDocumentsByBooking(db: NoroDatabase, tenantId: string, bookingId: string) {
  return db.query.fiscalDocuments.findMany({
    where: and(eq(fiscalDocuments.tenantId, tenantId), eq(fiscalDocuments.bookingId, bookingId)),
    orderBy: (t, { desc }) => [desc(t.createdAt)],
  });
}

export async function updateFiscalDocument(
  db: NoroDatabase,
  tenantId: string,
  docId: string,
  input: UpdateFiscalDocumentInput
) {
  const [updated] = await db
    .update(fiscalDocuments)
    .set({ ...input, updatedAt: new Date() })
    .where(and(eq(fiscalDocuments.tenantId, tenantId), eq(fiscalDocuments.id, docId)))
    .returning();
  return updated ?? null;
}

export async function deleteFiscalDocument(db: NoroDatabase, tenantId: string, docId: string) {
  const [deleted] = await db
    .delete(fiscalDocuments)
    .where(and(eq(fiscalDocuments.tenantId, tenantId), eq(fiscalDocuments.id, docId)))
    .returning();
  return deleted ?? null;
}
