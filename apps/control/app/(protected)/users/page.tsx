import { createServerSupabaseClient } from "@lib/supabase/server";
import PageContainer from "@/components/layout/PageContainer";
import SectionHeader from "@/components/layout/SectionHeader";

export default async function UsersPage() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .schema('cp')
    .from('user_tenant_roles')
    .select('user_id, tenant_id, role')
    .order('role', { ascending: false })
    .limit(100);
  if (error) throw new Error(error.message);

  return (
    <div className="container-app py-8 space-y-6">
      <PageContainer>
        <SectionHeader title="Usuários" subtitle="Vínculos usuário ↔ tenant com roles." sticky />
      </PageContainer>

      <PageContainer>
        <div>
          <h1 className="text-2xl font-semibold mb-2">Usuários</h1>
          <p className="text-muted mb-4">Vínculos usuário ↔ tenant com roles.</p>
          <div className="rounded-xl surface-card border border-default shadow-[0_1px_0_0_rgba(255,255,255,0.03)] overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-white/5 sticky top-[68px] z-10 border-b border-default">
                <tr>
                  <th className="text-left px-4 md:px-6 py-3 text-xs font-medium uppercase tracking-wide text-muted">User ID</th>
                  <th className="text-left px-4 md:px-6 py-3 text-xs font-medium uppercase tracking-wide text-muted">Tenant</th>
                  <th className="text-left px-4 md:px-6 py-3 text-xs font-medium uppercase tracking-wide text-muted">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(data ?? []).map((r: any) => (
                  <tr key={String(r.user_id) + '-' + String(r.tenant_id)} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 md:px-6 py-3 text-primary">{r.user_id}</td>
                    <td className="px-4 md:px-6 py-3 text-primary">{r.tenant_id}</td>
                    <td className="px-4 md:px-6 py-3 text-primary">{r.role}</td>
                  </tr>
                ))}
                {!data?.length && (
                  <tr>
                    <td className="p-3 text-muted" colSpan={3}>Sem vínculos</td>
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
