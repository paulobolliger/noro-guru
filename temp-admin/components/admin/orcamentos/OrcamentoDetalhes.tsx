// components/admin/orcamentos/OrcamentoDetalhes.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRightIcon,
  Calendar,
  Users,
  MapPin,
  Clock,
  Euro,
  FileText,
  Tag,
  User,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { convertToPedido } from '@/app/admin/(protected)/pedidos/pedidos-actions';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import type { Database } from '@/types/supabase';

// Tipo local para evitar importações cruzadas
type OrcamentoComItens = Database['public']['Tables']['noro_orcamentos']['Row'] & {
    orcamento_itens: Database['public']['Tables']['noro_orcamentos_itens']['Row'][];
    lead?: { id: string; nome: string } | null;
};

interface OrcamentoDetalhesProps {
  orcamento: OrcamentoComItens;
}

export function OrcamentoDetalhes({ orcamento }: OrcamentoDetalhesProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const isConverted = orcamento.status === 'aceito' || orcamento.status === 'CONVERTIDO'; // 'aceito' também deve bloquear

  const handleConvertToPedido = async () => {
    if (!orcamento.id) {
      toast({ title: 'Erro de ID', description: 'ID do orçamento não encontrado.', variant: 'destructive' });
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await convertToPedido(orcamento.id);
      if (result.success) {
        toast({ title: 'Sucesso!', description: result.message });
        if (result.data?.pedidoId) {
            router.push(`/admin/pedidos/${result.data.pedidoId}`);
        } else {
            router.refresh(); 
        }
      } else {
        toast({ title: 'Erro na Conversão', description: result.message, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Erro Inesperado', description: 'Não foi possível completar a ação.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  // Status badge colors
  const statusColors = {
    rascunho: 'bg-gray-100 text-gray-800',
    enviado: 'bg-blue-100 text-blue-800',
    revisao: 'bg-yellow-100 text-yellow-800',
    aprovado: 'bg-green-100 text-green-800',
    recusado: 'bg-red-100 text-red-800',
    expirado: 'bg-orange-100 text-orange-800',
    aceito: 'bg-emerald-100 text-emerald-800',
    CONVERTIDO: 'bg-emerald-100 text-emerald-800',
  };

  const statusColor = statusColors[orcamento.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6 text-white">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <FileText size={32} />
                  <h1 className="text-3xl font-bold">
                    {orcamento.numero_orcamento || `#${orcamento.id.slice(0, 8)}`}
                  </h1>
                </div>
                <p className="text-blue-100 text-lg">{orcamento.titulo || 'Sem título'}</p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <span className={`px-4 py-2 rounded-lg text-sm font-bold shadow-md ${statusColor} border border-white/20`}>
                  {orcamento.status.toUpperCase()}
                </span>
                {isConverted ? (
                  <Button disabled variant="outline" className="bg-white/10 border-white/30 text-white">
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Já convertido em Venda
                  </Button>
                ) : (
                  <Button
                    onClick={handleConvertToPedido}
                    disabled={isLoading}
                    className="bg-white text-green-600 hover:bg-green-50 font-semibold shadow-lg"
                  >
                    <ArrowRightIcon className="mr-2 h-4 w-4" />
                    {isLoading ? 'A converter...' : 'Converter em Venda'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="text-gray-600" size={20} />
                <h3 className="text-lg font-semibold text-gray-900">Descrição</h3>
              </div>
              <p className="text-gray-700 leading-relaxed">{orcamento.descricao || 'Sem descrição'}</p>
            </div>

            {/* Travel Details Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="text-blue-600" size={20} />
                Detalhes da Viagem
              </h3>

              <div className="space-y-4">
                {/* Destinations */}
                {orcamento.destinos && orcamento.destinos.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 flex items-center gap-2 mb-2">
                      <MapPin size={16} />
                      Destinos
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {orcamento.destinos.map((destino: string, idx: number) => (
                        <span key={idx} className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-200">
                          {destino}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Travel Period */}
                {orcamento.data_viagem_inicio && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="text-xs font-medium text-gray-500 flex items-center gap-1 mb-1">
                        <Calendar size={14} />
                        Data Início
                      </label>
                      <p className="text-base font-semibold text-gray-900">
                        {new Date(orcamento.data_viagem_inicio).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    {orcamento.data_viagem_fim && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <label className="text-xs font-medium text-gray-500 flex items-center gap-1 mb-1">
                          <Calendar size={14} />
                          Data Fim
                        </label>
                        <p className="text-base font-semibold text-gray-900">
                          {new Date(orcamento.data_viagem_fim).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Duration and People */}
                <div className="grid grid-cols-2 gap-4">
                  {orcamento.num_dias && (
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-200">
                      <label className="text-xs font-medium text-orange-700 flex items-center gap-1 mb-1">
                        <Clock size={14} />
                        Duração
                      </label>
                      <p className="text-2xl font-bold text-orange-900">{orcamento.num_dias} <span className="text-sm font-normal">dias</span></p>
                    </div>
                  )}
                  {orcamento.num_pessoas && (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                      <label className="text-xs font-medium text-purple-700 flex items-center gap-1 mb-1">
                        <Users size={14} />
                        Pessoas
                      </label>
                      <p className="text-2xl font-bold text-purple-900">{orcamento.num_pessoas}</p>
                      {orcamento.num_adultos && orcamento.num_criancas && (
                        <p className="text-xs text-purple-600 mt-1">
                          {orcamento.num_adultos} adultos, {orcamento.num_criancas} crianças
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Internal Observations */}
            {orcamento.observacoes_internas && (
              <div className="bg-amber-50 border-l-4 border-amber-400 rounded-lg p-6">
                <div className="flex items-start gap-2">
                  <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <h3 className="text-sm font-semibold text-amber-900 mb-2">Observações Internas</h3>
                    <p className="text-sm text-amber-800 whitespace-pre-wrap">{orcamento.observacoes_internas}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Financial Summary - 1/3 width */}
          <div className="space-y-6">
            {/* Financial Card */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg p-6 border border-green-200">
              <div className="flex items-center gap-2 mb-6">
                <Euro className="text-green-600" size={24} />
                <h3 className="text-lg font-bold text-gray-900">Resumo Financeiro</h3>
              </div>

              <div className="space-y-4">
                {/* Total Value - Highlight */}
                <div className="bg-white rounded-lg p-4 shadow-sm border-2 border-green-300">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 block">
                    Valor Total
                  </label>
                  <p className="text-3xl font-bold text-green-600">
                    {orcamento.moeda || 'EUR'} {orcamento.valor_total?.toFixed(2) || '0.00'}
                  </p>
                </div>

                {/* Cost */}
                {orcamento.valor_custo && (
                  <div className="flex justify-between items-center py-2 border-b border-green-200">
                    <span className="text-sm text-gray-600">Custo</span>
                    <span className="text-base font-semibold text-gray-900">
                      {orcamento.moeda || 'EUR'} {orcamento.valor_custo.toFixed(2)}
                    </span>
                  </div>
                )}

                {/* Profit Margin */}
                {orcamento.margem_lucro && (
                  <div className="bg-green-100 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-green-800">Margem de Lucro</span>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-700">
                          {orcamento.moeda || 'EUR'} {orcamento.margem_lucro.toFixed(2)}
                        </p>
                        {orcamento.margem_percentual && (
                          <p className="text-xs text-green-600">({orcamento.margem_percentual}%)</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Validity */}
              {orcamento.validade_ate && (
                <div className="mt-6 pt-4 border-t border-green-200">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Válido até</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(orcamento.validade_ate).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Priority */}
              {orcamento.prioridade && (
                <div className="mt-4">
                  <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-bold ${
                    orcamento.prioridade === 'alta' ? 'bg-red-500 text-white' :
                    orcamento.prioridade === 'media' ? 'bg-yellow-500 text-white' :
                    'bg-gray-500 text-white'
                  }`}>
                    Prioridade: {orcamento.prioridade.toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Tags */}
            {orcamento.tags && orcamento.tags.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="text-gray-600" size={18} />
                  <h3 className="text-sm font-semibold text-gray-900">Tags</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {orcamento.tags.map((tag: string, idx: number) => (
                    <span key={idx} className="px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Lead Info */}
            {orcamento.lead_id && orcamento.lead && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center gap-2 mb-3">
                  <User className="text-gray-600" size={18} />
                  <h3 className="text-sm font-semibold text-gray-900">Lead Associado</h3>
                </div>
                <p className="text-sm">
                  <span className="font-semibold text-blue-600">{orcamento.lead.nome}</span>
                </p>
                {orcamento.lead.email && (
                  <p className="text-xs text-gray-500 mt-1">{orcamento.lead.email}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Metadata Footer */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-xs text-gray-500 space-y-2">
            <p className="flex items-center gap-2">
              <Calendar size={14} />
              <span className="font-medium">Criado em:</span> {new Date(orcamento.created_at).toLocaleString('pt-BR')}
            </p>
            {orcamento.updated_at && (
              <p className="flex items-center gap-2">
                <Clock size={14} />
                <span className="font-medium">Atualizado em:</span> {new Date(orcamento.updated_at).toLocaleString('pt-BR')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrcamentoDetalhes;
