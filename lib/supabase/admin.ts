// lib/supabase/admin.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';

export const supabaseAdmin = createClientComponentClient<Database>();

// =====================================================
// DASHBOARD METRICS
// =====================================================
export async function getDashboardMetrics(periodoDias: number = 30) {
  const { data, error } = await supabaseAdmin
    .rpc('get_dashboard_metrics', { periodo_dias: periodoDias });

  if (error) {
    console.error('Erro ao buscar métricas:', error);
    return null;
  }

  return data;
}

// =====================================================
// LEADS
// =====================================================
export async function getLeads(filters?: {
  status?: string;
  origem?: string;
  limit?: number;
  offset?: number;
}) {
  let query = supabaseAdmin
    .from('nomade_leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.origem) {
    query = query.eq('origem', filters.origem);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao buscar leads:', error);
    return [];
  }

  return data;
}

export async function getLeadById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('nomade_leads')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erro ao buscar lead:', error);
    return null;
  }

  return data;
}

export async function createLead(lead: any) {
  const { data, error } = await supabaseAdmin
    .from('nomade_leads')
    .insert(lead)
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar lead:', error);
    throw error;
  }

  return data;
}

export async function updateLead(id: string, updates: any) {
  const { data, error } = await supabaseAdmin
    .from('nomade_leads')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar lead:', error);
    throw error;
  }

  return data;
}

export async function deleteLead(id: string) {
  const { error } = await supabaseAdmin
    .from('nomade_leads')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao deletar lead:', error);
    throw error;
  }
}

// =====================================================
// INTERAÇÕES
// =====================================================
export async function getInteracoes(leadId: string) {
  const { data, error } = await supabaseAdmin
    .from('nomade_interacoes')
    .select('*')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar interações:', error);
    return [];
  }

  return data;
}

export async function createInteracao(interacao: any) {
  const { data, error } = await supabaseAdmin
    .from('nomade_interacoes')
    .insert(interacao)
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar interação:', error);
    throw error;
  }

  return data;
}

// =====================================================
// ORÇAMENTOS
// =====================================================
export async function getOrcamentos(filters?: {
  status?: string;
  lead_id?: string;
}) {
  let query = supabaseAdmin
    .from('nomade_orcamentos')
    .select('*, nomade_leads(nome, email)')
    .order('created_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.lead_id) {
    query = query.eq('lead_id', filters.lead_id);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao buscar orçamentos:', error);
    return [];
  }

  return data;
}

export async function getOrcamentoById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('nomade_orcamentos')
    .select('*, nomade_leads(nome, email)')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erro ao buscar orçamento:', error);
    return null;
  }

  return data;
}

export async function createOrcamento(orcamento: any) {
  const { data, error } = await supabaseAdmin
    .from('nomade_orcamentos')
    .insert(orcamento)
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar orçamento:', error);
    throw error;
  }

  return data;
}

export async function updateOrcamento(id: string, updates: any) {
  const { data, error } = await supabaseAdmin
    .from('nomade_orcamentos')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar orçamento:', error);
    throw error;
  }

  return data;
}

// =====================================================
// PEDIDOS
// =====================================================
export async function getPedidos(filters?: {
  status?: string;
}) {
  let query = supabaseAdmin
    .from('nomade_pedidos')
    .select('*, nomade_leads(nome, email)')
    .order('created_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao buscar pedidos:', error);
    return [];
  }

  return data;
}

export async function getPedidoById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('nomade_pedidos')
    .select('*, nomade_leads(nome, email)')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erro ao buscar pedido:', error);
    return null;
  }

  return data;
}

export async function createPedido(pedido: any) {
  const { data, error } = await supabaseAdmin
    .from('nomade_pedidos')
    .insert(pedido)
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar pedido:', error);
    throw error;
  }

  return data;
}

export async function updatePedido(id: string, updates: any) {
  const { data, error } = await supabaseAdmin
    .from('nomade_pedidos')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar pedido:', error);
    throw error;
  }

  return data;
}

// =====================================================
// TRANSAÇÕES
// =====================================================
export async function getTransacoes(filters?: {
  tipo?: 'receita' | 'despesa';
  data_inicio?: string;
  data_fim?: string;
  categoria?: string;
}) {
  let query = supabaseAdmin
    .from('nomade_transacoes')
    .select('*')
    .order('data_transacao', { ascending: false });

  if (filters?.tipo) {
    query = query.eq('tipo', filters.tipo);
  }

  if (filters?.categoria) {
    query = query.eq('categoria', filters.categoria);
  }

  if (filters?.data_inicio) {
    query = query.gte('data_transacao', filters.data_inicio);
  }

  if (filters?.data_fim) {
    query = query.lte('data_transacao', filters.data_fim);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao buscar transações:', error);
    return [];
  }

  return data;
}

export async function createTransacao(transacao: any) {
  const { data, error } = await supabaseAdmin
    .from('nomade_transacoes')
    .insert(transacao)
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar transação:', error);
    throw error;
  }

  return data;
}

export async function updateTransacao(id: string, updates: any) {
  const { data, error } = await supabaseAdmin
    .from('nomade_transacoes')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar transação:', error);
    throw error;
  }

  return data;
}

export async function deleteTransacao(id: string) {
  const { error } = await supabaseAdmin
    .from('nomade_transacoes')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao deletar transação:', error);
    throw error;
  }
}

// =====================================================
// TAREFAS
// =====================================================
export async function getTarefas(filters?: {
  status?: string;
  responsavel?: string;
}) {
  let query = supabaseAdmin
    .from('nomade_tarefas')
    .select('*, nomade_leads(nome)')
    .order('data_vencimento', { ascending: true, nullsFirst: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.responsavel) {
    query = query.eq('responsavel', filters.responsavel);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao buscar tarefas:', error);
    return [];
  }

  return data;
}

export async function createTarefa(tarefa: any) {
  const { data, error } = await supabaseAdmin
    .from('nomade_tarefas')
    .insert(tarefa)
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar tarefa:', error);
    throw error;
  }

  return data;
}

export async function updateTarefa(id: string, updates: any) {
  const { data, error } = await supabaseAdmin
    .from('nomade_tarefas')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar tarefa:', error);
    throw error;
  }

  return data;
}

export async function deleteTarefa(id: string) {
  const { error } = await supabaseAdmin
    .from('nomade_tarefas')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Erro ao deletar tarefa:', error);
    throw error;
  }
}

// =====================================================
// NOTIFICAÇÕES
// =====================================================
export async function getNotificacoes(userId: string, limit: number = 10) {
  const { data, error } = await supabaseAdmin
    .from('nomade_notificacoes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Erro ao buscar notificações:', error);
    return [];
  }

  return data;
}

export async function marcarNotificacaoLida(id: string) {
  const { error } = await supabaseAdmin
    .from('nomade_notificacoes')
    .update({ lida: true, lida_em: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('Erro ao marcar notificação como lida:', error);
    throw error;
  }
}

// =====================================================
// NEWSLETTER
// =====================================================
export async function getNewsletterSubscribers(filters?: {
  status?: string;
}) {
  let query = supabaseAdmin
    .from('nomade_newsletter')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao buscar subscribers:', error);
    return [];
  }

  return data;
}

// =====================================================
// USUÁRIOS
// =====================================================
export async function getCurrentUser() {
  const { data: { user } } = await supabaseAdmin.auth.getUser();
  
  if (!user) return null;

  const { data: profile } = await supabaseAdmin
    .from('nomade_users')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile;
}

export async function getUsers() {
  const { data, error } = await supabaseAdmin
    .from('nomade_users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar usuários:', error);
    return [];
  }

  return data;
}