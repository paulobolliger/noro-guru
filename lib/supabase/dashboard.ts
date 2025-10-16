  import { supabaseAdmin } from './admin'; // Corrigido

  export async function getDashboardStats() {
    const [leads, orcamentos, pedidos] = await Promise.all([
      supabaseAdmin.from('nomade_leads').select('*'),
      supabaseAdmin.from('nomade_orcamentos').select('*'),
      supabaseAdmin.from('nomade_pedidos').select('*'),
    ]);

    if (leads.error || orcamentos.error || pedidos.error)
      throw new Error('Erro ao gerar estatísticas do dashboard');

    return {
      totalLeads: leads.data?.length || 0,
      totalOrcamentos: orcamentos.data?.length || 0,
      totalPedidos: pedidos.data?.length || 0,
    };
  }
  
