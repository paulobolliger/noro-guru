// lib/supabase/admin.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type Database from '@/types/supabase';

let supabaseAdmin: SupabaseClient<Database> | null = null;

/**
 * Retorna uma instância singleton do cliente Supabase com privilégios de administrador.
 * As variáveis de ambiente são verificadas apenas na primeira chamada.
 */
function getSupabaseAdmin() {
  if (supabaseAdmin) {
    return supabaseAdmin;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error("ERRO CRÍTICO: Variáveis de ambiente do Supabase para o servidor não foram carregadas.");
    console.error("Verifique se SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY estão no seu arquivo .env.local e reinicie o servidor.");
    throw new Error('As chaves do Supabase Admin para o servidor não estão definidas.');
  }

  supabaseAdmin = createClient<Database>(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  return supabaseAdmin;
}

// Funções de dados refatoradas para usar getSupabaseAdmin()
export async function getDashboardMetrics(periodo_dias: number) {
  const adminClient = getSupabaseAdmin();
  const { data, error } = await adminClient.rpc('get_dashboard_metrics', { periodo_dias });
  
  if (error) {
    console.error('Erro ao buscar métricas do dashboard:', error);
    return {
      leads_ativos: 0, leads_novos_periodo: 0, pedidos_ativos: 0,
      receita_periodo: 0, taxa_conversao: 0, tarefas_pendentes: 0,
    };
  }
  return data;
}

export async function getLeads(options: { limit?: number } = {}) {
  const adminClient = getSupabaseAdmin();
  const { limit = 20 } = options;
  const { data, error } = await adminClient
    .from('nomade_leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export async function getTarefas(options: { status?: string; responsavel?: string; limit?: number } = {}) {
  const adminClient = getSupabaseAdmin();
  const { status, responsavel, limit = 20 } = options;

  let query = adminClient
    .from('nomade_tarefas')
    .select('*, nomade_leads(nome)')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (status) query = query.eq('status', status);
  if (responsavel) query = query.eq('responsavel', responsavel);

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

type LeadInsert = Database['public']['Tables']['nomade_leads']['Insert'];
export async function addLead(lead: LeadInsert) {
  const adminClient = getSupabaseAdmin();
  const { data, error } = await adminClient
    .from('nomade_leads')
    .insert(lead)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getNotificacoes(userId: string, limit: number) {
  const adminClient = getSupabaseAdmin();
  const { data, error } = await adminClient
    .from('nomade_notificacoes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

// Exporta a função para que outros módulos possam usá-la
export { getSupabaseAdmin };

