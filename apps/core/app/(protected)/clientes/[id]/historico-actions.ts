'use server';

import { createDatabaseClient } from '@noro/db';
import { requireUser, keycloakSessionAdapter } from '@noro/auth';
import { getServerSession, getSessionClaims } from '@/lib/session';

// ============================================================================
// HELPER: RESOLVE TENANT ID FROM SESSION
// ============================================================================

async function resolveTenant(client: any): Promise<string> {
  const userCtx = await requireUser({
    db: client as any,
    sessionAdapter: keycloakSessionAdapter(getServerSession),
  });

  const memberships = await client`
    SELECT tenant_id 
    FROM noro.tenant_memberships 
    WHERE user_id = ${userCtx.user.id} 
    LIMIT 1
  `;

  if (!memberships || memberships.length === 0) {
    throw new Error('Usuário não associado a nenhuma agência/tenant.');
  }

  return memberships[0].tenant_id;
}

// ============================================================================
// HISTÓRICO DO CLIENTE
// ============================================================================

export async function getClienteHistorico(clienteId: string) {
  const { client, close } = createDatabaseClient();

  try {
    const tenantId = await resolveTenant(client);

    // Buscar propostas/orçamentos do tenant vinculados ao cliente
    const orcamentos = await client`
      SELECT id, titulo, total_cents::numeric / 100 as valor_total, status, created_at
      FROM noro.proposals
      WHERE (lead_id = ${clienteId} OR client_id = ${clienteId}) AND tenant_id = ${tenantId}
      ORDER BY created_at DESC
    `;

    // Buscar pedidos/reservas do tenant vinculados ao cliente
    const pedidos = await client`
      SELECT id, reference as codigo, status, created_at, 0 as valor_total
      FROM noro.bookings
      WHERE client_id = ${clienteId} AND tenant_id = ${tenantId}
      ORDER BY created_at DESC
    `;

    // Buscar cobranças do tenant vinculadas ao cliente
    const cobrancas = await client`
      SELECT 
        pc.id, 
        pc.amount_cents::numeric / 100 as valor, 
        pc.status, 
        pc.created_at, 
        pc.proposal_id as pedido_id
      FROM noro.payment_charges pc
      JOIN noro.payment_customers pcus ON pcus.id = pc.payment_customer_id
      WHERE pcus.client_id = ${clienteId} AND pc.tenant_id = ${tenantId}
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

// ============================================================================
// TIMELINE DO CLIENTE
// ============================================================================

export async function getClienteTimeline(clienteId: string) {
  const { client, close } = createDatabaseClient();

  try {
    const tenantId = await resolveTenant(client);

    const events: Array<{
      id: string;
      tipo: 'email' | 'whatsapp' | 'ligacao' | 'nota' | 'orcamento' | 'pedido' | 'pagamento';
      titulo: string;
      descricao?: string;
      data: string;
      usuario?: string;
      pedidoId?: string;
    }> = [];

    // 1. Orçamentos
    const orcamentos = await client`
      SELECT id, titulo, created_at, status, total_cents::numeric / 100 as valor_total
      FROM noro.proposals
      WHERE (lead_id = ${clienteId} OR client_id = ${clienteId}) AND tenant_id = ${tenantId}
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

    // 2. Pedidos/Reservas
    const pedidos = await client`
      SELECT id, reference, created_at, status
      FROM noro.bookings
      WHERE client_id = ${clienteId} AND tenant_id = ${tenantId}
      ORDER BY created_at DESC
    `;
    (pedidos || []).forEach((p: any) => {
      events.push({
        id: `ped-${p.id}`,
        tipo: 'pedido',
        titulo: 'Reserva criada',
        descricao: `Ref: ${p.reference} • Status: ${p.status}`,
        data: p.created_at instanceof Date ? p.created_at.toISOString() : String(p.created_at),
      });
    });

    // 3. Cobranças
    const cobrancas = await client`
      SELECT 
        pc.id, 
        pc.created_at, 
        pc.status, 
        pc.amount_cents::numeric / 100 as valor, 
        pc.proposal_id as pedido_id
      FROM noro.payment_charges pc
      JOIN noro.payment_customers pcus ON pcus.id = pc.payment_customer_id
      WHERE pcus.client_id = ${clienteId} AND pc.tenant_id = ${tenantId}
      ORDER BY pc.created_at DESC
    `;
    (cobrancas || []).forEach((c: any) => {
      events.push({
        id: `cob-${c.id}`,
        tipo: 'pagamento',
        titulo: 'Cobrança registrada',
        descricao: `Valor: R$ ${Number(c.valor).toFixed(2)} • Status: ${c.status}`,
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
