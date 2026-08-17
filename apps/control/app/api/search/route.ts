import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getServerSession, getSessionClaims } from '@/lib/session';
import { createDatabaseClient } from '@noro/db';

export const dynamic = 'force-dynamic';

interface SearchResult {
  id: string;
  type: 'lead' | 'cliente' | 'pedido' | 'orcamento';
  title: string;
  subtitle: string;
  href: string;
  metadata?: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  
  if (query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  // Verificar autenticação via Logto
  const ctx = await getServerSession().then(s => ({ isAuthenticated: Boolean(s?.claims?.sub), claims: s?.claims }));
  const userId = ctx.claims?.sub;
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const activeTenantId = cookies().get('active_tenant_id')?.value;
  if (!activeTenantId) {
    return NextResponse.json({ results: [] });
  }

  const results: SearchResult[] = [];
  const { client, close } = createDatabaseClient();

  try {
    const term = `%${query}%`;

    // Buscar Leads
    const leads = await client`
      SELECT id, organization_name, email, source, stage
      FROM platform_crm.leads
      WHERE tenant_id = ${activeTenantId}
        AND (organization_name ILIKE ${term} OR email ILIKE ${term} OR source ILIKE ${term})
      LIMIT 5
    `;

    if (leads && leads.length > 0) {
      results.push(...leads.map((lead: any) => ({
        id: lead.id,
        type: 'lead' as const,
        title: lead.organization_name || 'Lead sem nome',
        subtitle: lead.email || lead.source || '',
        href: `/control/leads?id=${lead.id}`,
        metadata: lead.stage || 'novo'
      })));
    }

    // Buscar Clientes
    const clientes = await client`
      SELECT id, nome, email, tipo
      FROM crm.clients
      WHERE tenant_id = ${activeTenantId}
        AND deleted_at IS NULL
        AND (nome ILIKE ${term} OR email ILIKE ${term})
      LIMIT 5
    `;

    if (clientes && clientes.length > 0) {
      results.push(...clientes.map((cliente: any) => ({
        id: cliente.id,
        type: 'cliente' as const,
        title: cliente.nome || 'Cliente sem nome',
        subtitle: cliente.email || '',
        href: `/control/orgs/${cliente.id}`,
        metadata: cliente.tipo || 'pessoa_fisica'
      })));
    }

    // Buscar Pedidos
    const pedidos = await client`
      SELECT id, titulo, valor_total, status
      FROM sales.orders
      WHERE tenant_id = ${activeTenantId}
        AND deleted_at IS NULL
        AND (titulo ILIKE ${term})
      LIMIT 5
    `;

    if (pedidos && pedidos.length > 0) {
      results.push(...pedidos.map((pedido: any) => ({
        id: pedido.id,
        type: 'pedido' as const,
        title: pedido.titulo || `Pedido ${pedido.id.substring(0, 8)}`,
        subtitle: pedido.valor_total 
          ? `R$ ${Number(pedido.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
          : '',
        href: `/control/pedidos/${pedido.id}`,
        metadata: pedido.status || 'rascunho'
      })));
    }

    // Buscar Orçamentos
    const orcamentos = await client`
      SELECT id, titulo, valor_total, status
      FROM sales.proposals
      WHERE tenant_id = ${activeTenantId}
        AND deleted_at IS NULL
        AND (titulo ILIKE ${term})
      LIMIT 5
    `;

    if (orcamentos && orcamentos.length > 0) {
      results.push(...orcamentos.map((orcamento: any) => ({
        id: orcamento.id,
        type: 'orcamento' as const,
        title: orcamento.titulo || `Orçamento ${orcamento.id.substring(0, 8)}`,
        subtitle: orcamento.valor_total
          ? `R$ ${Number(orcamento.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
          : '',
        href: `/control/orcamentos/${orcamento.id}`,
        metadata: orcamento.status || 'rascunho'
      })));
    }

    return NextResponse.json({ 
      results: results.slice(0, 10), // Limitar a 10 resultados totais
      query 
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar', results: [] },
      { status: 500 }
    );
  } finally {
    await close();
  }
}
