import Link from "next/link";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import OrgsHeader from "@/components/orgs/OrgsHeader";
import OrgKpis from "@/components/orgs/OrgKpis";

export default async function OrgsPage() {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .schema('cp')
    .from('tenants')
    .select('id, name, slug, plan, status, created_at')
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw new Error(error.message);

  const tenants = data || [];
  const planosCount = tenants.reduce((acc: Record<string, number>, t: any) => {
    const k = (t.plan || '—').toString();
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="container-app py-8 space-y-6">
      <OrgsHeader />
      <OrgKpis totals={{ total: tenants.length, ativos: tenants.filter(t => (t.status||'').toLowerCase()==='active').length, planos: planosCount }} />

      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="overflow-x-auto rounded-xl surface-card border border-default shadow-[0_1px_0_0_rgba(255,255,255,0.03)]">
          <table className="min-w-full text-sm">
            <thead className="bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent border-b border-default">
              <tr>
                <th className="text-left px-4 md:px-6 py-3 text-xs font-medium uppercase tracking-wide text-muted">Nome</th>
                <th className="text-left px-4 md:px-6 py-3 text-xs font-medium uppercase tracking-wide text-muted">Slug</th>
                <th className="text-left px-4 md:px-6 py-3 text-xs font-medium uppercase tracking-wide text-muted">Plano</th>
                <th className="text-left px-4 md:px-6 py-3 text-xs font-medium uppercase tracking-wide text-muted">Status</th>
                <th className="text-left px-4 md:px-6 py-3 text-xs font-medium uppercase tracking-wide text-muted">Criado</th>
                <th className="p-3"/>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tenants.map((t: any) => (
                <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 md:px-6 py-3 font-medium text-primary">{t.name}</td>
                  <td className="px-4 md:px-6 py-3 text-muted">{t.slug}</td>
                  <td className="px-4 md:px-6 py-3 text-muted">{t.plan || '—'}</td>
                  <td className="px-4 md:px-6 py-3 text-muted">{t.status || '—'}</td>
                  <td className="px-4 md:px-6 py-3 text-muted">{new Date(t.created_at).toLocaleString('pt-BR')}</td>
                  <td className="px-4 md:px-6 py-3 text-right">
                    <Link href={`/control/orgs/${t.id}`} className="inline-block">
                      <span className="badge badge-info">Detalhes</span>
                    </Link>
                  </td>
                </tr>
              ))}
              {tenants.length === 0 && (
                <tr><td className="px-6 py-10 text-center text-primary0" colSpan={6}>Sem clientes/empresas</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
