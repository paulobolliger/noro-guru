import { eq } from 'drizzle-orm';
import { paymentWebhookEvents } from '../schema';
import type { NoroDatabase } from '../index';

export async function insertWebhookEvent(
  db: NoroDatabase,
  input: {
    provider?: string;
    providerEventId: string;
    eventType: string;
    chargeId?: string | null;
    payload: Record<string, unknown>;
  },
) {
  // ON CONFLICT DO NOTHING — idempotência via UNIQUE(provider, provider_event_id)
  // Se o evento já existe, retorna null sem erro
  const [created] = await db
    .insert(paymentWebhookEvents)
    .values({ ...input, provider: input.provider ?? 'asaas' })
    .onConflictDoNothing()
    .returning();
  return created ?? null; // null significa evento duplicado — ignorar
}

export async function markWebhookProcessed(db: NoroDatabase, eventId: string) {
  const [updated] = await db
    .update(paymentWebhookEvents)
    .set({ processed: true, processedAt: new Date() })
    .where(eq(paymentWebhookEvents.id, eventId))
    .returning();
  return updated ?? null;
}

export async function markWebhookFailed(db: NoroDatabase, eventId: string, error: string) {
  const [updated] = await db
    .update(paymentWebhookEvents)
    .set({ processed: false, error })
    .where(eq(paymentWebhookEvents.id, eventId))
    .returning();
  return updated ?? null;
}

export async function getUnprocessedEvents(db: NoroDatabase, limit = 50) {
  return db.query.paymentWebhookEvents.findMany({
    where: eq(paymentWebhookEvents.processed, false),
    limit,
  });
}
