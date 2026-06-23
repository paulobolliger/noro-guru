// app/admin/(protected)/clientes/[id]/historico-actions.ts
'use server';

import { createDatabaseClient } from '@noro/db';

// Busca dados reais para o Histórico do Cliente (orçamentos, pedidos, cobranças)
export async function getClienteHistorico(clienteId: string) {
  const { client, close } = createDatabaseClient();

  try {
    const orcamentos = await client`
      SELECT id, titulo, valor_total, status, created_at
      FROM sales.proposals
      WHERE lead_id = ${clienteId} OR cliente_id = ${clienteId}
      ORDER BY created_at DESC
    `;

    const pedidos = await client`
      SELECT id, valor_total, status, created_at
      FROM sales.orders
      WHERE cliente_id = ${clienteId}
      ORDER BY created_at DESC
    `;

    const cobrancas = await client`
      SELECT 
        pc.id, 
        pc.amount_cents::numeric / 100 as valor, 
        pc.status, 
        pc.created_at, 
        pc.proposal_id as pedido_id
      FROM noro.payment_charges pc
      JOIN noro.payment_customers pcus ON pcus.id = pc.payment_customer_id
      WHERE pcus.client_id = ${clienteId}
      ORDER BY pc.created_at DESC
    `;

    return {
      success: true,
      data: {
        orcamentos: orcamentos || [],
        pedidos: pedidos || [],
        transacoes: cobrancas || [],
      },
    };
  } catch (error: any) {
    console.error('Erro ao buscar histórico do cliente:', error);
    return { success: false, error: error.message };
  } finally {
    await close();
  }
}

// Monta eventos da Timeline a partir de orçamentos, pedidos e cobranças
export async function getClienteTimeline(clienteId: string) {
  const { client, close } = createDatabaseClient();

  try {
    const events: Array<{
      id: string;
      tipo: 'email' | 'whatsapp' | 'ligacao' | 'nota' | 'orcamento' | 'pedido' | 'pagamento';
      titulo: string;
      descricao?: string;
      data: string;
      usuario?: string;
      pedidoId?: string;
    }> = [];

    const orcamentos = await client`
      SELECT id, titulo, created_at, status, valor_total
      FROM sales.proposals
      WHERE lead_id = ${clienteId} OR cliente_id = ${clienteId}
      ORDER BY created_at DESC
    `;
    (orcamentos || []).forEach((o: any) => {
      events.push({
        id: `orc-${o.id}`,
        tipo: 'orcamento',
        titulo: 'Orçamento criado',
        descricao: o.titulo ? `${o.titulo} • Status: ${o.status}` : `Status: ${o.status}`,
        data: o.created_at instanceof Date ? o.created_at.toISOString() : String(o.created_at),
      });
    });

    const pedidos = await client`
      SELECT id, created_at, status, valor_total
      FROM sales.orders
      WHERE cliente_id = ${clienteId}
      ORDER BY created_at DESC
    `;
    (pedidos || []).forEach((p: any) => {
      events.push({
        id: `ped-${p.id}`,
        tipo: 'pedido',
        titulo: 'Pedido criado',
        descricao: `Status: ${p.status}`,
        data: p.created_at instanceof Date ? p.created_at.toISOString() : String(p.created_at),
      });
    });

    const cobrancas = await client`
      SELECT 
        pc.id, 
        pc.created_at, 
        pc.status, 
        pc.amount_cents::numeric / 100 as valor, 
        pc.proposal_id as pedido_id
      FROM noro.payment_charges pc
      JOIN noro.payment_customers pcus ON pcus.id = pc.payment_customer_id
      WHERE pcus.client_id = ${clienteId}
      ORDER BY pc.created_at DESC
    `;
    (cobrancas || []).forEach((c: any) => {
      events.push({
        id: `cob-${c.id}`,
        tipo: 'pagamento',
        titulo: 'Cobrança registrada',
        descricao: `Status: ${c.status}`,
        data: c.created_at instanceof Date ? c.created_at.toISOString() : String(c.created_at),
        pedidoId: c.pedido_id || undefined,
      });
    });

    events.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
    return { success: true, data: events };
  } catch (error: any) {
    console.error('Erro ao montar timeline do cliente:', error);
    return { success: false, error: error.message };
  } finally {
    await close();
  }
}
