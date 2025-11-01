import { listDomains, createDomain, deleteDomain, setDefaultDomain } from "./actions";
import PageContainer from "@/components/layout/PageContainer";
import { NButton, NInput, NBadge } from "@/components/ui";
import { Plus, Globe } from "lucide-react";

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
    <PageContainer>
      {/* Header com ícone */}
      <div className="sticky top-0 z-30 mb-6">
        <div
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 max-w-[1200px] mx-auto px-4 md:px-6 py-4 rounded-xl shadow-md"
          style={{ background: 'linear-gradient(135deg, rgba(59, 44, 164, 0.94), rgba(35, 33, 79, 0.92))' }}
        >
          <div className="flex items-center gap-3 flex-shrink-0">
            <Globe size={28} className="text-[#D4AF37]" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-[#D4AF37] tracking-tight">Domínios</h1>
              <p className="text-sm text-gray-300 mt-1">Mapa de domínios/subdomínios por tenant (cp.domains).</p>
            </div>
          </div>

          <form action={create} className="flex items-end gap-3">
            <div className="flex flex-col">
              <label className="text-sm text-gray-300 mb-1">Domínio</label>
              <NInput name="domain" placeholder="ex: agencia.core.noro.guru" className="w-[320px] md:w-96" />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input type="checkbox" name="is_default" /> Default
            </label>
            <NButton variant="primary" type="submit" leftIcon={<Plus className="w-4 h-4" />}>Adicionar</NButton>
          </form>
        </div>
      </div>

      {/* Alertas */}
      {searchParams?.success && (
        <div className="mb-3"><span className="alert alert-success">Domínio adicionado com sucesso.</span></div>
      )}
      {searchParams?.error && (
        <div className="mb-3"><span className="alert alert-error">{decodeURIComponent(String(searchParams.error))}</span></div>
      )}

      {/* Tabela com padrão atualizado */}
      <div className="rounded-xl border-2 border-[#D4AF37] dark:border-[#4aede5] shadow-lg overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full text-sm bg-white dark:bg-[#1a1625]">
            <thead className="bg-gradient-to-b from-gray-100 dark:from-indigo-500/10 via-gray-50 dark:via-purple-500/5 to-transparent border-b-2 border-[#D4AF37] dark:border-[#4aede5]">
              <tr>
                <th className="text-left px-4 md:px-6 py-3 text-xs font-bold text-[#D4AF37] uppercase tracking-wide">Domínio</th>
                <th className="text-left px-4 md:px-6 py-3 text-xs font-bold text-[#D4AF37] uppercase tracking-wide">Default</th>
                <th className="text-left px-4 md:px-6 py-3 text-xs font-bold text-[#D4AF37] uppercase tracking-wide">Criado</th>
                <th className="px-4 md:px-6 py-3 text-xs font-bold text-[#D4AF37] uppercase tracking-wide text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/10">
              {domains.map((d: any) => (
                <tr key={d.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 md:px-6 py-3 font-medium text-gray-900 dark:text-white">{d.domain}</td>
                  <td className="px-4 md:px-6 py-3 text-gray-700 dark:text-gray-300">
                    {d.is_default ? <NBadge variant="success">Default</NBadge> : <span className="text-gray-500 dark:text-gray-400">—</span>}
                  </td>
                  <td className="px-4 md:px-6 py-3 text-gray-700 dark:text-gray-300">{d.created_at}</td>
                  <td className="px-4 md:px-6 py-3 text-right space-x-2">
                    {!d.is_default && (
                      <form action={setDefault} className="inline">
                        <input type="hidden" name="id" value={d.id} />
                        <button
                          type="submit"
                          className="text-sm text-[#4aede5] hover:text-[#D4AF37] transition-colors underline"
                        >
                          Definir default
                        </button>
                      </form>
                    )}
                    <form action={remove} className="inline ml-3">
                      <input type="hidden" name="id" value={d.id} />
                      <button
                        type="submit"
                        className="text-sm text-[#4aede5] hover:text-red-400 transition-colors underline"
                      >
                        Remover
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {domains.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-600 dark:text-gray-400">
                    Nenhum domínio cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  );
}
