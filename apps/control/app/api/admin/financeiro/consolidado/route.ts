// app/api/admin/financeiro/consolidado/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/admin';

/**
 * GET /api/admin/financeiro/consolidado
 * Retorna métricas financeiras consolidadas de TODOS os tenants
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminSupabaseClient();
    const url = new URL(request.url);

    // Parâmetros opcionais
    const periodo = url.searchParams.get('periodo') || 'mes_atual'; // mes_atual, ano_atual, ultimos_12_meses
    const tenant_id = url.searchParams.get('tenant_id'); // Filtro opcional por tenant específico

    const hoje = new Date();
    let dataInicio: Date;
    let dataFim: Date = hoje;

    // Definir período
    switch (periodo) {
      case 'mes_atual':
        dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        dataFim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
        break;
      case 'ano_atual':
        dataInicio = new Date(hoje.getFullYear(), 0, 1);
        dataFim = new Date(hoje.getFullYear(), 11, 31);
        break;
      case 'ultimos_12_meses':
        dataInicio = new Date(hoje.getFullYear() - 1, hoje.getMonth(), 1);
        break;
      default:
        dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    }

    const dataInicioISO = dataInicio.toISOString();
    const dataFimISO = dataFim.toISOString();

    // 1. Buscar todos os tenants ativos
    let tenantsQuery = supabase
      .schema('cp')
      .from('tenants')
      .select('id, name, slug, plan, status, created_at')
      .eq('status', 'active');

    if (tenant_id) {
      tenantsQuery = tenantsQuery.eq('id', tenant_id);
    }

    const { data: tenants, error: tenantsError } = await tenantsQuery;

    if (tenantsError) {
      console.error('[Financeiro Consolidado] Error fetching tenants:', tenantsError);
      return NextResponse.json(
        { error: 'Erro ao buscar tenants' },
        { status: 500 }
      );
    }

    // 2. Para cada tenant, buscar métricas financeiras
    const metricasPorTenant = await Promise.all(
      (tenants || []).map(async (tenant) => {
        const schemaName = `tenant_${tenant.slug}`;

        // Verificar se schema existe
        const { data: schemaExists } = await supabase
          .rpc('schema_exists', { p_schema_name: schemaName })
          .single()
          .catch(() => ({ data: false }));

        if (!schemaExists) {
          return {
            tenant_id: tenant.id,
            tenant_name: tenant.name,
            tenant_slug: tenant.slug,
            schema_provisionado: false,
            receitas_total: 0,
            despesas_total: 0,
            lucro: 0,
            margem_lucro: 0,
            duplicatas_receber_pendentes: 0,
            duplicatas_pagar_pendentes: 0,
          };
        }

        try {
          // Buscar receitas (aproximado - não temos acesso direto ao schema do tenant via admin)
          // NOTA: Isso só funcionará se as tabelas financeiras estiverem no schema `public`
          // ou se tivermos views/funções RPC que consolidam os dados

          // Por enquanto, retornar dados mockados
          // TODO: Implementar funções RPC que retornem métricas de cada tenant

          return {
            tenant_id: tenant.id,
            tenant_name: tenant.name,
            tenant_slug: tenant.slug,
            schema_provisionado: true,
            receitas_total: 0, // TODO: RPC para buscar do schema do tenant
            despesas_total: 0, // TODO: RPC para buscar do schema do tenant
            lucro: 0,
            margem_lucro: 0,
            duplicatas_receber_pendentes: 0,
            duplicatas_pagar_pendentes: 0,
          };
        } catch (err) {
          console.error(`[Financeiro] Error fetching metrics for tenant ${tenant.slug}:`, err);
          return {
            tenant_id: tenant.id,
            tenant_name: tenant.name,
            tenant_slug: tenant.slug,
            schema_provisionado: true,
            error: 'Erro ao buscar métricas',
            receitas_total: 0,
            despesas_total: 0,
            lucro: 0,
            margem_lucro: 0,
            duplicatas_receber_pendentes: 0,
            duplicatas_pagar_pendentes: 0,
          };
        }
      })
    );

    // 3. Calcular totais consolidados
    const metricas_consolidadas = {
      total_tenants: tenants?.length || 0,
      total_tenants_ativos: tenants?.filter(t => t.status === 'active').length || 0,

      receitas_total: metricasPorTenant.reduce((acc, m) => acc + (m.receitas_total || 0), 0),
      despesas_total: metricasPorTenant.reduce((acc, m) => acc + (m.despesas_total || 0), 0),
      lucro_total: metricasPorTenant.reduce((acc, m) => acc + (m.lucro || 0), 0),

      duplicatas_receber_total: metricasPorTenant.reduce((acc, m) => acc + (m.duplicatas_receber_pendentes || 0), 0),
      duplicatas_pagar_total: metricasPorTenant.reduce((acc, m) => acc + (m.duplicatas_pagar_pendentes || 0), 0),

      // MRR estimado (assumindo que receitas são mensais)
      mrr_estimado: metricasPorTenant.reduce((acc, m) => acc + (m.receitas_total || 0), 0),

      // ARR = MRR * 12
      arr_estimado: metricasPorTenant.reduce((acc, m) => acc + (m.receitas_total || 0), 0) * 12,
    };

    // Calcular margem de lucro consolidada
    if (metricas_consolidadas.receitas_total > 0) {
      metricas_consolidadas.margem_lucro =
        (metricas_consolidadas.lucro_total / metricas_consolidadas.receitas_total) * 100;
    } else {
      metricas_consolidadas.margem_lucro = 0;
    }

    // 4. Top 5 tenants por receita
    const top_tenants_receita = metricasPorTenant
      .sort((a, b) => (b.receitas_total || 0) - (a.receitas_total || 0))
      .slice(0, 5)
      .map(m => ({
        tenant_name: m.tenant_name,
        tenant_slug: m.tenant_slug,
        receitas: m.receitas_total,
        lucro: m.lucro,
      }));

    return NextResponse.json({
      periodo: {
        tipo: periodo,
        data_inicio: dataInicioISO,
        data_fim: dataFimISO,
      },
      metricas_consolidadas,
      metricas_por_tenant: metricasPorTenant,
      top_tenants_receita,
    });

  } catch (error: any) {
    console.error('[Financeiro Consolidado] Error:', error);
    return NextResponse.json(
      {
        error: 'Erro ao buscar métricas consolidadas',
        message: error.message
      },
      { status: 500 }
    );
  }
}
