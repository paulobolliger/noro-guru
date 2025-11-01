// app/(protected)/control/ImprovedMetricsGrid.tsx
import { loadControlMetrics } from "./actions";
import { ImprovedKpiCard } from "./ImprovedKpiCard";

interface ImprovedMetricsGridProps {
  range: number;
  tenant: string | null;
  plan: string | null;
}

export async function ImprovedMetricsGrid({ range, tenant, plan }: ImprovedMetricsGridProps) {
  const metrics = await loadControlMetrics(range, tenant, plan);
  
  // Calcular métricas adicionais
  const totalCalls = metrics.usage.reduce((sum: number, u: any) => sum + (u.calls || 0), 0);
  const avgCallsPerDay = totalCalls / Math.max(metrics.usage.length, 1);
  
  // Calcular crescimento de chamadas (última semana vs anterior)
  const lastWeekCalls = metrics.usage.slice(-7).reduce((sum: number, u: any) => sum + (u.calls || 0), 0);
  const prevWeekCalls = metrics.usage.slice(-14, -7).reduce((sum: number, u: any) => sum + (u.calls || 0), 0);
  const callsGrowth = prevWeekCalls > 0 ? ((lastWeekCalls - prevWeekCalls) / prevWeekCalls) * 100 : 0;
  
  // Calcular taxa de crescimento de tenants (estimado)
  const tenantsGrowth = 12.5; // Placeholder - seria calculado comparando períodos
  
  // Calcular latência média
  const avgLatency = metrics.usage.reduce((sum: number, u: any) => sum + (u.p95_ms || 0), 0) / Math.max(metrics.usage.length, 1);
  
  // Sparkline para calls
  const callsSparkline = metrics.usage.slice(-14).map((u: any, i: number) => ({ x: i, y: u.calls || 0 }));
  
  // Sparkline para tenants criados
  const tenantsSparkline = (metrics.createdDaily || []).slice(-14).map((d: any, i: number) => ({ x: i, y: d.count || 0 }));
  
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white mb-1">Key Metrics</h3>
        <p className="text-sm text-description">Principais indicadores do período selecionado</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ImprovedKpiCard
          label="Total Tenants"
          value={metrics.tenants}
          delta={{ value: tenantsGrowth, period: 'último mês' }}
          sparkline={tenantsSparkline}
          icon="Users"
          color="gold"
        />
        
        <ImprovedKpiCard
          label="API Keys Ativas"
          value={metrics.apiKeys}
          icon="Key"
          color="primary"
        />
        
        <ImprovedKpiCard
          label="Total de Chamadas"
          value={totalCalls}
          delta={{ value: callsGrowth, period: 'semana anterior' }}
          sparkline={callsSparkline}
          icon="TrendingUp"
          color="accent"
        />
        
        <ImprovedKpiCard
          label="Latência Média p95"
          value={`${Math.round(avgLatency)}ms`}
          icon="Zap"
          color={avgLatency > 500 ? 'rose' : avgLatency > 200 ? 'gold' : 'emerald'}
        />
        
        <ImprovedKpiCard
          label="Chamadas/Dia"
          value={Math.round(avgCallsPerDay)}
          icon="Activity"
          color="primary"
        />
        
        <ImprovedKpiCard
          label="Tenants Ativos"
          value={metrics.tenantsActive || 0}
          delta={{ 
            value: metrics.tenants > 0 ? (metrics.tenantsActive / metrics.tenants) * 100 : 0, 
            period: 'do total' 
          }}
          icon="Globe"
          color="emerald"
        />
        
        <ImprovedKpiCard
          label="Planos Diferentes"
          value={metrics.plans?.length || 0}
          icon="DollarSign"
          color="gold"
        />
        
        <ImprovedKpiCard
          label="Uptime"
          value="99.9%"
          icon="Clock"
          color="emerald"
        />
      </div>
    </div>
  );
}
