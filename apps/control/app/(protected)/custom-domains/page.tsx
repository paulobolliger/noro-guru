import { listAllCustomDomains } from "./actions";
import { Globe, CheckCircle, AlertCircle, XCircle, ExternalLink } from "lucide-react";
import Link from 'next/link';

export default async function CustomDomainsReportPage() {
    const domains = await listAllCustomDomains();

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-heading flex items-center gap-2">
                        <Globe className="text-primary" size={24} />
                        Domínios de Clientes
                    </h2>
                    <p className="text-sm text-secondary mt-1">
                        Listagem consolidada de todos os domínios customizados (White Label) registrados pelos tenants.
                    </p>
                </div>
            </div>

            <div className="bg-surface-card border border-default rounded-xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-default flex justify-between items-center">
                    <h3 className="text-sm font-bold text-heading uppercase tracking-wide">Todos os Domínios</h3>
                    <span className="text-xs font-medium text-tertiary bg-surface-base px-2 py-1 rounded-full border border-default">
                        {domains.length} registros
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-surface-base border-b border-default text-xs uppercase text-secondary font-semibold tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-medium">Domínio</th>
                                <th className="px-6 py-4 font-medium">Tenant (Cliente)</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Criado em</th>
                                <th className="px-6 py-4 text-right">Link</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-default">
                            {domains.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-secondary">
                                        <Globe size={48} className="mx-auto mb-4 opacity-20" />
                                        <p>Nenhum domínio customizado encontrado.</p>
                                    </td>
                                </tr>
                            ) : (
                                domains.map((domain: any) => (
                                    <tr key={domain.id} className="group hover:bg-surface-base/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 font-medium text-heading">
                                                {domain.domain}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Link href={`/tenants/${domain.tenant_id}`} className="text-primary hover:underline font-medium">
                                                {domain.tenant_name}
                                            </Link>
                                            <div className="text-[10px] text-tertiary font-mono mt-0.5">{domain.tenant_id.split('-')[0]}...</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1 items-start">
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
                                                {domain.verified && <span className="text-[10px] text-emerald-600 flex items-center gap-1"><CheckCircle size={8} /> DNS OK</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-secondary">
                                            {new Date(domain.created_at).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <a
                                                href={`http://${domain.domain}`}
                                                target="_blank"
                                                className="inline-flex items-center gap-1 text-xs text-secondary hover:text-primary transition-colors"
                                            >
                                                Acessar <ExternalLink size={12} />
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
