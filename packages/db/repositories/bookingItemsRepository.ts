import { and, eq } from 'drizzle-orm';
import { bookingItems, type ItemStatus, type ServiceType } from '../schema';
import type { NoroDatabase } from '../index';

export type CreateBookingItemInput = {
  tenantId: string;
  bookingId: string;
  serviceType: ServiceType;
  supplierId: string;
  status?: ItemStatus;
  serviceDate?: Date | null;
  supplierPayloadSnapshot?: Record<string, unknown> | null;
  normalizedSnapshot?: Record<string, unknown> | null;
};

export type UpdateBookingItemInput = Partial<CreateBookingItemInput>;

export async function createBookingItem(db: NoroDatabase, input: CreateBookingItemInput) {
  const [created] = await db.insert(bookingItems).values(input).returning();
  return created ?? null;
}

export async function getBookingItemById(db: NoroDatabase, tenantId: string, bookingItemId: string) {
  return db.query.bookingItems.findFirst({
    where: and(eq(bookingItems.tenantId, tenantId), eq(bookingItems.id, bookingItemId)),
  });
}

export async function getBookingItemsByBooking(db: NoroDatabase, tenantId: string, bookingId: string) {
  return db.query.bookingItems.findMany({
    where: and(eq(bookingItems.tenantId, tenantId), eq(bookingItems.bookingId, bookingId)),
    orderBy: (t, { asc }) => [asc(t.createdAt)],
  });
}

export async function updateBookingItem(
  db: NoroDatabase,
  tenantId: string,
  bookingItemId: string,
  input: UpdateBookingItemInput
) {
  const [updated] = await db
    .update(bookingItems)
    .set({ ...input, updatedAt: new Date() })
    .where(and(eq(bookingItems.tenantId, tenantId), eq(bookingItems.id, bookingItemId)))
    .returning();
  return updated ?? null;
}

export async function deleteBookingItem(db: NoroDatabase, tenantId: string, bookingItemId: string) {
  const [deleted] = await db
    .delete(bookingItems)
    .where(and(eq(bookingItems.tenantId, tenantId), eq(bookingItems.id, bookingItemId)))
    .returning();
  return deleted ?? null;
}
