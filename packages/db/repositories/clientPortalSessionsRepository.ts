import { and, eq, gt, isNull } from 'drizzle-orm';
import { clientPortalSessions } from '../schema';
import type { NoroDatabase } from '../index';
import { randomUUID } from 'crypto';

const SESSION_TTL_MINUTES = 15; // magic link expira em 15 minutos
const SESSION_ACTIVE_DAYS = 30;  // sessão verificada dura 30 dias

export async function createMagicLinkToken(
  db: NoroDatabase,
  input: { tenantId: string; clientId?: string | null; clientEmail: string },
) {
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MINUTES * 60 * 1000);

  const [created] = await db
    .insert(clientPortalSessions)
    .values({ ...input, token, expiresAt })
    .returning();
  return created ?? null;
}

export async function verifyMagicLinkToken(db: NoroDatabase, token: string) {
  const now = new Date();

  const session = await db.query.clientPortalSessions.findFirst({
    where: and(
      eq(clientPortalSessions.token, token),
      isNull(clientPortalSessions.verifiedAt),    // não usado ainda
      isNull(clientPortalSessions.revokedAt),     // não revogado
      gt(clientPortalSessions.expiresAt, now),    // não expirado
    ),
  });

  if (!session) return null;

  // Estende a sessão por 30 dias a partir do clique
  const newExpiry = new Date(Date.now() + SESSION_ACTIVE_DAYS * 24 * 60 * 60 * 1000);

  const [updated] = await db
    .update(clientPortalSessions)
    .set({ verifiedAt: now, expiresAt: newExpiry })
    .where(eq(clientPortalSessions.id, session.id))
    .returning();

  return updated ?? null;
}

export async function getActiveSession(db: NoroDatabase, sessionId: string) {
  const now = new Date();

  return db.query.clientPortalSessions.findFirst({
    where: and(
      eq(clientPortalSessions.id, sessionId),
      gt(clientPortalSessions.expiresAt, now),
      isNull(clientPortalSessions.revokedAt),
    ),
  });
}

export async function revokeSession(db: NoroDatabase, sessionId: string) {
  const [updated] = await db
    .update(clientPortalSessions)
    .set({ revokedAt: new Date() })
    .where(eq(clientPortalSessions.id, sessionId))
    .returning();
  return updated ?? null;
}
