import { listDomains, createDomain, deleteDomain, setDefaultDomain } from "./actions";
import PageContainer from "@/components/layout/PageContainer";
import SectionHeader from "@/components/layout/SectionHeader";
import { NButton, NInput, NBadge } from "@/components/ui";
import { Plus } from "lucide-react";

export default async function DomainsPage({ searchParams }: { searchParams?: Record<string,string> }) {
  const domains = await listDomains();

  async function create(formData: FormData) {
    "use server";
    await createDomain(formData);
  }

  async function remove(formData: FormData) {
    "use server";
    await deleteDomain(String(formData.get('id') || ''));
  }

  async function setDefault(formData: FormData) {
    "use server";
    await setDefaultDomain(String(formData.get('id') || ''));
  }

  return (
    <div className="container-app py-8 space-y-6">
      <PageContainer>
        <SectionHeader
          title="Domínios"
          subtitle="Mapa de domínios/subdomínios por tenant (cp.domains)."
          sticky
          right={(
            <form action={create} className="flex items-end gap-3">
              <div className="flex flex-col">
                <label className="text-sm text-primary">Domínio</label>
                <NInput name="domain" placeholder="ex: agencia.core.noro.guru" className="w-[320px] md:w-96" />
              </div>
              <label className="flex items-center gap-2 text-sm text-primary">
                <input type="checkbox" name="is_default" /> Default
              </label>
              <NButton variant="primary" type="submit" leftIcon={<Plus className="w-4 h-4" />}>Adicionar</NButton>
            </form>
          )}
        />
      </PageContainer>

      <PageContainer>
        {searchParams?.success && (
          <div className="mb-3"><span className="alert alert-success">Domínio adicionado com sucesso.</span></div>
        )}
        {searchParams?.error && (
          <div className="mb-3"><span className="alert alert-error">{decodeURIComponent(String(searchParams.error))}</span></div>
        )}
      </PageContainer>

      <PageContainer>
        <div className="rounded-xl surface-card border border-default shadow-[0_1px_0_0_rgba(255,255,255,0.03)] overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-white/5 border-b border-default">
              <tr>
                <th className="text-left px-4 md:px-6 py-3 text-xs font-medium uppercase tracking-wide text-muted">Domínio</th>
                <th className="text-left px-4 md:px-6 py-3 text-xs font-medium uppercase tracking-wide text-muted">Default</th>
                <th className="text-left px-4 md:px-6 py-3 text-xs font-medium uppercase tracking-wide text-muted">Criado</th>
                <th className="px-4 md:px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {domains.map((d: any) => (
                <tr key={d.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 md:px-6 py-3 text-primary">{d.domain}</td>
                  <td className="px-4 md:px-6 py-3">{d.is_default ? <NBadge variant="success">Default</NBadge> : <span className="text-muted">—</span>}</td>
                  <td className="px-4 md:px-6 py-3 text-muted">{d.created_at}</td>
                  <td className="p-2 text-right">
                    {!d.is_default && (
                      <form action={setDefault} className="inline">
                        <input type="hidden" name="id" value={d.id} />
                        <NButton variant="tertiary" size="sm">Definir default</NButton>
                      </form>
                    )}
                    <form action={remove} className="inline">
                      <input type="hidden" name="id" value={d.id} />
                      <NButton variant="tertiary" size="sm">Remover</NButton>
                    </form>
                  </td>
                </tr>
              ))}
              {domains.length === 0 && (
                <tr>
                  <td className="p-3 text-muted" colSpan={4}>Sem domínios</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </PageContainer>
    </div>
  );
}
