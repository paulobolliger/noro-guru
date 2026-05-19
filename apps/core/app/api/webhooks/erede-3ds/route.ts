// app/api/webhooks/erede-3ds/route.ts
//
// Endpoint de postback 3DS 2.0 da e.Rede.
//
// Após o cliente completar o desafio de autenticação no ambiente do banco emissor,
// a e.Rede envia um HTTP POST com application/x-www-form-urlencoded contendo
// os dados da transação finalizada.
//
// Parâmetros esperados no postback:
//   reference         — Código interno do pedido (gerado pelo lojista)
//   tid               — ID único da transação na e.Rede
//   nsu               — Número Sequencial Único para conciliação
//   authorizationCode — Código de autorização da bandeira/emissor
//   date              — Data da transação (yyyyMMdd)
//   time              — Hora da transação (HH:mm:ss)
//   returncode        — Código de resultado final ("00" = aprovado)
//
// URL a configurar no payload de criação da transação 3DS:
//   https://<seu-dominio>/api/webhooks/erede-3ds

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  let params: URLSearchParams;

  try {
    // e.Rede envia como application/x-www-form-urlencoded
    const body = await request.text();
    params = new URLSearchParams(body);
  } catch {
    return NextResponse.json({ error: 'Invalid postback body' }, { status: 400 });
  }

  const reference = params.get('reference') ?? '';
  const tid = params.get('tid') ?? '';
  const nsu = params.get('nsu') ?? '';
  const authorizationCode = params.get('authorizationCode') ?? '';
  const returncode = params.get('returncode') ?? '';
  const date = params.get('date') ?? '';
  const time = params.get('time') ?? '';

  console.info('[e.Rede 3DS Postback] Recebido:', {
    reference,
    tid,
    returncode,
    date,
    time,
  });

  if (!tid && !reference) {
    console.error('[e.Rede 3DS] Postback sem TID e sem reference.');
    return NextResponse.redirect(new URL('/pedidos?payment=error&reason=invalid_postback', request.url));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = getSupabaseAdmin() as any;
  const approved = returncode === '00';

  // Localizar a cobrança pelo TID ou referência
  const { data: cobranca } = await supabase
    .from('noro_cobrancas')
    .select('id, pedido_id')
    .or([
      tid ? `transaction_id.eq.${tid}` : null,
      reference ? `transaction_id.eq.${reference}` : null,
    ]
      .filter(Boolean)
      .join(','))
    .maybeSingle();

  if (cobranca) {
    const providerData = { tid, nsu, authorizationCode, returncode, date, time };

    await supabase
      .from('noro_cobrancas')
      .update({
        status: approved ? 'PAGO' : 'RECUSADO',
        transaction_id: tid || cobranca.id,
        provider_data: providerData,
      })
      .eq('id', cobranca.id);

    if (approved) {
      await supabase
        .from('noro_pedidos')
        .update({ status: 'PAGO', status_pagamento: 'pago' })
        .eq('id', cobranca.pedido_id);
    }

    const pedidoId = cobranca.pedido_id;
    const redirectPath = approved
      ? `/pedidos/${pedidoId}?payment=success&tid=${tid}`
      : `/pedidos/${pedidoId}?payment=declined&code=${returncode}`;

    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // Cobrança não encontrada — redireciona para listagem de pedidos
  console.warn(`[e.Rede 3DS] Cobrança não encontrada para TID=${tid} / ref=${reference}.`);
  return NextResponse.redirect(
    new URL(`/pedidos?payment=${approved ? 'success' : 'error'}&tid=${tid}`, request.url)
  );
}
