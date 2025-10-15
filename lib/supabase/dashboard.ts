import { getSupabaseAdmin } from './admin';

export async function getDashboardStats() {
  const supabase = getSupabaseAdmin();

  const [leads, orcamentos, pedidos] = await Promise.all([
    supabase.from('nomade_leads').select('*'),
    supabase.from('nomade_orcamentos').select('*'),
    supabase.from('nomade_pedidos').select('*'),
  ]);

  if (leads.error || orcamentos.error || pedidos.error)
    throw new Error('Erro ao gerar estatísticas do dashboard');

  return {
    totalLeads: leads.data?.length || 0,
    totalOrcamentos: orcamentos.data?.length || 0,
    totalPedidos: pedidos.data?.length || 0,
  };
}
