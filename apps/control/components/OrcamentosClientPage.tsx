// components/admin/OrcamentosClientPage.tsx
'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Plus, Search } from 'lucide-react';
import PageHeader from './layout/PageHeader';
import { orcamentoStatusText } from '@/../../packages/ui/status';
import type { Database } from "@noro-types/supabase";
import { format } from 'date-fns';
import { currencyFormat } from '@/utils/currency-format';

type OrcamentoRow = Database['public']['Tables']['noro_orcamentos']['Row'];
type OrcamentoStatus = Database['public']['Enums']['orcamento_status'];

interface OrcamentosClientPageProps {
  orcamentos: OrcamentoRow[];
}

const statusColorMap: Record<OrcamentoStatus, { bg: string; text: string; label: string }> = {
  rascunho: { bg: "border border-default bg-[var(--color-surface-alt)]", text: "text-secondary", label: "Rascunho" },
  enviado: { bg: "border border-default bg-[var(--color-surface-alt)]", text: "text-primary", label: "Enviado" },
  visualizado: { bg: "border border-default bg-[var(--color-surface-alt)]", text: "text-primary", label: "Visualizado" },
  aceito: { bg: "border border-default bg-[rgba(29,211,192,0.18)]", text: "text-success", label: "Aceito" },
  recusado: { bg: "border border-default bg-[rgba(239,68,68,0.18)]", text: "text-rose-400", label: "Recusado" },
  expirado: { bg: "border border-default bg-[var(--color-surface-alt)]", text: "text-secondary", label: "Expirado" },
  revisao: { bg: "border border-default bg-[var(--color-surface-alt)]", text: "text-accent", label: "Revisao" },
};

export default function OrcamentosClientPage({ orcamentos }: OrcamentosClientPageProps) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('todos');

    const statusOptions = ['todos', ...Object.keys(statusColorMap)] as string[];

    const filteredOrcamentos = useMemo(() => {
        return orcamentos.filter(orc => {
            const matchesSearch = searchTerm === '' || 
                orc.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                orc.numero_orcamento?.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesStatus = statusFilter === 'todos' || orc.status === statusFilter;
            
            return matchesSearch && matchesStatus;
        });
    }, [orcamentos, searchTerm, statusFilter]);

    const handleVerDetalhes = (orcamentoId: string) => {
        router.push(`/admin/orcamentos/${orcamentoId}`);
    };

    return (
        <div className="space-y-6">
            <PageHeader title="Propostas e Orçamentos" subtitle={`${orcamentos.length} propostas encontradas.`} actions={(
              <button onClick={() => router.push('/admin/orcamentos/novo')} className="btn-primary inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold transition-transform duration-200 ease-in-out">
                <Plus size={20} /> Nova Proposta
              </button>
            )} />
            <div className="hidden">
                <div className="flex items-center gap-4">
                    <FileText size={32} className="text-link" />
                    <div>
                        <h1 className="text-3xl font-semibold text-primary">Propostas e Orçamentos</h1>
                        <p className="text-muted/80 mt-1">{orcamentos.length} propostas encontradas.</p>
                    </div>
                </div>
                <button
                    onClick={() => router.push('/admin/orcamentos/novo')}
                    className="btn-primary inline-flex items-center gap-2 rounded-lg px-6 py-3 font-semibold transition-transform duration-200 ease-in-out"
                >
                    <Plus size={20} />
                    Nova Proposta
                </button>
            </div>

            <div className="rounded-xl surface-card border border-default shadow-[0_1px_0_0_rgba(255,255,255,0.03)]">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar por título ou número..."
                            className="w-full rounded-lg border border-default bg-[var(--color-surface-alt)] pl-10 pr-4 py-3 text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-[rgba(29,211,192,0.35)]"
                        />
                    </div>
                    
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-lg border border-default bg-[var(--color-surface-alt)] px-4 py-3 text-primary focus:outline-none focus:ring-2 focus:ring-[rgba(29,211,192,0.35)]"
                    >
                        {statusOptions.map(status => (
                            <option key={status} value={status}>
                                {status === 'todos' ? 'Todos os Status' : statusColorMap[status as OrcamentoStatus].label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="rounded-xl surface-card border border-default shadow-[0_1px_0_0_rgba(255,255,255,0.03)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-default">
                        <thead className="bg-[var(--color-surface-alt)] border-b border-default">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">Nº</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">Título</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">Valor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">Data</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-muted uppercase">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="surface-card divide-y divide-default">
                            {filteredOrcamentos.length > 0 ? (
                                filteredOrcamentos.map((orcamento) => {
                                    const statusConfig = statusColorMap[orcamento.status as OrcamentoStatus] || statusColorMap.rascunho;
                                    return (
                                        <tr key={orcamento.id} className="border-b border-default cursor-pointer transition-colors" onClick={() => handleVerDetalhes(orcamento.id)}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-link">{orcamento.numero_orcamento || orcamento.id.substring(0, 8)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">{orcamento.titulo}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary">{currencyFormat(orcamento.valor_total)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-md ${statusConfig.bg} ${statusConfig.text}`}>{statusConfig.label.toUpperCase()}</span></td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">{format(new Date(orcamento.created_at), 'dd/MM/yyyy')}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><button onClick={(e) => { e.stopPropagation(); handleVerDetalhes(orcamento.id);}} className="text-link">Detalhes</button></td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr><td colSpan={6} className="px-6 py-12 text-center"><FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" /><p className="text-lg font-medium text-muted">Nenhuma proposta encontrada.</p><p className="mt-1 text-sm text-gray-400">Clique em "Nova Proposta" para criar a sua primeira.</p></td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}














