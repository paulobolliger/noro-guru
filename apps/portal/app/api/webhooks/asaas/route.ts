import { type NextRequest, NextResponse } from 'next/server';
import { asaasProvider, mapAsaasStatus } from '@noro/lib/providers/asaas-provider';
import {
  createDatabaseClient,
  paymentWebhookEventsRepository,
  paymentChargesRepository,
} from '@noro/db';

// Endpoint: POST /api/webhooks/asaas
// Configurar no painel Asaas: https://sandbox.asaas.com → Configurações → Webhooks
//   URL: https://xyz.agencia.noro.guru/api/webhooks/asaas
//   (ou URL fixa se usar domínio único para o portal)

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headers = Object.fromEntries(request.headers.entries());

  let event;
  try {
    event = await asaasProvider.parseWebhook({ body, headers });
  } catch (err) {
    console.error('[webhook/asaas] Parse error:', err);
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
  }

  const { db, close } = createDatabaseClient();
  try {
    // Tenta inserir o evento — ON CONFLICT DO NOTHING garante idempotência
    const inserted = await paymentWebhookEventsRepository.insertWebhookEvent(db, {
      providerEventId: event.providerEventId,
      eventType: event.eventType,
      chargeId: null, // resolvido abaixo
      payload: event.raw,
    });

    // Evento duplicado → já foi processado, responde 200 sem reprocessar
    if (!inserted) {
      return NextResponse.json({ received: true, duplicate: true });
    }

    // Processa o evento
    await processWebhookEvent(db, inserted.id, event);

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('[webhook/asaas] Processing error:', err);
    const message = err instanceof Error ? err.message : 'internal_error';
    // Registra erro mas retorna 200 para o Asaas não reenviar
    return NextResponse.json({ received: true, error: message });
  } finally {
    await close();
  }
}

type ParsedEvent = Awaited<ReturnType<typeof asaasProvider.parseWebhook>>;
type DbClient = ReturnType<typeof createDatabaseClient>['db'];

async function processWebhookEvent(db: DbClient, eventId: string, event: ParsedEvent) {
  const { providerPaymentId, eventType, raw } = event;

  if (!providerPaymentId) {
    await paymentWebhookEventsRepository.markWebhookProcessed(db, eventId);
    return;
  }

  // Mapeia eventos Asaas para atualizações de status
  const statusMap: Record<string, string> = {
    PAYMENT_CONFIRMED: 'confirmed',
    PAYMENT_RECEIVED: 'received',
    PAYMENT_OVERDUE: 'overdue',
    PAYMENT_REFUNDED: 'refunded',
    PAYMENT_DELETED: 'canceled',
  };

  const newStatus = statusMap[eventType];

  if (newStatus && providerPaymentId) {
    // Busca a cobrança pelo provider_payment_id
    const charges = await db.query.paymentCharges.findMany({
      where: (t, { eq }) => eq(t.providerPaymentId, providerPaymentId),
      limit: 1,
    });

    const charge = charges[0];

    if (charge) {
      const payment = raw.payment as Record<string, unknown> | undefined;
      const now = new Date();

      await paymentChargesRepository.updateChargeFromWebhook(db, charge.id, {
        status: newStatus as any,
        netAmountCents: payment?.netValue
          ? Math.round((payment.netValue as number) * 100)
          : undefined,
        confirmedAt: newStatus === 'confirmed' ? now : undefined,
        receivedAt: newStatus === 'received' ? now : undefined,
        paidAt: ['confirmed', 'received'].includes(newStatus) ? now : undefined,
        providerPayload: raw,
      });

      // Atualiza o evento com o chargeId resolvido
      await db
        .update((await import('@noro/db')).paymentWebhookEvents)
        .set({ chargeId: charge.id })
        .where((await import('drizzle-orm')).eq(
          (await import('@noro/db')).paymentWebhookEvents.id,
          eventId,
        ));
    }
  }

  await paymentWebhookEventsRepository.markWebhookProcessed(db, eventId);
}
