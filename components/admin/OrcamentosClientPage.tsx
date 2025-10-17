'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Plus, Search } from 'lucide-react';
import type { Database } from '@/types/supabase';
import { format } from 'date-fns';

// Define os tipos com base na estrutura do projeto
type OrcamentoRow = Database['public']['Tables']['noro_orcamentos']['Row'];
type OrcamentoStatus = Database['public']['Enums']['orcamento_status'];

interface OrcamentosClientPageProps {
  orcamentos: OrcamentoRow[];
}

const statusColorMap: Record<OrcamentoStatus, { bg: string; text: string; label: string }> = {
    rascunho: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Rascunho' },
    enviado: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Enviado' },
    visualizado: { bg: 'bg-cyan-100', text: 'text-cyan-800', label: 'Visualizado' },
    aceito: { bg: 'bg-green-100', text: 'text-green-800', label: 'Aceito' },
    recusado: { bg: 'bg-red-100', text: 'text-red-800', label: 'Recusado' },
    expirado: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Expirado' },
    revisao: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Revisão' },
};

const formatCurrency = (value: number | null) => {
    if (value === null || value === undefined) return '€0,00';
    // Usando EUR como moeda padrão do projeto
    return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value);
};

export default function OrcamentosClientPage({ orcamentos }: OrcamentosClientPageProps) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('todos');

    // Mapeia todas as opções de status, incluindo "todos"
    const statusOptions = ['todos', ...Object.keys(statusColorMap)] as string[];

    const filteredOrcamentos = useMemo(() => {
        return orcamentos.filter(orc => {
            const matchesSearch = searchTerm === '' || 
                orc.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                orc.numero_orcamento?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                orc.descricao?.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesStatus = statusFilter === 'todos' || orc.status === statusFilter;
            
            return matchesSearch && matchesStatus;
        });
    }, [orcamentos, searchTerm, statusFilter]);

    const handleVerDetalhes = (orcamentoId: string) => {
        // Redirecionamento para a futura página de detalhes
        router.push(`/admin/orcamentos/${orcamentoId}`);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <FileText size={32} className="text-blue-600" />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Gestão de Orçamentos</h1>
                        <p className="text-gray-600 mt-1">{orcamentos.length} orçamentos encontrados.</p>
                    </div>
                </div>
                <button
                    onClick={() => router.push('/admin/orcamentos/novo')}
                    className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} />
                    Novo Orçamento
                </button>
            </div>

            {/* Filtros e Busca */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar por título ou número..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    {/* Filtro Status */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {statusOptions.map(status => (
                            <option key={status} value={status}>
                                {status === 'todos' ? 'Todos os Status' : statusColorMap[status as OrcamentoStatus].label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Tabela de Orçamentos */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nº Orçamento
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Título
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Valor
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Data de Criação
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredOrcamentos.length > 0 ? (
                                filteredOrcamentos.map((orcamento) => {
                                    const statusConfig = statusColorMap[orcamento.status as OrcamentoStatus] || statusColorMap.rascunho;
                                    return (
                                        <tr 
                                            key={orcamento.id} 
                                            className="hover:bg-gray-50 cursor-pointer"
                                            onClick={() => handleVerDetalhes(orcamento.id)}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                                {orcamento.numero_orcamento || orcamento.id.substring(0, 8)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {orcamento.titulo}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                {formatCurrency(orcamento.valor_total)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                                                    {statusConfig.label.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {format(new Date(orcamento.created_at), 'dd/MM/yyyy')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleVerDetalhes(orcamento.id);
                                                    }}
                                                    className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1"
                                                >
                                                    Detalhes
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                                        <p className="text-lg font-medium text-gray-500">Nenhum orçamento encontrado.</p>
                                        <p className="mt-1 text-sm text-gray-400">Clique em "Novo Orçamento" para começar.</p>
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