import { and, eq } from 'drizzle-orm';
import { bookings, type BookingStatus, type Currency } from '../schema';
import type { NoroDatabase } from '../index';

export type CreateBookingInput = {
  tenantId: string;
  reference: string;
  clientId: string;
  buyerPartyId?: string | null;
  payerPartyId?: string | null;
  corporateAccountId?: string | null;
  status?: BookingStatus;
  currency?: Currency;
  saleDate?: Date | null;
  travelStartDate?: string | null;
  travelEndDate?: string | null;
};

export type UpdateBookingInput = Partial<CreateBookingInput>;

export async function createBooking(db: NoroDatabase, input: CreateBookingInput) {
  const [created] = await db.insert(bookings).values(input).returning();
  return created ?? null;
}

export async function getBookingById(db: NoroDatabase, tenantId: string, bookingId: string) {
  return db.query.bookings.findFirst({
    where: and(eq(bookings.tenantId, tenantId), eq(bookings.id, bookingId)),
  });
}

export async function getBookingsByTenant(
  db: NoroDatabase,
  tenantId: string,
  filters?: {
    status?: BookingStatus;
    clientId?: string;
    limit?: number;
    offset?: number;
  }
) {
  const conditions = [eq(bookings.tenantId, tenantId)];

  if (filters?.status) {
    conditions.push(eq(bookings.status, filters.status));
  }
  if (filters?.clientId) {
    conditions.push(eq(bookings.clientId, filters.clientId));
  }

  return db.query.bookings.findMany({
    where: and(...conditions),
    limit: filters?.limit,
    offset: filters?.offset,
    orderBy: (t, { desc }) => [desc(t.createdAt)],
  });
}

export async function updateBooking(
  db: NoroDatabase,
  tenantId: string,
  bookingId: string,
  input: UpdateBookingInput
) {
  const [updated] = await db
    .update(bookings)
    .set({ ...input, updatedAt: new Date() })
    .where(and(eq(bookings.tenantId, tenantId), eq(bookings.id, bookingId)))
    .returning();
  return updated ?? null;
}

export async function deleteBooking(db: NoroDatabase, tenantId: string, bookingId: string) {
  const [deleted] = await db
    .delete(bookings)
    .where(and(eq(bookings.tenantId, tenantId), eq(bookings.id, bookingId)))
    .returning();
  return deleted ?? null;
}
