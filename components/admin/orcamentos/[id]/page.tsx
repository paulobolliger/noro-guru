// components/admin/orcamentos/OrcamentoDetalhes.tsx
'use client';

import { useState, useTransition, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Plane, Calendar, DollarSign, Edit, Send, Download, CheckCircle, XCircle, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import type { Database } from '@/types/supabase';
import { format } from 'date-fns';
import { updateOrcamento, deleteOrcamento } from '@/app/admin/(protected)/orcamentos/orcamentos-actions';

// Tipos baseados nas estruturas do projeto
type OrcamentoRow = Database['public']['Tables']['noro_orcamentos']['Row'] & {
    lead?: { id: string; nome: string } | null;
};
type OrcamentoStatus = Database['public']['Enums']['orcamento_status'];
type OrcamentoItem = {
    id: string;
    tipo: 'Aéreo' | 'Hospedagem' | 'Transfer' | 'Passeio' | 'Seguro' | 'Outro';
    descricao: string;
    valor_net: number;
    comissao_percentual: number;
    valor_final: number;
};

interface OrcamentoDetalhesProps {
    orcamento: OrcamentoRow;
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
    return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value);
};

export default function OrcamentoDetalhes({ orcamento }: OrcamentoDetalhesProps) {
    const router = useRouter();
    const [statusOrcamento, setStatusOrcamento] = useState<OrcamentoStatus>(orcamento.status as OrcamentoStatus);
    const [isStatusPending, startStatusTransition] = useTransition();
    const [isDeletePending, startDeleteTransition] = useTransition();
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    // Converte o campo itens (JSONB) para o array de itens
    const itens: OrcamentoItem[] = useMemo(() => {
        try {
            return (orcamento.itens as OrcamentoItem[]) || [];
        } catch {
            return [];
        }
    }, [orcamento.itens]);
    
    const totalComissao = useMemo(() => {
        return itens.reduce((acc, item) => acc + (item.valor_final - item.valor_net), 0);
    }, [itens]);

    const handleStatusChange = (newStatus: OrcamentoStatus) => {
        setStatusMessage(null);
        startStatusTransition(async () => {
            const formData = new FormData();
            formData.append('status', newStatus);
            formData.append('titulo', orcamento.titulo); // Requerido na action
            formData.append('valor_total', String(orcamento.valor_total)); // Requerido na action

            const result = await updateOrcamento(orcamento.id, formData);
            if (result.success) {
                setStatusOrcamento(newStatus);
                setStatusMessage(`Status atualizado para ${statusColorMap[newStatus].label}!`);
                router.refresh();
            } else {
                setStatusMessage(result.message);
            }
        });
    };
    
    const handleDelete = () => {
        if (!confirm('Tem certeza que deseja deletar este orçamento? Esta ação é irreversível.')) {
            return;
        }
        startDeleteTransition(async () => {
            const result = await deleteOrcamento(orcamento.id);
            if (result.success) {
                router.push('/admin/orcamentos');
            } else {
                setStatusMessage(result.message);
            }
        });
    };
    
    // Configuração de Status Atual
    const statusConfig = statusColorMap[statusOrcamento] || statusColorMap.rascunho;

    return (
        <div className="space-y-6">
            
            {/* Header e Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <FileText size={32} className="text-blue-600" />
                        <div>
                            <p className="text-sm text-gray-500">Orçamento # {orcamento.numero_orcamento || orcamento.id.substring(0, 8)}</p>
                            <h1 className="text-3xl font-bold text-gray-900">{orcamento.titulo}</h1>
                        </div>
                    </div>
                    
                    {/* Ações Rápidas */}
                    <div className="flex items-center gap-2">
                        <select 
                            value={statusOrcamento}
                            onChange={(e) => handleStatusChange(e.target.value as OrcamentoStatus)}
                            disabled={isStatusPending}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg border-2 ${statusConfig.bg} ${statusConfig.text}`}
                        >
                            {Object.entries(statusColorMap).map(([key, config]) => (
                                <option key={key} value={key} className={config.text}>
                                    {config.label}
                                </option>
                            ))}
                        </select>
                        <button className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 flex items-center gap-2" title="Converte Orçamento em Pedido">
                            <CheckCircle size={18} /> Converter em Venda
                        </button>
                        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                            <Send size={18} /> Enviar Proposta
                        </button>
                        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-2">
                            <Download size={18} /> Gerar PDF
                        </button>
                        <button onClick={handleDelete} disabled={isDeletePending} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 flex items-center gap-2">
                            {isDeletePending ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                        </button>
                    </div>
                </div>
            </div>
            
            {statusMessage && (
                <div className={`p-4 rounded-lg flex items-center gap-2 ${statusMessage.includes('Erro') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    <AlertCircle size={20} />
                    {statusMessage}
                </div>
            )}

            {/* Metricas principais */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Valor Venda</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(orcamento.valor_total)}</p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Margem / Comissão</p>
                    <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalComissao)}</p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Cliente</p>
                    <p className="text-2xl font-bold text-gray-900">{orcamento.lead?.nome || 'N/D'}</p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Expira em</p>
                    <p className="text-2xl font-bold text-orange-500">
                        {orcamento.validade_ate ? format(new Date(orcamento.validade_ate), 'dd/MM/yyyy') : 'N/D'}
                    </p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Coluna Principal - Itens */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Itens da Proposta ({itens.length})</h2>
                        
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Valor Venda</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {itens.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                    {item.tipo}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{item.descricao}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-green-600">
                                                {formatCurrency(item.valor_final)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Termos e Condições</h2>
                        <p className="whitespace-pre-wrap text-gray-700 text-sm">{orcamento.termos_condicoes || 'Nenhum termo e condição definido para este orçamento.'}</p>
                    </div>

                </div>

                {/* Coluna Lateral - Informações Rápidas */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Detalhes da Viagem</h2>
                        <div className="space-y-3 text-sm text-gray-700">
                            <p className="flex items-center gap-2"><Calendar size={16} className="text-blue-500" /> Duração: {orcamento.num_dias} dias</p>
                            <p className="flex items-center gap-2"><User size={16} className="text-blue-500" /> Pessoas: {orcamento.num_pessoas}</p>
                            <p className="flex items-center gap-2"><Plane size={16} className="text-blue-500" /> Período: {orcamento.data_viagem_inicio} a {orcamento.data_viagem_fim}</p>
                            <p className="flex items-center gap-2"><DollarSign size={16} className="text-blue-500" /> Sinal Necessário: {formatCurrency(orcamento.valor_sinal)}</p>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações Avançadas</h2>
                        <div className="space-y-3">
                             <button onClick={() => router.push(`/admin/orcamentos/${orcamento.id}/editar`)} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-yellow-100 rounded-lg hover:bg-yellow-200">
                                <Edit size={18} /> Editar Conteúdo
                            </button>
                            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                                <RefreshCw size={18} /> Duplicar Orçamento
                            </button>
                            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600/80 rounded-lg hover:bg-red-700">
                                <XCircle size={18} /> Marcar como Perdido
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
}