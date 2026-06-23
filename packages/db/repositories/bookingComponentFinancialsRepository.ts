import { and, eq } from 'drizzle-orm';
import { bookingComponentFinancials, type OperationMode } from '../schema';
import type { NoroDatabase } from '../index';

export type CreateBookingComponentFinancialsInput = {
  tenantId: string;
  bookingId: string;
  componentId: string;
  operationMode: OperationMode;
  supplierNetAmount: string;
  supplierCommissionAmount?: string;
  markupAmount?: string;
  serviceFeeAmount?: string;
  discountAmount?: string;
  taxAmount?: string;
  grossClientAmount: string;
  taxableServiceAmount: string;
  currency?: string;
  supplierId?: string | null;
};

export type UpdateBookingComponentFinancialsInput = Partial<CreateBookingComponentFinancialsInput>;

export async function createBookingComponentFinancials(
  db: NoroDatabase,
  input: CreateBookingComponentFinancialsInput
) {
  const [created] = await db.insert(bookingComponentFinancials).values(input).returning();
  return created ?? null;
}

export async function getBookingComponentFinancialsById(
  db: NoroDatabase,
  tenantId: string,
  financialsId: string
) {
  return db.query.bookingComponentFinancials.findFirst({
    where: and(
      eq(bookingComponentFinancials.tenantId, tenantId),
      eq(bookingComponentFinancials.id, financialsId)
    ),
  });
}

export async function getBookingComponentFinancialsByBooking(
  db: NoroDatabase,
  tenantId: string,
  bookingId: string
) {
  return db.query.bookingComponentFinancials.findMany({
    where: and(
      eq(bookingComponentFinancials.tenantId, tenantId),
      eq(bookingComponentFinancials.bookingId, bookingId)
    ),
    orderBy: (t, { asc }) => [asc(t.createdAt)],
  });
}

export async function updateBookingComponentFinancials(
  db: NoroDatabase,
  tenantId: string,
  financialsId: string,
  input: UpdateBookingComponentFinancialsInput
) {
  const [updated] = await db
    .update(bookingComponentFinancials)
    .set({ ...input, updatedAt: new Date() })
    .where(
      and(
        eq(bookingComponentFinancials.tenantId, tenantId),
        eq(bookingComponentFinancials.id, financialsId)
      )
    )
    .returning();
  return updated ?? null;
}

export async function deleteBookingComponentFinancials(
  db: NoroDatabase,
  tenantId: string,
  financialsId: string
) {
  const [deleted] = await db
    .delete(bookingComponentFinancials)
    .where(
      and(
        eq(bookingComponentFinancials.tenantId, tenantId),
        eq(bookingComponentFinancials.id, financialsId)
      )
    )
    .returning();
  return deleted ?? null;
}
