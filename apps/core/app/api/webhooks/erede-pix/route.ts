// app/api/webhooks/erede-pix/route.ts
//
// Webhook para receber notificações assíncronas de pagamento PIX da e.Rede.
//
// ATIVAÇÃO OBRIGATÓRIA:
//   Ligar para a Central de Atendimento e.Rede para cadastrar esta URL:
//   - Capitais: 4001 4433
//   - Demais:   0800 728 4433
//   Informar: CNPJ, PV, e-mail e URL exata deste endpoint.
//   Prazo de ativação: até 2 dias úteis.
//
// URL a cadastrar:
//   https://<seu-dominio>/api/webhooks/erede-pix
//
// A e.Rede envia POST JSON. Deve-se responder com HTTP 200 imediatamente.
// Após receber o webhook, aguardar ~10 minutos antes de consultar a API
// para garantir que a transação esteja consolidada.

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { queryERedeTransaction } from '@/app/(protected)/pedidos/providers/erede-provider';

export const dynamic = 'force-dynamic';

// Eventos suportados pela e.Rede via webhook PIX
const PIX_EVENTS = {
  PAYMENT_APPROVED: 'PV.UPDATE_TRANSACTION_PIX',
  REFUND: 'PV.REFUND_PIX',
} as const;

export async function POST(request: NextRequest) {
  // Responder IMEDIATAMENTE com 200 — a e.Rede exige confirmação rápida
  // O processamento é feito de forma assíncrona via job agendado ou fila
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ received: false, error: 'Invalid JSON' }, { status: 400 });
  }

  // Logar evento recebido (sem dados sensíveis)
  console.info('[e.Rede PIX Webhook] Evento recebido:', {
    events: body?.events,
    transactionId: body?.data?.id,
    companyNumber: body?.companyNumber,
  });

  // Processar em background sem bloquear a resposta
  processPixEvent(body).catch((err) => {
    console.error('[e.Rede PIX Webhook] Erro no processamento:', err.message);
  });

  // Resposta imediata exigida pela e.Rede
  return NextResponse.json({ received: true }, { status: 200 });
}

async function processPixEvent(body: any) {
  const { events, data } = body ?? {};
  const transactionId = data?.id;

  if (!transactionId) {
    console.error('[e.Rede PIX] Webhook sem transaction ID. Body:', JSON.stringify(body));
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = getSupabaseAdmin() as any;

  // Aguardar 10 minutos para garantir consolidação na e.Rede
  // Em produção, prefira enfileirar num job scheduler (BullMQ, Inngest, etc.)
  // ao invés de bloquear o processo com setTimeout
  await delay(10 * 60 * 1000);

  // Consultar a API e.Rede para obter o estado consolidado
  const queryResult = await queryERedeTransaction(transactionId);

  if (!queryResult.success || !queryResult.data) {
    console.error(`[e.Rede PIX] Falha ao consultar transação ${transactionId}:`, queryResult.message);
    return;
  }

  const txData = queryResult.data;
  const returnCode = txData?.returnCode;

  // Verificar qual evento foi recebido
  const eventType = Array.isArray(events) ? events[0] : events;

  if (eventType === PIX_EVENTS.PAYMENT_APPROVED || returnCode === '00') {
    // Pagamento PIX confirmado
    // Localizar a cobrança pelo TID ou referência e atualizar status
    const reference = txData?.reference;

    if (reference) {
      // Buscar cobrança pelo transaction_id ou referência interna
      const { data: cobranca, error } = await supabase
        .from('noro_cobrancas')
        .select('id, pedido_id')
        .or(`transaction_id.eq.${transactionId},transaction_id.eq.${reference}`)
        .maybeSingle();

      if (error) {
        console.error('[e.Rede PIX] Erro ao buscar cobrança:', error.message);
        return;
      }

      if (cobranca) {
        await supabase
          .from('noro_cobrancas')
          .update({
            status: 'PAGO',
            provider_data: txData,
          })
          .eq('id', cobranca.id);

        await supabase
          .from('noro_pedidos')
          .update({
            status: 'PAGO',
            status_pagamento: 'pago',
          })
          .eq('id', cobranca.pedido_id);

        console.info(`[e.Rede PIX] Pedido ${cobranca.pedido_id} marcado como PAGO.`);
      } else {
        console.warn(`[e.Rede PIX] Cobrança não encontrada para TID ${transactionId} / ref ${reference}.`);
      }
    }
  } else if (eventType === PIX_EVENTS.REFUND) {
    // Estorno PIX via canal bancário externo (ex: Bankline Itaú)
    console.info(`[e.Rede PIX] Estorno PIX recebido para transação ${transactionId}.`);

    await supabase
      .from('noro_cobrancas')
      .update({ status: 'ESTORNADO', provider_data: txData })
      .eq('transaction_id', transactionId);
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
