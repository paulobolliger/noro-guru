'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import {
  ArrowLeft,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  AlertCircle,
  Calendar,
  Briefcase,
  PieChart,
  BarChart3,
  Link as LinkIcon,
  Share2
} from 'lucide-react';
import Link from 'next/link';
import { BarChart, Bar, PieChart as RechartsPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AlocacaoRateioModal from '../alocacao-rateio-modal';

interface CentroCustoDetalhesClientProps {
  centroCusto: any;
  rentabilidade: any;
  alocacoesReceitas: any[];
  alocacoesDespesas: any[];
  tenantId: string;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function CentroCustoDetalhesClient({
  centroCusto,
  rentabilidade,
  alocacoesReceitas,
  alocacoesDespesas,
  tenantId,
}: CentroCustoDetalhesClientProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [showAlocacaoModal, setShowAlocacaoModal] = useState(false);

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const getMargemColor = (margem: number) => {
    if (margem >= 15) return 'text-green-600';
    if (margem >= 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Composição de custos por categoria
  const composicaoCustos = useMemo(() => {
    const custosPorCategoria = new Map<string, number>();
    
    alocacoesDespesas.forEach((aloc: any) => {
      const catNome = aloc.categoria?.nome || 'Sem categoria';
      custosPorCategoria.set(catNome, (custosPorCategoria.get(catNome) || 0) + aloc.valor_alocado);
    });

    return Array.from(custosPorCategoria.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [alocacoesDespesas]);

  // Maiores despesas
  const maioresDespesas = useMemo(() => {
    return [...alocacoesDespesas]
      .sort((a, b) => b.valor_alocado - a.valor_alocado)
      .slice(0, 5);
  }, [alocacoesDespesas]);

  const handleDeletar = async () => {
    if (!confirm(`Tem certeza que deseja deletar o projeto: ${centroCusto.nome}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/centros-custo/${centroCusto.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showToast('success', 'Centro de custo deletado com sucesso!');
        router.push('/centros-custo');
      } else {
        const error = await response.json();
        showToast('error', 'Erro ao deletar', error.error || 'Erro desconhecido');
      }
    } catch (error) {
      console.error('Erro ao deletar centro de custo:', error);
      showToast('error', 'Erro ao deletar centro de custo', 'Verifique o console para mais detalhes');
    }
  };

  const atingiuMeta = rentabilidade?.margem_percentual >= centroCusto.meta_margem_percentual;
  const orcamentoEstourado = rentabilidade?.percentual_orcamento_utilizado > 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Link href="/centros-custo" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Voltar para Centro de Custos
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{centroCusto.nome}</h1>
            <Badge className={
              centroCusto.status === 'ativo' ? 'bg-green-100 text-green-800' :
              centroCusto.status === 'concluido' ? 'bg-gray-100 text-gray-800' :
              centroCusto.status === 'planejamento' ? 'bg-blue-100 text-blue-800' :
              'bg-red-100 text-red-800'
            }>
              {centroCusto.status}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Briefcase className="h-4 w-4" />
              {centroCusto.codigo}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatarData(centroCusto.data_inicio)}
              {centroCusto.data_fim && ` → ${formatarData(centroCusto.data_fim)}`}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAlocacaoModal(true)}>
            <Share2 className="h-4 w-4 mr-2" />
            Gerenciar Alocações
          </Button>
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button variant="outline" onClick={handleDeletar}>
            <Trash2 className="h-4 w-4 mr-2" />
            Deletar
          </Button>
        </div>
      </div>

      {/* Alertas */}
      {(!atingiuMeta || orcamentoEstourado) && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-semibold text-yellow-900">Atenção Necessária</h3>
              <ul className="text-sm text-yellow-800 space-y-1">
                {!atingiuMeta && (
                  <li>• Margem atual ({rentabilidade?.margem_percentual.toFixed(1)}%) está abaixo da meta ({centroCusto.meta_margem_percentual}%)</li>
                )}
                {orcamentoEstourado && (
                  <li>• Orçamento estourado em {(rentabilidade?.percentual_orcamento_utilizado - 100).toFixed(1)}%</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Cards Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Receitas Totais</p>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-600">
            {formatarMoeda(rentabilidade?.receitas_total || 0)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {rentabilidade?.qtd_receitas || 0} item(s)
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Despesas Totais</p>
            <TrendingDown className="h-5 w-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-600">
            {formatarMoeda(rentabilidade?.despesas_total || 0)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {rentabilidade?.qtd_despesas || 0} item(s)
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Margem Líquida</p>
            <DollarSign className="h-5 w-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold">
            {formatarMoeda(rentabilidade?.margem_liquida || 0)}
          </p>
          <p className={`text-sm font-semibold mt-1 ${getMargemColor(rentabilidade?.margem_percentual || 0)}`}>
            {(rentabilidade?.margem_percentual || 0).toFixed(1)}%
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Saldo Orçamento</p>
            <Target className="h-5 w-5 text-blue-500" />
          </div>
          <p className={`text-2xl font-bold ${rentabilidade?.saldo_orcamento >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            {formatarMoeda(rentabilidade?.saldo_orcamento || 0)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {(rentabilidade?.percentual_orcamento_utilizado || 0).toFixed(0)}% utilizado
          </p>
        </div>
      </div>

      {/* Comparativos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Target className="h-5 w-5" />
            Comparativo de Orçamento
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Previsto:</span>
              <span className="font-semibold">{formatarMoeda(centroCusto.orcamento_previsto)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Realizado:</span>
              <span className="font-semibold">{formatarMoeda(rentabilidade?.despesas_total || 0)}</span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between">
                <span className="font-semibold">Diferença:</span>
                <span className={`font-bold ${rentabilidade?.saldo_orcamento >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatarMoeda(rentabilidade?.saldo_orcamento || 0)}
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${
                  (rentabilidade?.percentual_orcamento_utilizado || 0) > 100
                    ? 'bg-red-500'
                    : (rentabilidade?.percentual_orcamento_utilizado || 0) > 80
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(rentabilidade?.percentual_orcamento_utilizado || 0, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Comparativo de Meta
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Meta de Margem:</span>
              <span className="font-semibold">{centroCusto.meta_margem_percentual}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Margem Atual:</span>
              <span className={`font-semibold ${getMargemColor(rentabilidade?.margem_percentual || 0)}`}>
                {(rentabilidade?.margem_percentual || 0).toFixed(1)}%
              </span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between">
                <span className="font-semibold">Status:</span>
                <Badge className={atingiuMeta ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {atingiuMeta ? '✓ Meta Atingida' : '✗ Abaixo da Meta'}
                </Badge>
              </div>
            </div>
            <div className="text-center py-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Diferença</p>
              <p className={`text-2xl font-bold ${atingiuMeta ? 'text-green-600' : 'text-red-600'}`}>
                {atingiuMeta ? '+' : ''}{((rentabilidade?.margem_percentual || 0) - centroCusto.meta_margem_percentual).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Composição de Custos */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Composição de Custos
          </h3>
          {composicaoCustos.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPie>
                <Pie
                  data={composicaoCustos}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {composicaoCustos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatarMoeda(value)} />
              </RechartsPie>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-muted-foreground py-8">Nenhuma despesa alocada</p>
          )}
        </div>

        {/* Maiores Despesas */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Top 5 Maiores Despesas
          </h3>
          {maioresDespesas.length > 0 ? (
            <div className="space-y-3">
              {maioresDespesas.map((aloc, index) => (
                <div key={aloc.id} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{aloc.despesa?.descricao}</p>
                    <p className="text-xs text-muted-foreground">
                      {aloc.categoria?.nome || 'Sem categoria'}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-red-600">
                    {formatarMoeda(aloc.valor_alocado)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">Nenhuma despesa alocada</p>
          )}
        </div>
      </div>

      {/* Tabelas de Alocações */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Receitas Alocadas */}
        <div className="bg-white rounded-lg shadow border">
          <div className="p-6 border-b">
            <h3 className="font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Receitas Alocadas ({alocacoesReceitas.length})
            </h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {alocacoesReceitas.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Descrição</th>
                    <th className="text-right text-xs font-medium text-muted-foreground p-3">Valor Alocado</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {alocacoesReceitas.map((aloc) => (
                    <tr key={aloc.id} className="hover:bg-gray-50">
                      <td className="p-3">
                        <p className="text-sm font-medium">{aloc.receita?.descricao}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatarData(aloc.receita?.data_competencia)}
                        </p>
                      </td>
                      <td className="p-3 text-right">
                        <p className="text-sm font-semibold text-green-600">
                          {formatarMoeda(aloc.valor_alocado)}
                        </p>
                        {aloc.percentual_alocacao && (
                          <p className="text-xs text-muted-foreground">
                            {aloc.percentual_alocacao}%
                          </p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-muted-foreground py-8">Nenhuma receita alocada</p>
            )}
          </div>
        </div>

        {/* Despesas Alocadas */}
        <div className="bg-white rounded-lg shadow border">
          <div className="p-6 border-b">
            <h3 className="font-semibold flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              Despesas Alocadas ({alocacoesDespesas.length})
            </h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {alocacoesDespesas.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left text-xs font-medium text-muted-foreground p-3">Descrição</th>
                    <th className="text-right text-xs font-medium text-muted-foreground p-3">Valor Alocado</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {alocacoesDespesas.map((aloc) => (
                    <tr key={aloc.id} className="hover:bg-gray-50">
                      <td className="p-3">
                        <p className="text-sm font-medium">{aloc.despesa?.descricao}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatarData(aloc.despesa?.data_competencia)} • {aloc.categoria?.nome || 'Sem categoria'}
                        </p>
                      </td>
                      <td className="p-3 text-right">
                        <p className="text-sm font-semibold text-red-600">
                          {formatarMoeda(aloc.valor_alocado)}
                        </p>
                        {aloc.percentual_alocacao && (
                          <p className="text-xs text-muted-foreground">
                            {aloc.percentual_alocacao}%
                          </p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-muted-foreground py-8">Nenhuma despesa alocada</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Alocação */}
      <AlocacaoRateioModal
        centroCusto={centroCusto}
        open={showAlocacaoModal}
        onOpenChange={setShowAlocacaoModal}
      />
    </div>
  );
}
