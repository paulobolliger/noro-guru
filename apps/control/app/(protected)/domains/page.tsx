import { listDomains, createDomain, deleteDomain, setDefaultDomain } from "./actions";
import { Plus, Globe, Trash2, CheckCircle, ShieldCheck, ExternalLink } from "lucide-react";

export default async function DomainsPage({ searchParams }: { searchParams?: Record<string, string> }) {
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
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-heading flex items-center gap-2">
            <Globe className="text-primary" size={24} />
            Domínios Globais
          </h2>
          <p className="text-sm text-secondary mt-1">Mapa de domínios e subdomínios do sistema (root/tenants).</p>
        </div>
      </div>

      {/* Form Section - Horizontal Bar */}
      <div className="bg-surface-card border border-default rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-bold text-heading uppercase tracking-wide mb-4">Adicionar Novo Domínio</h3>
        <form action={create} className="flex flex-col md:flex-row items-end gap-4">
          <div className="flex-1 w-full md:w-auto">
            <label className="block text-xs font-medium text-secondary mb-1.5 uppercase">Endereço do Domínio</label>
            <div className="relative">
              <Globe className="absolute left-3 top-2.5 text-tertiary" size={16} />
              <input
                name="domain"
                type="text"
                placeholder="ex: agencia.core.noro.guru"
                className="w-full pl-10 pr-4 py-2 bg-surface-base border border-default rounded-lg text-heading text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-tertiary"
                required
              />
            </div>
          </div>

          <div className="pb-2">
            <div className="flex items-center gap-2 h-10">
              <input
                type="checkbox"
                name="is_default"
                id="is_default"
                className="w-4 h-4 text-primary bg-surface-base border-default rounded focus:ring-primary focus:ring-2"
              />
              <label htmlFor="is_default" className="text-sm text-secondary cursor-pointer select-none">
                Definir como Default
              </label>
            </div>
          </div>

          <button type="submit" className="w-full md:w-auto btn-primary py-2 px-6 rounded-lg flex items-center justify-center gap-2 text-sm shrink-0 h-10">
            <Plus size={16} /> Adicionar
          </button>
        </form>

        {/* Feedback Messages */}
        {searchParams?.success && (
          <div className="mt-4 p-3 bg-green-50/50 border border-green-100 rounded-lg text-sm text-green-700 flex items-center gap-2">
            <CheckCircle size={16} /> Domínio adicionado com sucesso.
          </div>
        )}
        {searchParams?.error && (
          <div className="mt-4 p-3 bg-red-50/50 border border-red-100 rounded-lg text-sm text-red-700 flex items-center gap-2">
            <ShieldCheck size={16} /> {decodeURIComponent(String(searchParams.error))}
          </div>
        )}
      </div>

      {/* List Section */}
      <div className="bg-surface-card border border-default rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-default flex justify-between items-center">
          <h3 className="text-sm font-bold text-heading uppercase tracking-wide">Domínios do Sistema</h3>
          <span className="text-xs font-medium text-tertiary bg-surface-base px-2 py-1 rounded-full border border-default">
            {domains.length} registros
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-base border-b border-default text-xs uppercase text-secondary font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Domínio</th>
                <th className="px-6 py-4 font-medium">Tipo</th>
                <th className="px-6 py-4 font-medium">Criado em</th>
                <th className="px-6 py-4 text-right font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-default">
              {domains.map((d: any) => (
                <tr key={d.id} className="group hover:bg-surface-base/50 transition-colors">
                  <td className="px-6 py-4">
                    <a href={`http://${d.domain}`} target="_blank" className="font-medium text-heading hover:text-primary flex items-center gap-2 transition-colors">
                      {d.domain}
                      <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    {d.is_default ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-600 border border-purple-200">
                        <CheckCircle size={10} /> Default
                      </span>
                    ) : (
                      <span className="text-xs text-tertiary">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs text-secondary">
                    {d.created_at ? new Date(d.created_at).toLocaleDateString('pt-BR') : '-'}
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    {!d.is_default && (
                      <form action={setDefault}>
                        <input type="hidden" name="id" value={d.id} />
                        <button type="submit" className="text-xs font-medium text-blue-600 hover:text-blue-800 px-3 py-1 bg-blue-50 border border-blue-200 rounded-md transition-colors opacity-0 group-hover:opacity-100">
                          Definir Default
                        </button>
                      </form>
                    )}
                    <form action={remove}>
                      <input type="hidden" name="id" value={d.id} />
                      <button type="submit" className="p-2 text-secondary hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Remover">
                        <Trash2 size={16} />
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {domains.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-secondary">
                    <Globe size={48} className="mx-auto mb-4 opacity-20" />
                    <p>Nenhum domínio cadastrado.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
