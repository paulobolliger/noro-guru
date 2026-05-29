import { and, asc, eq } from 'drizzle-orm';
import {
  tenantMemberships,
  type MembershipStatus,
  type TenantRole,
} from '../schema';
import type { NoroDatabase } from '../index';

export type CreateMembershipInput = {
  tenantId: string;
  userId: string;
  role: TenantRole;
  status?: MembershipStatus;
  invitedByUserId?: string | null;
  joinedAt?: Date | null;
  metadata?: Record<string, unknown> | null;
};

export async function createMembership(db: NoroDatabase, input: CreateMembershipInput) {
  const [created] = await db.insert(tenantMemberships).values(input).returning();
  return created ?? null;
}

export async function getMembership(db: NoroDatabase, tenantId: string, userId: string) {
  return db.query.tenantMemberships.findFirst({
    where: and(
      eq(tenantMemberships.tenantId, tenantId),
      eq(tenantMemberships.userId, userId),
    ),
  });
}

export async function listMembershipsByUser(db: NoroDatabase, userId: string) {
  return db.query.tenantMemberships.findMany({
    where: eq(tenantMemberships.userId, userId),
    orderBy: [asc(tenantMemberships.createdAt)],
    with: {
      tenant: true,
    },
  });
}

export async function listMembersByTenant(db: NoroDatabase, tenantId: string) {
  return db.query.tenantMemberships.findMany({
    where: eq(tenantMemberships.tenantId, tenantId),
    orderBy: [asc(tenantMemberships.createdAt)],
    with: {
      user: true,
    },
  });
}

export async function updateMembershipRole(
  db: NoroDatabase,
  tenantId: string,
  userId: string,
  role: TenantRole,
) {
  const [updated] = await db
    .update(tenantMemberships)
    .set({ role, updatedAt: new Date() })
    .where(and(eq(tenantMemberships.tenantId, tenantId), eq(tenantMemberships.userId, userId)))
    .returning();

  return updated ?? null;
}

export async function updateMembershipStatus(
  db: NoroDatabase,
  tenantId: string,
  userId: string,
  status: MembershipStatus,
) {
  const [updated] = await db
    .update(tenantMemberships)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(tenantMemberships.tenantId, tenantId), eq(tenantMemberships.userId, userId)))
    .returning();

  return updated ?? null;
}

export async function assertActiveMembership(db: NoroDatabase, tenantId: string, userId: string) {
  const membership = await getMembership(db, tenantId, userId);

  if (!membership || membership.status !== 'active') {
    throw new Error('Active tenant membership required.');
  }

  return membership;
}
