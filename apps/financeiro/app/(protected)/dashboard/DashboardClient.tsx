'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Wallet, AlertCircle } from 'lucide-react';
import type { FinKPIs } from '@/types/financeiro';
import { formatCurrency } from '@/lib/utils';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface DashboardClientProps {
  kpis: FinKPIs;
  graficos: {
    receitasVsDespesas: {
      labels: string[];
      receitas: number[];
      despesas: number[];
    };
    receitasPorMarca: {
      marca: string;
      valor: number;
    }[];
  };
}

interface KPICardProps {
  titulo: string;
  valor: string;
  variacao?: number;
  icone: React.ReactNode;
  cor: string;
  subtitulo?: string;
}

function KPICard({ titulo, valor, variacao, icone, cor, subtitulo }: KPICardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{titulo}</p>
          <p className="text-2xl font-bold mt-2">{valor}</p>
          {subtitulo && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitulo}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${cor}`}>{icone}</div>
      </div>
      {variacao !== undefined && (
        <div className="mt-4 flex items-center gap-1">
          {variacao >= 0 ? (
            <>
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-500">+{variacao.toFixed(1)}%</span>
            </>
          ) : (
            <>
              <TrendingDown className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-500">{variacao.toFixed(1)}%</span>
            </>
          )}
          <span className="text-xs text-gray-500 ml-1">vs mês anterior</span>
        </div>
      )}
    </div>
  );
}

const MARCAS_CORES = {
  nomade: '#10b981',
  safetrip: '#3b82f6',
  vistos: '#8b5cf6',
  noro: '#f59e0b',
  outros: '#6b7280',
};

export default function DashboardClient({ kpis, graficos }: DashboardClientProps) {
  const [periodoSelecionado, setPeriodoSelecionado] = useState<'mes' | 'ano'>('mes');

  // Preparar dados para o gráfico de Receitas vs Despesas
  const dadosReceitasVsDespesas = graficos.receitasVsDespesas.labels.map((label, index) => ({
    mes: label,
    receitas: graficos.receitasVsDespesas.receitas[index],
    despesas: graficos.receitasVsDespesas.despesas[index],
    lucro:
      graficos.receitasVsDespesas.receitas[index] -
      graficos.receitasVsDespesas.despesas[index],
  }));

  // Preparar dados para o gráfico de pizza
  const dadosPizza = graficos.receitasPorMarca.map((item) => ({
    name: item.marca.charAt(0).toUpperCase() + item.marca.slice(1),
    value: item.valor,
    color: MARCAS_CORES[item.marca as keyof typeof MARCAS_CORES] || MARCAS_CORES.outros,
  }));

  const valorExibido = periodoSelecionado === 'mes' ? kpis.receita_total_mes : kpis.receita_total_ano;
  const despesaExibida = periodoSelecionado === 'mes' ? kpis.despesa_total_mes : kpis.despesa_total_ano;
  const lucroExibido = periodoSelecionado === 'mes' ? kpis.lucro_liquido_mes : kpis.lucro_liquido_ano;

  return (
    <div className="space-y-6">
      {/* Filtro de período */}
      <div className="flex gap-2">
        <button
          onClick={() => setPeriodoSelecionado('mes')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            periodoSelecionado === 'mes'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Este Mês
        </button>
        <button
          onClick={() => setPeriodoSelecionado('ano')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            periodoSelecionado === 'ano'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Este Ano
        </button>
      </div>

      {/* Grid de KPIs principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          titulo="Receita Total"
          valor={formatCurrency(valorExibido)}
          icone={<DollarSign className="w-6 h-6 text-white" />}
          cor="bg-gradient-to-br from-green-500 to-green-600"
          subtitulo={periodoSelecionado === 'mes' ? 'Neste mês' : 'Neste ano'}
        />
        <KPICard
          titulo="Despesas"
          valor={formatCurrency(despesaExibida)}
          icone={<CreditCard className="w-6 h-6 text-white" />}
          cor="bg-gradient-to-br from-red-500 to-red-600"
          subtitulo={periodoSelecionado === 'mes' ? 'Neste mês' : 'Neste ano'}
        />
        <KPICard
          titulo="Lucro Líquido"
          valor={formatCurrency(lucroExibido)}
          icone={<TrendingUp className="w-6 h-6 text-white" />}
          cor={
            lucroExibido >= 0
              ? 'bg-gradient-to-br from-blue-500 to-blue-600'
              : 'bg-gradient-to-br from-orange-500 to-orange-600'
          }
          subtitulo={`Margem: ${kpis.margem_lucro.toFixed(1)}%`}
        />
        <KPICard
          titulo="Saldo Atual"
          valor={formatCurrency(kpis.saldo_atual)}
          icone={<Wallet className="w-6 h-6 text-white" />}
          cor="bg-gradient-to-br from-purple-500 to-purple-600"
          subtitulo="Todas as contas"
        />
      </div>

      {/* Grid de KPIs secundários */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          titulo="MRR"
          valor={formatCurrency(kpis.mrr)}
          icone={<DollarSign className="w-5 h-5 text-white" />}
          cor="bg-gradient-to-br from-cyan-500 to-cyan-600"
          subtitulo="Receita recorrente mensal"
        />
        <KPICard
          titulo="ARR"
          valor={formatCurrency(kpis.arr)}
          icone={<DollarSign className="w-5 h-5 text-white" />}
          cor="bg-gradient-to-br from-indigo-500 to-indigo-600"
          subtitulo="Receita recorrente anual"
        />
        <KPICard
          titulo="Ticket Médio"
          valor={formatCurrency(kpis.ticket_medio)}
          icone={<CreditCard className="w-5 h-5 text-white" />}
          cor="bg-gradient-to-br from-pink-500 to-pink-600"
        />
        <KPICard
          titulo="Projeção 30 dias"
          valor={formatCurrency(kpis.projecao_30_dias)}
          icone={<TrendingUp className="w-5 h-5 text-white" />}
          cor="bg-gradient-to-br from-teal-500 to-teal-600"
        />
      </div>

      {/* Alertas */}
      {(kpis.contas_atrasadas_receber > 0 || kpis.contas_atrasadas_pagar > 0) && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-orange-800 dark:text-orange-200">
                Atenção: Contas em Atraso
              </h3>
              <ul className="mt-2 space-y-1 text-sm text-orange-700 dark:text-orange-300">
                {kpis.contas_atrasadas_receber > 0 && (
                  <li>
                    • {kpis.contas_atrasadas_receber} conta(s) a receber atrasada(s) -{' '}
                    {formatCurrency(kpis.contas_receber)}
                  </li>
                )}
                {kpis.contas_atrasadas_pagar > 0 && (
                  <li>
                    • {kpis.contas_atrasadas_pagar} conta(s) a pagar atrasada(s) -{' '}
                    {formatCurrency(kpis.contas_pagar)}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Receitas vs Despesas */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-4">Receitas vs Despesas (6 meses)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dadosReceitasVsDespesas}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="mes" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Legend />
              <Bar dataKey="receitas" fill="#10b981" name="Receitas" radius={[8, 8, 0, 0]} />
              <Bar dataKey="despesas" fill="#ef4444" name="Despesas" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Receitas por Marca */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-4">Receitas por Marca</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dadosPizza}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {dadosPizza.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Tendência de Lucro */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Tendência de Lucro (6 meses)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dadosReceitasVsDespesas}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="mes" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="lucro"
                stroke="#3b82f6"
                strokeWidth={3}
                name="Lucro"
                dot={{ fill: '#3b82f6', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Resumo de contas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            Contas a Receber
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Total pendente</span>
              <span className="font-semibold">{formatCurrency(kpis.contas_receber)}</span>
            </div>
            {kpis.contas_atrasadas_receber > 0 && (
              <div className="flex justify-between items-center text-orange-600">
                <span>Contas atrasadas</span>
                <span className="font-semibold">{kpis.contas_atrasadas_receber}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-red-500" />
            Contas a Pagar
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Total pendente</span>
              <span className="font-semibold">{formatCurrency(kpis.contas_pagar)}</span>
            </div>
            {kpis.contas_atrasadas_pagar > 0 && (
              <div className="flex justify-between items-center text-orange-600">
                <span>Contas atrasadas</span>
                <span className="font-semibold">{kpis.contas_atrasadas_pagar}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
