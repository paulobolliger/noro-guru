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
        <div className="overflow-x-auto rounded-xl border-2 border-[#D4AF37] dark:border-[#4aede5] shadow-lg">
          <table className="min-w-full text-sm bg-white dark:bg-[#1a1625]">
            <thead className="bg-gradient-to-b from-gray-100 dark:from-indigo-500/10 via-gray-50 dark:via-purple-500/5 to-transparent border-b-2 border-[#D4AF37] dark:border-[#4aede5]">
              <tr>
                <th className="text-left px-4 md:px-6 py-3 text-xs font-bold uppercase tracking-wide text-[#D4AF37]">Nome</th>
                <th className="text-left px-4 md:px-6 py-3 text-xs font-bold uppercase tracking-wide text-[#D4AF37]">Slug</th>
                <th className="text-left px-4 md:px-6 py-3 text-xs font-bold uppercase tracking-wide text-[#D4AF37]">Plano</th>
                <th className="text-left px-4 md:px-6 py-3 text-xs font-bold uppercase tracking-wide text-[#D4AF37]">Status</th>
                <th className="text-left px-4 md:px-6 py-3 text-xs font-bold uppercase tracking-wide text-[#D4AF37]">Criado</th>
                <th className="p-3"/>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/10">
              {tenants.map((t: any) => (
                <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 md:px-6 py-3 font-medium text-gray-900 dark:text-white">{t.name}</td>
                  <td className="px-4 md:px-6 py-3 text-gray-700 dark:text-gray-300">{t.slug}</td>
                  <td className="px-4 md:px-6 py-3 text-gray-700 dark:text-gray-300">{t.plan || '—'}</td>
                  <td className="px-4 md:px-6 py-3 text-gray-700 dark:text-gray-300">{t.status || '—'}</td>
                  <td className="px-4 md:px-6 py-3 text-gray-700 dark:text-gray-300">{new Date(t.created_at).toLocaleString('pt-BR')}</td>
                  <td className="px-4 md:px-6 py-3 text-right">
                    <Link href={`/control/orgs/${t.id}`} className="inline-block">
                      <span className="badge badge-info">Detalhes</span>
                    </Link>
                  </td>
                </tr>
              ))}
              {tenants.length === 0 && (
                <tr><td className="px-6 py-10 text-center text-gray-600 dark:text-gray-400" colSpan={6}>Sem clientes/empresas</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
