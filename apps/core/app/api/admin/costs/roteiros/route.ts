// app/api/admin/costs/roteiros/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getCurrentTenantId } from '@/lib/tenant';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const tenantId = await getCurrentTenantId();

    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    // Obter período da query string
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || '30d';

    // Calcular data de início baseado no período
    const daysMap: Record<string, number> = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
      '365d': 365,
      'all': 99999,
    };
    const days = daysMap[period] || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Buscar custos apenas de roteiros
    // Tipos relacionados a roteiros: 'site_roteiro', 'bulk_roteiro'
    const { data: costs, error } = await supabase
      .from('ai_costs')
      .select('*')
      .eq('tenant_id', tenantId)
      .in('type', ['site_roteiro', 'bulk_roteiro'])
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Erro ao buscar custos de roteiros:', error);
      return NextResponse.json({ error: 'Erro ao buscar dados' }, { status: 500 });
    }

    // Processar dados
    const metrics = {
      totalCost: 0,
      totalItems: 0,
      totalTextCost: 0,
      totalImageCost: 0,
      avgCostPerItem: 0,
    };

    const bySource: Record<string, any> = {};
    const dailyData: Record<string, any> = {};

    (costs || []).forEach((cost: any) => {
      metrics.totalCost += cost.total_cost || 0;
      metrics.totalTextCost += cost.text_cost || 0;
      metrics.totalImageCost += cost.image_cost || 0;
      metrics.totalItems += 1;

      // Por origem (site ou bulk)
      const source = cost.type === 'site_roteiro' ? 'Site' : 'Bulk Generation';
      if (!bySource[source]) {
        bySource[source] = {
          count: 0,
          text_cost: 0,
          image_cost: 0,
          total_cost: 0,
        };
      }
      bySource[source].count += 1;
      bySource[source].text_cost += cost.text_cost || 0;
      bySource[source].image_cost += cost.image_cost || 0;
      bySource[source].total_cost += cost.total_cost || 0;

      // Por dia
      const date = new Date(cost.created_at).toISOString().split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = {
          date,
          total_cost: 0,
          count: 0,
        };
      }
      dailyData[date].total_cost += cost.total_cost || 0;
      dailyData[date].count += 1;
    });

    metrics.avgCostPerItem = metrics.totalItems > 0
      ? metrics.totalCost / metrics.totalItems
      : 0;

    const dailyChart = Object.values(dailyData).sort((a: any, b: any) =>
      a.date.localeCompare(b.date)
    );

    return NextResponse.json({
      metrics,
      bySource,
      dailyChart,
    });

  } catch (error) {
    console.error('Erro na API de custos de roteiros:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
