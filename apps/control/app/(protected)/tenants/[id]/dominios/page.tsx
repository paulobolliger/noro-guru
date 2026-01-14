import { Globe, Plus, Trash2, CheckCircle, AlertCircle, XCircle, ExternalLink } from 'lucide-react';
import { getTenantDomains, addDomain, deleteDomain, verifyDomain } from '../../domain-actions';
import { revalidatePath } from 'next/cache';

export default async function TenantDomainsPage({ params }: { params: { id: string } }) {
    const domains = await getTenantDomains(params.id);

    async function handleAddDomain(formData: FormData) {
        'use server';
        const domain = formData.get('domain') as string;
        await addDomain(params.id, domain);
    }

    async function handleDelete(domainId: string) {
        'use server';
        await deleteDomain(domainId, params.id);
    }

    async function handleVerify(domainId: string) {
        'use server';
        await verifyDomain(domainId, params.id);
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-heading flex items-center gap-2">
                        <Globe className="text-primary" size={24} />
                        Domínios Personalizados
                    </h2>
                    <p className="text-sm text-secondary mt-1">Gerencie os domínios de acesso (White Label) para este tenant.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-surface-card border border-default rounded-xl p-6 shadow-sm">
                        <h3 className="text-sm font-bold text-heading uppercase tracking-wide mb-4">Adicionar Novo Domínio</h3>
                        <form action={handleAddDomain} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-secondary mb-1.5 uppercase">Endereço do Domínio</label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-2.5 text-tertiary" size={16} />
                                    <input
                                        name="domain"
                                        type="text"
                                        placeholder="app.cliente.com.br"
                                        className="w-full pl-10 pr-4 py-2 bg-surface-base border border-default rounded-lg text-heading text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-tertiary"
                                        required
                                    />
                                </div>
                                <p className="text-xs text-tertiary mt-2">Insira o domínio sem http:// ou https://</p>
                            </div>
                            <button type="submit" className="w-full btn-primary py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm">
                                <Plus size={16} /> Adicionar Domínio
                            </button>
                        </form>
                    </div>

                    <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-6">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-blue-800 mb-2">
                            <AlertCircle size={16} /> Como Configurar
                        </h4>
                        <p className="text-xs text-blue-600 leading-relaxed mb-3">
                            Para ativar o white-label, peça para o cliente criar um registro CNAME na zona de DNS dele.
                        </p>
                        <div className="bg-white border border-blue-200 rounded p-2 text-xs font-mono text-blue-700 break-all mb-2">
                            CNAME &nbsp; app.cliente.com &nbsp; ➜ &nbsp; cname.noro.guru
                        </div>
                        <p className="text-[10px] text-blue-400">
                            A propagação pode levar até 48 horas.
                        </p>
                    </div>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2">
                    <div className="bg-surface-card border border-default rounded-xl overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-default flex justify-between items-center">
                            <h3 className="text-sm font-bold text-heading uppercase tracking-wide">Domínios Ativos</h3>
                            <span className="text-xs font-medium text-tertiary bg-surface-base px-2 py-1 rounded-full border border-default">
                                {domains.length} domínios
                            </span>
                        </div>

                        {domains.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 bg-surface-base rounded-full flex items-center justify-center mx-auto mb-4 text-tertiary">
                                    <Globe size={32} />
                                </div>
                                <h4 className="text-heading font-medium mb-1">Nenhum domínio configurado</h4>
                                <p className="text-sm text-secondary">Utilize o formulário ao lado para cadastrar.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-surface-base border-b border-default text-xs uppercase text-secondary font-semibold tracking-wider">
                                        <tr>
                                            <th className="px-6 py-4 font-medium">Domínio</th>
                                            <th className="px-6 py-4 font-medium">Status / Verificação</th>
                                            <th className="px-6 py-4 text-right font-medium">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-default">
                                        {domains.map((domain) => (
                                            <tr key={domain.id} className="group hover:bg-surface-base/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <a href={`http://${domain.domain}`} target="_blank" className="font-medium text-heading hover:text-primary flex items-center gap-2 transition-colors">
                                                            {domain.domain}
                                                            <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </a>
                                                        <span className="text-xs text-tertiary">Adicionado em {new Date(domain.created_at).toLocaleDateString('pt-BR')}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1.5 items-start">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${domain.status === 'active'
                                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                                                : domain.status === 'invalid'
                                                                    ? 'bg-red-50 text-red-600 border-red-200'
                                                                    : 'bg-amber-50 text-amber-600 border-amber-200'
                                                            }`}>
                                                            {domain.status === 'active' && <CheckCircle size={10} />}
                                                            {domain.status === 'pending' && <AlertCircle size={10} />}
                                                            {domain.status === 'invalid' && <XCircle size={10} />}
                                                            {domain.status === 'active' ? 'Ativo' : domain.status === 'pending' ? 'Pendente' : 'Inválido'}
                                                        </span>

                                                        <span className={`text-[10px] flex items-center gap-1 ${domain.verified ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                            {domain.verified ? 'DNS Verificado' : 'Aguardando DNS'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                        {!domain.verified && (
                                                            <form action={handleVerify.bind(null, domain.id)}>
                                                                <button type="submit" className="text-xs font-medium text-blue-600 hover:text-blue-700 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-md border border-blue-200 transition-colors">
                                                                    Verificar DNS
                                                                </button>
                                                            </form>
                                                        )}
                                                        <form action={handleDelete.bind(null, domain.id)}>
                                                            <button type="submit" className="p-2 text-secondary hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Remover Domínio">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </form>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
