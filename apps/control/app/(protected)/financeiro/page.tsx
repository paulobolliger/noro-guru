import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import SectionHeader from '@/components/layout/SectionHeader';
import { DollarSign, TrendingUp, Building2, Users } from 'lucide-react';
import KpiCard from '@/components/dashboard/KpiCard';
import ChartCard from '@/components/dashboard/ChartCard';
import FinanceiroConsolidadoClient from './FinanceiroConsolidadoClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Dashboard Financeiro Consolidado
 * Mostra métricas financeiras de TODOS os tenants da plataforma
 */
export default async function FinanceiroConsolidadoPage() {
  const supabase = createAdminSupabaseClient();

  // Buscar métricas consolidadas da API
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  let consolidatedData = null;
  try {
    const response = await fetch(`${baseUrl}/api/admin/financeiro/consolidado?periodo=mes_atual`, {
      cache: 'no-store',
    });

    if (response.ok) {
      consolidatedData = await response.json();
    }
  } catch (error) {
    console.error('[Financeiro Dashboard] Error fetching consolidated data:', error);
  }

  // Fallback se a API não retornar dados
  const metricas = consolidatedData?.metricas_consolidadas || {
    total_tenants: 0,
    total_tenants_ativos: 0,
    receitas_total: 0,
    despesas_total: 0,
    lucro_total: 0,
    duplicatas_receber_total: 0,
    duplicatas_pagar_total: 0,
    mrr_estimado: 0,
    arr_estimado: 0,
    margem_lucro: 0,
  };

  const metricasPorTenant = consolidatedData?.metricas_por_tenant || [];
  const topTenants = consolidatedData?.top_tenants_receita || [];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="container-app py-8 space-y-6">
      <SectionHeader
        title="Financeiro Consolidado"
        subtitle="Visão geral das métricas financeiras de todos os tenants da plataforma."
        icon={<DollarSign size={28} />}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-[1400px] mx-auto px-4 md:px-6">
        <KpiCard
          label="Total de Tenants"
          value={metricas.total_tenants_ativos}
          icon={Building2}
          delta={{ value: 0, period: 'último mês' }}
        />

        <KpiCard
          label="MRR (Receita Mensal Recorrente)"
          value={formatCurrency(metricas.mrr_estimado)}
          icon={DollarSign}
          delta={{ value: 0, period: 'último mês' }}
        />

        <KpiCard
          label="ARR (Receita Anual Recorrente)"
          value={formatCurrency(metricas.arr_estimado)}
          icon={TrendingUp}
          delta={{ value: 0, period: 'último ano' }}
        />

        <KpiCard
          label="Margem de Lucro"
          value={formatPercentage(metricas.margem_lucro)}
          icon={TrendingUp}
          delta={{ value: metricas.margem_lucro, period: 'média' }}
        />
      </div>

      {/* Métricas Detalhadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-[1400px] mx-auto px-4 md:px-6">
        <div className="bg-gray-50 dark:bg-[#1a1625] border-2 border-emerald-400 rounded-xl p-5 shadow-md">
          <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
            Receitas Total
          </div>
          <div className="text-2xl md:text-3xl font-bold text-emerald-400">
            {formatCurrency(metricas.receitas_total)}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-[#1a1625] border-2 border-orange-400 rounded-xl p-5 shadow-md">
          <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
            Despesas Total
          </div>
          <div className="text-2xl md:text-3xl font-bold text-orange-400">
            {formatCurrency(metricas.despesas_total)}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-[#1a1625] border-2 border-[#4aede5] rounded-xl p-5 shadow-md">
          <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
            Lucro Total
          </div>
          <div className={`text-2xl md:text-3xl font-bold ${metricas.lucro_total >= 0 ? 'text-[#4aede5]' : 'text-red-400'}`}>
            {formatCurrency(metricas.lucro_total)}
          </div>
        </div>
      </div>

      {/* Top 5 Tenants por Receita */}
      {topTenants.length > 0 && (
        <div className="max-w-[1400px] mx-auto px-4 md:px-6">
          <ChartCard title="Top 5 Tenants por Receita" subtitle="Maiores geradores de receita da plataforma">
            <div className="space-y-3 p-4">
              {topTenants.map((tenant: any, index: number) => (
                <div
                  key={tenant.tenant_slug}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#1a1625] rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#4aede5]/20 flex items-center justify-center font-bold text-[#4aede5]">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-gray-100">
                        {tenant.tenant_name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {tenant.tenant_slug}.noro.guru
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-emerald-500">
                      {formatCurrency(tenant.receitas)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Lucro: {formatCurrency(tenant.lucro)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      )}

      {/* Tabela Detalhada com Client Component */}
      <FinanceiroConsolidadoClient
        metricasPorTenant={metricasPorTenant}
        periodo={consolidatedData?.periodo || { tipo: 'mes_atual', data_inicio: '', data_fim: '' }}
      />
    </div>
  );
}
