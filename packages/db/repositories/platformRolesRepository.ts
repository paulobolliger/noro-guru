import { and, asc, eq } from 'drizzle-orm';
import {
  platformRoleAssignments,
  type PlatformRole,
  type PlatformRoleStatus,
} from '../schema';
import type { NoroDatabase } from '../index';

export async function grantPlatformRole(
  db: NoroDatabase,
  input: {
    userId: string;
    role: PlatformRole;
    status?: PlatformRoleStatus;
    grantedByUserId?: string | null;
    metadata?: Record<string, unknown> | null;
  },
) {
  const [created] = await db.insert(platformRoleAssignments).values(input).returning();
  return created ?? null;
}

export async function revokePlatformRole(db: NoroDatabase, userId: string, role: PlatformRole) {
  const [updated] = await db
    .update(platformRoleAssignments)
    .set({ status: 'archived', updatedAt: new Date() })
    .where(and(eq(platformRoleAssignments.userId, userId), eq(platformRoleAssignments.role, role)))
    .returning();

  return updated ?? null;
}

export async function listPlatformRoles(db: NoroDatabase, userId: string) {
  return db.query.platformRoleAssignments.findMany({
    where: eq(platformRoleAssignments.userId, userId),
    orderBy: [asc(platformRoleAssignments.createdAt)],
  });
}

export async function hasPlatformRole(db: NoroDatabase, userId: string, role: PlatformRole) {
  const assignment = await db.query.platformRoleAssignments.findFirst({
    where: and(
      eq(platformRoleAssignments.userId, userId),
      eq(platformRoleAssignments.role, role),
      eq(platformRoleAssignments.status, 'active'),
    ),
  });

  return Boolean(assignment);
}

export async function assertPlatformRole(db: NoroDatabase, userId: string, role: PlatformRole) {
  const allowed = await hasPlatformRole(db, userId, role);

  if (!allowed) {
    throw new Error('Platform role required.');
  }

  return true;
}
