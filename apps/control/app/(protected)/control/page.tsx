import { Suspense } from "react";
import PageContainer from "@/components/layout/PageContainer";
import SectionHeader from "@/components/layout/SectionHeader";
import { loadControlMetrics } from "./actions";
import FilterBar from "@/components/dashboard/FilterBar";
import DashboardCharts from "@/components/dashboard/DashboardCharts";
import { SkeletonKpi, SkeletonTable } from "@/components/ui/LoadingStates";
import { DashboardHero } from "./DashboardHero";
import { QuickActions } from "./QuickActions";
import { ActivityFeed } from "./ActivityFeed";
import { ImprovedMetricsGrid } from "./ImprovedMetricsGrid";

export default async function ControlDashboard({ searchParams }: { searchParams?: Record<string, string | string[]> }) {
  const range = Number(typeof searchParams?.range === 'string' ? searchParams?.range : 30) || 30;
  const tenant = typeof searchParams?.tenant === 'string' ? searchParams?.tenant : null;
  const plan = typeof searchParams?.plan === 'string' ? searchParams?.plan : null;
  const metrics = await loadControlMetrics(range, tenant, plan);
  
  const totalCalls = metrics.usage.reduce((sum: number, u: any) => sum + (u.calls || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a1625] to-[#0a0a0f] py-8">
      <div className="container-app space-y-8">
        {/* Header */}
        <PageContainer>
          <SectionHeader
            title="Control Plane"
            subtitle="Administre tenants, domínios, chaves de API, billing e integrações."
            sticky
          />
        </PageContainer>

        {/* Filtros */}
        <PageContainer>
          <FilterBar 
            tenants={(metrics.tenantsOptions||[]).map((t:any)=>({id:t.id,name:t.name}))} 
            plans={metrics.plans||[]} 
          />
        </PageContainer>

        {/* Hero Section - System Health + Quick Stats */}
        <PageContainer>
          <Suspense fallback={<SkeletonKpi count={4} />}>
            <DashboardHero 
              tenants={metrics.tenants}
              apiKeys={metrics.apiKeys}
              totalCalls={totalCalls}
              usage={metrics.usage}
            />
          </Suspense>
        </PageContainer>

        {/* Métricas Adicionais */}
        <PageContainer>
          <Suspense fallback={<SkeletonKpi count={4} />}>
            <ImprovedMetricsGrid range={range} tenant={tenant} plan={plan} />
          </Suspense>
        </PageContainer>

        {/* Quick Actions + Activity Feed */}
        <PageContainer>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <QuickActions />
            </div>
            <div className="lg:col-span-1">
              <ActivityFeed webhooks={metrics.webhooks} />
            </div>
          </div>
        </PageContainer>

        {/* Advanced Analytics - Gráficos Detalhados */}
        <PageContainer>
          <div className="space-y-4 mb-6">
            <h3 className="text-2xl font-bold text-white">Advanced Analytics</h3>
            <p className="text-description">Análise detalhada de uso, performance e crescimento</p>
          </div>
          <DashboardCharts
            usage={metrics.usage}
            tenantsByPlan={metrics.tenantsByPlan}
            createdDaily={metrics.createdDaily}
            activeBreakdown={metrics.activeBreakdown}
          />
        </PageContainer>
      </div>
    </div>
  );
}
