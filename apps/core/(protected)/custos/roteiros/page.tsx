// apps/core/(protected)/custos/roteiros/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Loader2, Map, DollarSign, FileText, TrendingUp } from 'lucide-react';
import CostTable from '@/components/dashboard/CostTable';
import CostChart from '@/components/dashboard/CostChart';
import { COST_PERIODS } from '@/lib/constants';
import { formatCost } from '@/lib/utils/cost-calculator';

export default function CustosRoteirosPage() {
  const [period, setPeriod] = useState<keyof typeof COST_PERIODS>('30d');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [period]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/costs/roteiros?period=${period}`);
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Map className="text-blue-600" size={32} />
            Análise de Custos - Roteiros
          </h1>
          <p className="text-gray-600 mt-2">
            Análise detalhada dos custos de geração de roteiros com IA
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
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <DollarSign size={24} className="opacity-80" />
          </div>
          <div className="text-3xl font-bold">
            {formatCost(data.metrics.totalCost)}
          </div>
          <div className="text-sm opacity-90 mt-1">Custo Total</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <FileText size={24} className="opacity-80" />
          </div>
          <div className="text-3xl font-bold">{data.metrics.totalItems}</div>
          <div className="text-sm opacity-90 mt-1">Roteiros Gerados</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
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
      <CostChart
        dailyData={data.dailyChart}
        textCostTotal={data.metrics.totalTextCost}
        imageCostTotal={data.metrics.totalImageCost}
      />

      {/* Tabela Detalhada */}
      <CostTable items={data.items} totalCost={data.metrics.totalCost} />
    </div>
  );
}
