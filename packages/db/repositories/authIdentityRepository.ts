import { and, eq } from 'drizzle-orm';
import { identityLinks, type IdentityProvider } from '../schema';
import type { NoroDatabase } from '../index';

export type CreateIdentityLinkInput = {
  userId: string;
  provider: IdentityProvider;
  providerSubject: string;
  providerEmail?: string | null;
  legacySupabaseUserId?: string | null;
  metadata?: Record<string, unknown> | null;
};

export async function findUserByProviderSubject(
  db: NoroDatabase,
  provider: IdentityProvider,
  providerSubject: string,
) {
  return db.query.identityLinks.findFirst({
    where: and(
      eq(identityLinks.provider, provider),
      eq(identityLinks.providerSubject, providerSubject),
    ),
    with: {
      user: true,
    },
  });
}

export async function createIdentityLink(db: NoroDatabase, input: CreateIdentityLinkInput) {
  const [created] = await db.insert(identityLinks).values(input).returning();
  return created ?? null;
}

export async function findByLegacySupabaseUserId(db: NoroDatabase, legacySupabaseUserId: string) {
  return db.query.identityLinks.findFirst({
    where: eq(identityLinks.legacySupabaseUserId, legacySupabaseUserId),
    with: {
      user: true,
    },
  });
}

export async function linkLogtoIdentity(
  db: NoroDatabase,
  input: Omit<CreateIdentityLinkInput, 'provider'>,
) {
  return createIdentityLink(db, {
    ...input,
    provider: 'logto',
  });
}

export async function reconcileLegacyIdentity(
  db: NoroDatabase,
  input: Omit<CreateIdentityLinkInput, 'provider'>,
) {
  return createIdentityLink(db, {
    ...input,
    provider: 'supabase',
  });
}
