import PageContainer from "@/components/layout/PageContainer";
import SectionHeader from "@/components/layout/SectionHeader";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import EndpointsHeader from "@/components/webhooks/EndpointsHeader";
import { NButton } from "@/components/ui";

export default async function WebhookEndpointsPage() {
  const supabase = createAdminSupabaseClient();
  const { data: endpoints, error } = await supabase
    .schema('cp')
    .from('webhooks')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);

  async function remove(formData: FormData) {
    "use server";
    const id = String(formData.get('id') || '');
    const admin = createAdminSupabaseClient();
    await admin.schema('cp').from('webhooks').delete().eq('id', id);
  }

  async function toggle(formData: FormData) {
    "use server";
    const id = String(formData.get('id') || '');
    const active = String(formData.get('active') || '') === 'true';
    const admin = createAdminSupabaseClient();
    await admin.schema('cp').from('webhooks').update({ is_active: !active }).eq('id', id);
  }

  return (
    <div className="container-app py-8 space-y-6">
      <PageContainer>
        <SectionHeader title="Webhooks • Endpoints" subtitle="Gerencie endpoints de saída para eventos." sticky right={<EndpointsHeader/>} />
      </PageContainer>

      <PageContainer>
        <div className="rounded-xl surface-card border border-default overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-white/5 border-b border-default">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted">Code</th>
                <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted">URL</th>
                <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted">Ativo</th>
                <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted">Criado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {endpoints.map((e: any) => (
                <tr key={e.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-primary">{e.code}</td>
                  <td className="px-4 py-3 text-primary">{e.url}</td>
                  <td className="px-4 py-3 text-primary">{e.is_active ? 'Sim' : 'Não'}</td>
                  <td className="px-4 py-3 text-muted">{e.created_at}</td>
                  <td className="px-4 py-2 text-right">
                    <form action={toggle} className="inline">
                      <input type="hidden" name="id" value={e.id} />
                      <input type="hidden" name="active" value={String(e.is_active)} />
                      <NButton size="sm" variant="tertiary">{e.is_active ? 'Desativar' : 'Ativar'}</NButton>
                    </form>
                    <form action={remove} className="inline ml-2">
                      <input type="hidden" name="id" value={e.id} />
                      <NButton size="sm" variant="tertiary">Remover</NButton>
                    </form>
                  </td>
                </tr>
              ))}
              {endpoints.length === 0 && (
                <tr>
                  <td className="p-3 text-muted" colSpan={5}>Sem endpoints cadastrados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </PageContainer>
    </div>
  );
}

