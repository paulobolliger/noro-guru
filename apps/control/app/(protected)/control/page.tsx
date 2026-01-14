import { Suspense } from "react";
import { loadControlMetrics } from "./actions";
import KpiCard from "@/components/dashboard/KpiCard";
import SystemHealth from "@/components/dashboard/SystemHealth";
import QuickActions from "@/components/dashboard/QuickActions";

export default async function ControlDashboard({ searchParams }: { searchParams?: Record<string, string | string[]> }) {
  const range = Number(typeof searchParams?.range === 'string' ? searchParams?.range : 30) || 30;
  const tenant = typeof searchParams?.tenant === 'string' ? searchParams?.tenant : null;
  const plan = typeof searchParams?.plan === 'string' ? searchParams?.plan : null;
  const metrics = await loadControlMetrics(range, tenant, plan);

  // metrics.tenants and metrics.apiKeys are counts (numbers), not arrays
  const totalCalls = Array.isArray(metrics.usage)
    ? metrics.usage.reduce((sum: number, u: any) => sum + (u.calls || 0), 0)
    : 0;
  const activeTenants = metrics.tenantsActive || 0;
  const totalApiKeys = metrics.apiKeys || 0;
  const totalTenants = metrics.tenants || 0;

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">
          Visão geral do sistema e métricas principais
        </p>
      </div>

      {/* KPI Grid - 4 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total Tenants"
          value={totalTenants}
          delta={{ value: 12.5, period: "vs mês anterior" }}
        />
        <KpiCard
          label="Tenants Ativos"
          value={activeTenants}
          delta={{ value: 8.3, period: "vs mês anterior" }}
        />
        <KpiCard
          label="API Keys"
          value={totalApiKeys}
          delta={{ value: -2.1, period: "vs mês anterior" }}
        />
        <KpiCard
          label="Total Calls"
          value={totalCalls.toLocaleString('pt-BR')}
          delta={{ value: 15.7, period: "vs mês anterior" }}
        />
      </div>

      {/* System Health + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SystemHealth
            uptime={100}
            responseTime={0}
            errorRate={0}
            status="operational"
          />
        </div>
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>

      {/* Recent Activity / Charts - Placeholder for future */}
      <div className="surface-card rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h2>
        <div className="flex items-center justify-center h-48 text-gray-400">
          <p className="text-sm">Gráficos e atividades em breve...</p>
        </div>
      </div>
    </div>
  );
}
