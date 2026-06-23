// app/api/webhooks/asaas/route.ts
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import {
  createDatabaseClient,
  paymentWebhookEventsRepository,
  paymentChargesRepository,
  paymentCharges,
} from '@noro/db';
import { asaasProvider, mapAsaasStatus } from '@noro/lib/providers/asaas-provider';

// Configuração do segredo do webhook configurado no painel do Asaas
const ASAAS_WEBHOOK_SECRET = process.env.ASAAS_WEBHOOK_SECRET;

/**
 * Route Handler para receber eventos de Webhook do Asaas.
 * Processa eventos de pagamento (PIX, Boleto, Cartão) e atualiza o Drizzle e o Supabase.
 */
export async function POST(req: Request) {
  // 1. Validar a assinatura do Webhook (Segurança)
  const webhookToken = req.headers.get('asaas-access-token');
  
  if (ASAAS_WEBHOOK_SECRET && webhookToken !== ASAAS_WEBHOOK_SECRET) {
    console.error('[Webhook Asaas] Erro: Token de segurança inválido ou ausente.');
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // 2. Extrair o body bruto para processamento
  let rawText: string;
  try {
    rawText = await req.text();
  } catch (err) {
    console.error('[Webhook Asaas] Erro ao ler corpo da requisição.');
    return NextResponse.json({ message: 'Invalid body' }, { status: 400 });
  }

  // 3. Parsear o evento do Asaas
  let webhookEvent;
  try {
    webhookEvent = await asaasProvider.parseWebhook({
      body: rawText,
      headers: {
        'asaas-access-token': webhookToken || undefined,
      },
    });
  } catch (err: any) {
    console.error('[Webhook Asaas] Erro ao parsear webhook:', err.message);
    return NextResponse.json({ message: err.message }, { status: 400 });
  }

  const { providerEventId, eventType, providerPaymentId, raw } = webhookEvent;
  console.log(`[Webhook Asaas] Evento recebido: ${eventType} (ID: ${providerEventId}, PaymentID: ${providerPaymentId})`);

  if (!providerPaymentId) {
    console.log(`[Webhook Asaas] Evento sem providerPaymentId associado. Ignorando.`);
    return NextResponse.json({ received: true }, { status: 200 });
  }

  const { db, client, close } = createDatabaseClient();
  let insertedEvent: any = null;

  try {
    // 4. Idempotência: Salvar o evento bruto no banco de dados (Drizzle)
    insertedEvent = await paymentWebhookEventsRepository.insertWebhookEvent(db, {
      provider: 'asaas',
      providerEventId,
      eventType,
      payload: raw,
    });

    // Se inserção retornou null, significa que já processamos este evento (unique key constraint)
    if (!insertedEvent) {
      console.log(`[Webhook Asaas] Evento duplicado ignorado de forma idempotente: ${providerEventId}`);
      await close();
      return NextResponse.json({ received: true, duplicate: true }, { status: 200 });
    }

    // 5. Sincronizar com o banco de dados (Drizzle - payment_charges) se houver registro da cobrança
    let chargeRecord: any = null;
    try {
      const [charge] = await db
        .select()
        .from(paymentCharges)
        .where(eq(paymentCharges.providerPaymentId, providerPaymentId))
        .limit(1);

      if (charge) {
        chargeRecord = charge;
        const paymentData = raw.payment as any;
        const asaasStatus = paymentData?.status;
        const internalStatus = asaasStatus ? mapAsaasStatus(asaasStatus) : 'pending';
        
        const netAmount = paymentData?.netValue;
        const paidDateStr = paymentData?.confirmedDate || paymentData?.clientPaymentDate;

        await paymentChargesRepository.updateChargeFromWebhook(db, charge.id, {
          status: internalStatus as any,
          netAmountCents: netAmount ? Math.round(netAmount * 100) : undefined,
          paidAt: paidDateStr ? new Date(paidDateStr) : undefined,
          confirmedAt: paymentData?.confirmedDate ? new Date(paymentData.confirmedDate) : undefined,
          receivedAt: paymentData?.creditDate ? new Date(paymentData.creditDate) : undefined,
          providerPayload: raw,
        });

        console.log(`[Webhook Asaas] Drizzle Charge ${charge.id} atualizada para o status: ${internalStatus}`);
      }
    } catch (dbErr) {
      console.error('[Webhook Asaas] Erro ao atualizar tabela payment_charges no Drizzle:', dbErr);
    }

    // 6. Sincronizar com o banco de dados da VPS (sales.orders)
    if (chargeRecord) {
      const paymentData = raw.payment as any;
      const asaasStatus = paymentData?.status;
      const internalStatus = asaasStatus ? mapAsaasStatus(asaasStatus) : 'pending';

      let nextOrderStatus: string | null = null;
      if (internalStatus === 'received' || internalStatus === 'confirmed') {
        nextOrderStatus = 'CONCLUIDO';
      } else if (internalStatus === 'canceled' || internalStatus === 'failed') {
        nextOrderStatus = 'CANCELADO';
      } else if (internalStatus === 'overdue') {
        nextOrderStatus = 'AGUARDANDO_PAGAMENTO';
      }

      if (nextOrderStatus && chargeRecord.proposalId) {
        await client`
          UPDATE sales.orders 
          SET status = ${nextOrderStatus} 
          WHERE id = ${chargeRecord.proposalId}
        `;
        console.log(`[Webhook Asaas] Pedido ${chargeRecord.proposalId} atualizado no banco VPS para status: ${nextOrderStatus}`);

        // Revalidar rotas afetadas do Next.js
        revalidatePath(`/admin/pedidos/${chargeRecord.proposalId}`);
        revalidatePath('/admin/pagamentos');
      }
    } else {
      console.log(`[Webhook Asaas] Nenhuma cobrança encontrada em noro.payment_charges para transaction_id: ${providerPaymentId}`);
    }

    // 7. Marcar o webhook como processado no Drizzle
    if (insertedEvent) {
      await paymentWebhookEventsRepository.markWebhookProcessed(db, insertedEvent.id);
    }

  } catch (err: any) {
    console.error('[Webhook Asaas] Erro de execução ao processar webhook:', err);
    try {
      if (insertedEvent) {
        await paymentWebhookEventsRepository.markWebhookFailed(db, insertedEvent.id, err.message || String(err));
      }
    } catch (repoErr) {
      console.error('[Webhook Asaas] Falha ao gravar status de erro do evento no banco:', repoErr);
    }
    await close();
    // Retorna 500 para o Asaas re-tentar o envio
    return NextResponse.json({ error: err.message }, { status: 500 });
  }

  await close();
  return NextResponse.json({ received: true }, { status: 200 });
}
