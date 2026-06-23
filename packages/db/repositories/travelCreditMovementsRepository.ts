import { and, eq } from 'drizzle-orm';
import { travelCreditMovements } from '../schema';
import type { NoroDatabase } from '../index';

export type CreateTravelCreditMovementInput = {
  tenantId: string;
  travelCreditId: string;
  movementType: string;
  amount: string;
  currency?: string;
  relatedBookingId?: string | null;
  relatedDocId?: string | null;
  occurredAt?: Date;
  idempotencyKey: string;
  metadata?: string | null;
  createdBy?: string | null;
};

export type UpdateTravelCreditMovementInput = Partial<CreateTravelCreditMovementInput>;

export async function createTravelCreditMovement(
  db: NoroDatabase,
  input: CreateTravelCreditMovementInput
) {
  const [created] = await db.insert(travelCreditMovements).values(input).returning();
  return created ?? null;
}

export async function getMovementsByCredit(
  db: NoroDatabase,
  tenantId: string,
  travelCreditId: string
) {
  return db.query.travelCreditMovements.findMany({
    where: and(
      eq(travelCreditMovements.tenantId, tenantId),
      eq(travelCreditMovements.travelCreditId, travelCreditId)
    ),
    orderBy: (t, { asc }) => [asc(t.occurredAt)],
  });
}

export async function deleteTravelCreditMovement(
  db: NoroDatabase,
  tenantId: string,
  movementId: string
) {
  const [deleted] = await db
    .delete(travelCreditMovements)
    .where(and(eq(travelCreditMovements.tenantId, tenantId), eq(travelCreditMovements.id, movementId)))
    .returning();
  return deleted ?? null;
}
