// lib/supabase/admin.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';
let supabaseAdmin: SupabaseClient<any> | null = null;

/**
 * Retorna uma instÃ¢ncia singleton do cliente Supabase com privilÃ©gios de administrador.
 * As variÃ¡veis de ambiente sÃ£o verificadas apenas na primeira chamada.
 */
function getSupabaseAdmin() {
  if (supabaseAdmin) {
    return supabaseAdmin;
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.error("ERRO CRÃTICO: VariÃ¡veis de ambiente do Supabase para o servidor nÃ£o foram carregadas.");
    console.error("Verifique se SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY estÃ£o no seu arquivo .env.local e reinicie o servidor.");
    throw new Error('As chaves do Supabase Admin para o servidor nÃ£o estÃ£o definidas.');
  }

  supabaseAdmin = createClient<any>(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  return supabaseAdmin;
}

export async function getDashboardMetrics(periodo_dias: number) {
  const adminClient = getSupabaseAdmin();
  const { data, error } = await adminClient.rpc('get_dashboard_metrics', { periodo_dias });
  
  if (error) {
    console.error('Erro ao buscar mÃ©tricas do dashboard:', error);
    return {
      leads_ativos: 0, leads_novos_periodo: 0, pedidos_ativos: 0,
      receita_periodo: 0, taxa_conversao: 0, tarefas_pendentes: 0,
    } as any;
  }
  return data as any;
}

export async function addLead(lead: any) {
  const adminClient = getSupabaseAdmin();
  const { data, error } = await adminClient
    .from('noro_leads')
    .insert(lead)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getNotificacoes(userId: string, limit: number) {
  const adminClient = getSupabaseAdmin();
  const { data, error } = await adminClient
    .from('noro_notificacoes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export { getSupabaseAdmin };



