import { and, eq } from 'drizzle-orm';
import { financialLedgerEntries } from '../schema';
import type { NoroDatabase } from '../index';

export type CreateFinancialLedgerEntryInput = {
  tenantId: string;
  bookingId: string;
  componentId?: string | null;
  sourceType: string;
  sourceId: string;
  entryType: string;
  debitAccount: string;
  creditAccount: string;
  amount: string;
  currency: string;
  occurredAt: Date;
};

export async function createFinancialLedgerEntry(
  db: NoroDatabase,
  input: CreateFinancialLedgerEntryInput
) {
  const [created] = await db.insert(financialLedgerEntries).values(input).returning();
  return created ?? null;
}

export async function getFinancialLedgerEntriesByBooking(
  db: NoroDatabase,
  tenantId: string,
  bookingId: string
) {
  return db.query.financialLedgerEntries.findMany({
    where: and(
      eq(financialLedgerEntries.tenantId, tenantId),
      eq(financialLedgerEntries.bookingId, bookingId)
    ),
    orderBy: (t, { asc }) => [asc(t.occurredAt)],
  });
}

export async function getFinancialLedgerEntriesBySource(
  db: NoroDatabase,
  tenantId: string,
  sourceType: string,
  sourceId: string
) {
  return db.query.financialLedgerEntries.findMany({
    where: and(
      eq(financialLedgerEntries.tenantId, tenantId),
      eq(financialLedgerEntries.sourceType, sourceType),
      eq(financialLedgerEntries.sourceId, sourceId)
    ),
    orderBy: (t, { asc }) => [asc(t.occurredAt)],
  });
}

export async function deleteFinancialLedgerEntry(
  db: NoroDatabase,
  tenantId: string,
  entryId: string
) {
  const [deleted] = await db
    .delete(financialLedgerEntries)
    .where(
      and(
        eq(financialLedgerEntries.tenantId, tenantId),
        eq(financialLedgerEntries.id, entryId)
      )
    )
    .returning();
  return deleted ?? null;
}
