'use server';

import { createServerSupabaseClient } from "@lib/supabase/server";

// Busca dados reais para o Histórico do Cliente (orçamentos, pedidos, cobranças)
export async function getClienteHistorico(clienteId: string) {
  const supabase = createServerSupabaseClient();

  try {
    const { data: orcamentos, error: orcErr } = await supabase
      .from('noro_orcamentos')
      .select('id, titulo, valor_total, status, created_at')
      .eq('lead_id', clienteId)
      .order('created_at', { ascending: false });
    if (orcErr) throw orcErr;

    const { data: pedidos, error: pedErr } = await supabase
      .from('pedidos' as any)
      .select('id, valor_total, status, created_at')
      .eq('cliente_id', clienteId)
      .order('created_at', { ascending: false });
    if (pedErr) throw pedErr;

    const { data: cobrancas, error: cobErr } = await supabase
      .from('cobrancas' as any)
      .select('id, valor, status, created_at, pedido_id')
      .eq('cliente_id', clienteId)
      .order('created_at', { ascending: false });
    if (cobErr) throw cobErr;

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
  }
}

// Monta eventos da Timeline a partir de orçamentos, pedidos e cobranças
export async function getClienteTimeline(clienteId: string) {
  const supabase = createServerSupabaseClient();

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

    const { data: orcamentos } = await supabase
      .from('noro_orcamentos')
      .select('id, titulo, created_at, status, valor_total')
      .eq('lead_id', clienteId)
      .order('created_at', { ascending: false });
    (orcamentos || []).forEach((o: any) => {
      events.push({
        id: `orc-${o.id}`,
        tipo: 'orcamento',
        titulo: 'Orçamento criado',
        descricao: o.titulo ? `${o.titulo} • Status: ${o.status}` : `Status: ${o.status}`,
        data: o.created_at,
      });
    });

    const { data: pedidos } = await supabase
      .from('pedidos' as any)
      .select('id, created_at, status, valor_total')
      .eq('cliente_id', clienteId)
      .order('created_at', { ascending: false });
    (pedidos || []).forEach((p: any) => {
      events.push({
        id: `ped-${p.id}`,
        tipo: 'pedido',
        titulo: 'Pedido criado',
        descricao: `Status: ${p.status}`,
        data: p.created_at,
      });
    });

    const { data: cobrancas } = await supabase
      .from('cobrancas' as any)
      .select('id, created_at, status, valor, pedido_id')
      .eq('cliente_id', clienteId)
      .order('created_at', { ascending: false });
    (cobrancas || []).forEach((c: any) => {
      events.push({
        id: `cob-${c.id}`,
        tipo: 'pagamento',
        titulo: 'Cobrança registrada',
        descricao: `Status: ${c.status}`,
        data: c.created_at,
        pedidoId: c.pedido_id || undefined,
      });
    });

    events.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
    return { success: true, data: events };
  } catch (error: any) {
    console.error('Erro ao montar timeline do cliente:', error);
    return { success: false, error: error.message };
  }
}
