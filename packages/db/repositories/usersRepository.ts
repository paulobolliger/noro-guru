import { asc, eq } from 'drizzle-orm';
import { users, type UserStatus } from '../schema';
import type { NoroDatabase } from '../index';

export type CreateUserProfileInput = {
  displayName?: string | null;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
  status?: UserStatus;
  metadata?: Record<string, unknown> | null;
};

export type UpdateUserStatusInput = {
  userId: string;
  status: UserStatus;
};

export async function createUserProfile(db: NoroDatabase, input: CreateUserProfileInput) {
  const [created] = await db.insert(users).values(input).returning();
  return created ?? null;
}

export async function getUserById(db: NoroDatabase, userId: string) {
  return db.query.users.findFirst({
    where: eq(users.id, userId),
  });
}

export async function getUserByEmail(db: NoroDatabase, email: string) {
  return db.query.users.findFirst({
    where: eq(users.email, email),
  });
}

export async function updateUserStatus(db: NoroDatabase, input: UpdateUserStatusInput) {
  const [updated] = await db
    .update(users)
    .set({ status: input.status, updatedAt: new Date() })
    .where(eq(users.id, input.userId))
    .returning();

  return updated ?? null;
}

export async function listUsers(db: NoroDatabase, limit = 100) {
  return db.query.users.findMany({
    orderBy: [asc(users.email)],
    limit,
  });
}
