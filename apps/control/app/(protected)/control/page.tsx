import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";
import SectionHeader from "@/components/layout/SectionHeader";
import { loadControlMetrics } from "./actions";
import KpiCard from "@/components/dashboard/KpiCard";
import FilterBar from "@/components/dashboard/FilterBar";
import DashboardCharts from "@/components/dashboard/DashboardCharts";

export default async function ControlDashboard({ searchParams }: { searchParams?: Record<string, string | string[]> }) {
  const range = Number(typeof searchParams?.range === 'string' ? searchParams?.range : 30) || 30;
  const tenant = typeof searchParams?.tenant === 'string' ? searchParams?.tenant : null;
  const plan = typeof searchParams?.plan === 'string' ? searchParams?.plan : null;
  const metrics = await loadControlMetrics(range, tenant, plan);
  const cards = [
    { title: "Tenants", desc: "Gerencie organizações, membros e roles", href: "/tenants" },
    { title: "Domínios", desc: "Mapeie domínios/subdomínios por tenant", href: "/domains" },
    { title: "API Keys", desc: "Crie e revogue chaves por tenant", href: "/api-keys" },
    { title: "Billing", desc: "Planos, assinaturas e faturas", href: "#" },
    { title: "Webhooks", desc: "Eventos de provedores e integrações", href: "#" },
    { title: "Auditoria", desc: "Logs e ações administrativas", href: "#" },
  ];

  return (
    <div className="container-app py-8 space-y-6">
      <PageContainer>
        <SectionHeader
          title="Control Plane"
          subtitle="Administre tenants, domínios, chaves de API, billing e integrações."
          sticky
        />
      </PageContainer>

      <PageContainer>
        <FilterBar tenants={(metrics.tenantsOptions||[]).map((t:any)=>({id:t.id,name:t.name}))} plans={metrics.plans||[]} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <KpiCard label="Tenants" value={metrics.tenants} sparkline={metrics.usage.map((u:any,i:number)=>({x:i,y:u.calls}))} />
          <KpiCard label="API Keys" value={metrics.apiKeys} />
          <KpiCard label="Chamadas (total)" value={metrics.usage.reduce((a:number,b:any)=>a+(b.calls||0),0).toLocaleString('pt-BR')} />
        </div>
      </PageContainer>

      <PageContainer>
        <DashboardCharts
          usage={metrics.usage}
          tenantsByPlan={metrics.tenantsByPlan}
          createdDaily={metrics.createdDaily}
          activeBreakdown={metrics.activeBreakdown}
        />
      </PageContainer>

      <PageContainer>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <Link key={c.title} href={c.href} className="border rounded-lg p-4 bg-white/90 hover:shadow-md transition">
              <div className="font-medium text-slate-900">{c.title}</div>
              <div className="text-sm text-slate-600">{c.desc}</div>
            </Link>
          ))}
        </div>
      </PageContainer>

      <PageContainer>
        <div className="rounded-xl border bg-white/90 overflow-hidden">
          <div className="px-4 md:px-6 py-3 border-b border-default border-default font-medium">Últimos Webhooks</div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="surface-card sticky top-[68px] z-10">
                <tr>
                  <th className="text-left px-4 md:px-6 py-3 text-slate-600">Provider</th>
                  <th className="text-left px-4 md:px-6 py-3 text-slate-600">Evento</th>
                  <th className="text-left px-4 md:px-6 py-3 text-slate-600">Status</th>
                  <th className="text-left px-4 md:px-6 py-3 text-slate-600">Quando</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {metrics.webhooks.map((w: any) => (
                  <tr key={w.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 md:px-6 py-3">{w.provider ?? "-"}</td>
                    <td className="px-4 md:px-6 py-3">{w.event ?? "-"}</td>
                    <td className="px-4 md:px-6 py-3">{w.status ?? "-"}</td>
                    <td className="px-4 md:px-6 py-3">{w.created_at}</td>
                  </tr>
                ))}
                {!metrics.webhooks.length && (
                  <tr>
                    <td className="px-6 py-10 text-center text-primary0" colSpan={4}>
                      Sem eventos recentes
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
