import { and, eq, gte, or, sql } from 'drizzle-orm';
import { partnerApiKeys } from '../schema';
import type { NoroDatabase } from '../index';

export async function verifyPartnerKey(db: NoroDatabase, keyHash: string) {
  const now = new Date();
  return db.query.partnerApiKeys.findFirst({
    where: and(
      eq(partnerApiKeys.apiKeyHash, keyHash),
      eq(partnerApiKeys.status, 'active'),
      or(
        sql`${partnerApiKeys.expiresAt} IS NULL`,
        gte(partnerApiKeys.expiresAt, now)
      )
    ),
  });
}

export async function createPartnerApiKey(
  db: NoroDatabase,
  input: {
    companyName: string;
    document: string;
    apiKeyHash: string;
    status?: string;
    rateLimitPerMinute?: number;
    expiresAt?: Date | null;
  }
) {
  const [created] = await db.insert(partnerApiKeys).values(input).returning();
  return created ?? null;
}
