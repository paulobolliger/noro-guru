// app/(protected)/control/DashboardWebhooks.tsx
import { loadControlMetrics } from "./actions";

interface DashboardWebhooksProps {
  range: number;
  tenant: string | null;
  plan: string | null;
}

export async function DashboardWebhooks({ range, tenant, plan }: DashboardWebhooksProps) {
  const metrics = await loadControlMetrics(range, tenant, plan);
  
  return (
    <div className="rounded-xl border bg-white/90 overflow-hidden">
      <div className="px-4 md:px-6 py-3 border-b border-default font-medium">Últimos Webhooks</div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="surface-card sticky top-[68px] z-10">
            <tr>
              <th className="text-left px-4 md:px-6 py-3 text-description">Provider</th>
              <th className="text-left px-4 md:px-6 py-3 text-description">Evento</th>
              <th className="text-left px-4 md:px-6 py-3 text-description">Status</th>
              <th className="text-left px-4 md:px-6 py-3 text-description">Quando</th>
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
  );
}
