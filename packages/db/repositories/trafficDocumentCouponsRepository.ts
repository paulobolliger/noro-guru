import { and, eq } from 'drizzle-orm';
import { trafficDocumentCoupons, type DocState } from '../schema';
import type { NoroDatabase } from '../index';

export type CreateTrafficDocumentCouponInput = {
  tenantId: string;
  trafficDocumentId: string;
  couponNumber: number;
  segmentId?: string | null;
  origin: string;
  destination: string;
  departureAt?: Date | null;
  status: DocState;
  fareBasis?: string | null;
  bookingClass?: string | null;
};

export type UpdateTrafficDocumentCouponInput = Partial<CreateTrafficDocumentCouponInput>;

export async function createTrafficDocumentCoupon(
  db: NoroDatabase,
  input: CreateTrafficDocumentCouponInput
) {
  const [created] = await db.insert(trafficDocumentCoupons).values(input).returning();
  return created ?? null;
}

export async function getCouponsByDocument(
  db: NoroDatabase,
  tenantId: string,
  trafficDocumentId: string
) {
  return db.query.trafficDocumentCoupons.findMany({
    where: and(
      eq(trafficDocumentCoupons.tenantId, tenantId),
      eq(trafficDocumentCoupons.trafficDocumentId, trafficDocumentId)
    ),
    orderBy: (t, { asc }) => [asc(t.couponNumber)],
  });
}

export async function updateTrafficDocumentCoupon(
  db: NoroDatabase,
  tenantId: string,
  couponId: string,
  input: UpdateTrafficDocumentCouponInput
) {
  const [updated] = await db
    .update(trafficDocumentCoupons)
    .set({ ...input, updatedAt: new Date() })
    .where(and(eq(trafficDocumentCoupons.tenantId, tenantId), eq(trafficDocumentCoupons.id, couponId)))
    .returning();
  return updated ?? null;
}

export async function deleteTrafficDocumentCoupon(
  db: NoroDatabase,
  tenantId: string,
  couponId: string
) {
  const [deleted] = await db
    .delete(trafficDocumentCoupons)
    .where(and(eq(trafficDocumentCoupons.tenantId, tenantId), eq(trafficDocumentCoupons.id, couponId)))
    .returning();
  return deleted ?? null;
}
