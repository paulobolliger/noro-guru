// app/(protected)/control/DashboardMetrics.tsx
import { loadControlMetrics } from "./actions";
import KpiCard from "@/components/dashboard/KpiCard";

interface DashboardMetricsProps {
  range: number;
  tenant: string | null;
  plan: string | null;
}

export async function DashboardMetrics({ range, tenant, plan }: DashboardMetricsProps) {
  const metrics = await loadControlMetrics(range, tenant, plan);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      <KpiCard 
        label="Tenants" 
        value={metrics.tenants} 
        sparkline={metrics.usage.map((u: any, i: number) => ({ x: i, y: u.calls }))} 
      />
      <KpiCard label="API Keys" value={metrics.apiKeys} />
      <KpiCard 
        label="Chamadas (total)" 
        value={metrics.usage.reduce((a: number, b: any) => a + (b.calls || 0), 0).toLocaleString('pt-BR')} 
      />
    </div>
  );
}
