// app/admin/(protected)/custos/all/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Loader2, Sparkles, DollarSign, FileText, TrendingUp } from 'lucide-react';
import { COST_PERIODS } from '@/lib/constants';
import { formatCost } from '@/lib/utils/cost-calculator';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TYPE_LABELS = {
  site_roteiro: 'Roteiros do Site',
  admin_proposta: 'Propostas Admin',
  bulk_roteiro: 'Bulk Roteiros',
  bulk_artigo: 'Bulk Artigos',
};

const TYPE_COLORS = {
  site_roteiro: '#3b82f6',
  admin_proposta: '#10b981',
  bulk_roteiro: '#a855f7',
  bulk_artigo: '#f59e0b',
};

export default function CustosAllPage() {
  const [period, setPeriod] = useState<keyof typeof COST_PERIODS>('30d');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [period]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/costs/all?period=${period}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center text-gray-500 py-12">
        Erro ao carregar dados
      </div>
    );
  }

  // Preparar dados do gráfico de pizza
  const pieData = Object.entries(data.byType || {}).map(([type, info]: [string, any]) => ({
    name: TYPE_LABELS[type as keyof typeof TYPE_LABELS] || type,
    value: info.total_cost,
    count: info.count,
    color: TYPE_COLORS[type as keyof typeof TYPE_COLORS] || '#gray',
  }));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Sparkles className="text-purple-600" size={32} />
            Análise Consolidada de Custos AI
          </h1>
          <p className="text-gray-600 mt-2">
            Todas as gerações: site, propostas admin e bulk generation
          </p>
        </div>

        {/* Filtro de Período */}
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as keyof typeof COST_PERIODS)}
          className="px-4 py-2 border rounded-lg bg-white"
        >
          {Object.entries(COST_PERIODS).map(([key, value]) => (
            <option key={key} value={key}>
              {value.label}
            </option>
          ))}
        </select>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <DollarSign size={24} className="opacity-80" />
          </div>
          <div className="text-3xl font-bold">
            {formatCost(data.metrics.totalCost)}
          </div>
          <div className="text-sm opacity-90 mt-1">Custo Total</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <FileText size={24} className="opacity-80" />
          </div>
          <div className="text-3xl font-bold">{data.metrics.totalItems}</div>
          <div className="text-sm opacity-90 mt-1">Gerações Totais</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp size={24} className="opacity-80" />
          </div>
          <div className="text-3xl font-bold">
            {formatCost(data.metrics.avgCostPerItem)}
          </div>
          <div className="text-sm opacity-90 mt-1">Custo Médio/Item</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <DollarSign size={24} className="opacity-80" />
          </div>
          <div className="text-2xl font-bold">
            {formatCost(data.metrics.totalTextCost)}
          </div>
          <div className="text-xs opacity-90 mt-1">Texto</div>
          <div className="text-2xl font-bold mt-2">
            {formatCost(data.metrics.totalImageCost)}
          </div>
          <div className="text-xs opacity-90 mt-1">Imagem</div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Linha - Evolução */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4">Evolução Diária de Custos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.dailyChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="total_cost" stroke="#8b5cf6" strokeWidth={2} name="Custo Total" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Pizza - Distribuição por Tipo */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4">Distribuição por Tipo de Geração</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => formatCost(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabela por Tipo */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white">
          <h3 className="text-lg font-bold">Detalhamento por Tipo de Geração</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tipo</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Quantidade</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Custo Texto</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Custo Imagem</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Custo Total</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Média/Item</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Object.entries(data.byType || {}).map(([type, info]: [string, any]) => (
                <tr key={type} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {TYPE_LABELS[type as keyof typeof TYPE_LABELS] || type}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-600">{info.count}</td>
                  <td className="px-4 py-3 text-sm text-right font-mono text-gray-900">
                    {formatCost(info.text_cost)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-mono text-gray-900">
                    {formatCost(info.image_cost)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-bold font-mono text-blue-600">
                    {formatCost(info.total_cost)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-mono text-gray-600">
                    {formatCost(info.total_cost / info.count)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
