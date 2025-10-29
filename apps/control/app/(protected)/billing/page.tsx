import { createServerSupabaseClient } from "@lib/supabase/server";
import PageContainer from "@/components/layout/PageContainer";
import SectionHeader from "@/components/layout/SectionHeader";

export default async function BillingPage() {
  const supabase = createServerSupabaseClient();
  const [{ count: plans }, { count: subs }] = await Promise.all([
    supabase.schema('cp').from('plans').select('*', { count: 'exact', head: true }),
    supabase.schema('cp').from('subscriptions').select('*', { count: 'exact', head: true }),
  ]);
  const { data: invoices } = await supabase
    .schema('cp')
    .from('invoices')
    .select('tenant_id, amount_cents, currency, status, issued_at, created_at')
    .order('created_at', { ascending: false })
    .limit(20);

  return (
    <div className="container-app py-8 space-y-6">
      <PageContainer>
        <SectionHeader title="Billing" subtitle="Planos, assinaturas e faturas da plataforma." sticky />
      </PageContainer>

      <PageContainer>
        <div>
          <div>
            <h1 className="text-2xl font-semibold">Billing</h1>
            <p className="text-muted">Planos, assinaturas e faturas da plataforma.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="border rounded p-4">
              <div className="text-sm text-muted">Planos</div>
              <div className="text-2xl font-semibold">{plans ?? 0}</div>
            </div>
            <div className="border rounded p-4">
              <div className="text-sm text-muted">Assinaturas</div>
              <div className="text-2xl font-semibold">{subs ?? 0}</div>
            </div>
          </div>
          <div className="border rounded bg-white/90 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="surface-card sticky top-[68px] z-10 border-b">
                <tr>
                  <th className="text-left px-4 md:px-6 py-3 text-slate-600">Tenant</th>
                  <th className="text-left px-4 md:px-6 py-3 text-slate-600">Valor</th>
                  <th className="text-left px-4 md:px-6 py-3 text-slate-600">Status</th>
                  <th className="text-left px-4 md:px-6 py-3 text-slate-600">Emissão</th>
                </tr>
              </thead>
              <tbody>
                {(invoices ?? []).map((i: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 md:px-6 py-3">{i.tenant_id}</td>
                    <td className="px-4 md:px-6 py-3">{(i.amount_cents || 0) / 100} {i.currency}</td>
                    <td className="px-4 md:px-6 py-3">{i.status}</td>
                    <td className="px-4 md:px-6 py-3">{i.issued_at || i.created_at}</td>
                  </tr>
                ))}
                {!invoices?.length && (
                  <tr>
                    <td className="p-3 text-muted" colSpan={4}>Sem faturas</td>
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
