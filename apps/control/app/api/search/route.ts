// app/api/search/route.ts
// API de busca global com suporte multi-tenant via RLS

import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@lib/supabase/server';

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

  const supabase = createServerSupabaseClient();
  
  // Verificar autenticação
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results: SearchResult[] = [];
  const searchLower = query.toLowerCase();

  try {
    // Buscar Leads (RLS filtra automaticamente por tenant)
    const { data: leads } = await supabase
      .from('noro_leads')
      .select('id, nome, email, empresa, status')
      .or(`nome.ilike.%${query}%,email.ilike.%${query}%,empresa.ilike.%${query}%`)
      .limit(5);

    if (leads) {
      results.push(...leads.map(lead => ({
        id: lead.id,
        type: 'lead' as const,
        title: lead.nome || 'Lead sem nome',
        subtitle: lead.email || lead.empresa || '',
        href: `/control/leads?id=${lead.id}`,
        metadata: lead.status || 'novo'
      })));
    }

    // Buscar Clientes (RLS filtra automaticamente)
    const { data: clientes } = await supabase
      .from('noro_clientes')
      .select('id, nome, email, tipo')
      .or(`nome.ilike.%${query}%,email.ilike.%${query}%`)
      .limit(5);

    if (clientes) {
      results.push(...clientes.map(cliente => ({
        id: cliente.id,
        type: 'cliente' as const,
        title: cliente.nome || 'Cliente sem nome',
        subtitle: cliente.email || '',
        href: `/control/orgs/${cliente.id}`,
        metadata: cliente.tipo || 'pessoa_fisica'
      })));
    }

    // Buscar Pedidos (RLS filtra automaticamente)
    const { data: pedidos } = await supabase
      .from('noro_pedidos')
      .select('id, titulo, valor_total, status')
      .ilike('titulo', `%${query}%`)
      .limit(5);

    if (pedidos) {
      results.push(...pedidos.map(pedido => ({
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

    // Buscar Orçamentos (RLS filtra automaticamente)
    const { data: orcamentos } = await supabase
      .from('noro_orcamentos')
      .select('id, titulo, valor_total, status')
      .ilike('titulo', `%${query}%`)
      .limit(5);

    if (orcamentos) {
      results.push(...orcamentos.map(orcamento => ({
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
  }
}
