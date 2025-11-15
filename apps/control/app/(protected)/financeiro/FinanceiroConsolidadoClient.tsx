"use client";

import { useState, useMemo } from 'react';
import NCard from '@/components/ui/NCard';
import { Download, Search, ArrowUpDown, ExternalLink, CheckCircle, XCircle } from 'lucide-react';
import NInput from '@/components/ui/n-input';
import NButton from '@/components/ui/n-button';

interface MetricaTenant {
  tenant_id: string;
  tenant_name: string;
  tenant_slug: string;
  schema_provisionado: boolean;
  receitas_total: number;
  despesas_total: number;
  lucro: number;
  margem_lucro: number;
  duplicatas_receber_pendentes: number;
  duplicatas_pagar_pendentes: number;
  error?: string;
}

interface Periodo {
  tipo: string;
  data_inicio: string;
  data_fim: string;
}

export default function FinanceiroConsolidadoClient({
  metricasPorTenant,
  periodo,
}: {
  metricasPorTenant: MetricaTenant[];
  periodo: Periodo;
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof MetricaTenant>('tenant_name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  // Filtrar e ordenar dados
  const filteredAndSorted = useMemo(() => {
    let result = [...metricasPorTenant];

    // Filtrar por termo de busca
    if (searchTerm) {
      result = result.filter(
        (tenant) =>
          tenant.tenant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tenant.tenant_slug.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Ordenar
    result.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return result;
  }, [metricasPorTenant, searchTerm, sortField, sortDirection]);

  const handleSort = (field: keyof MetricaTenant) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleExport = () => {
    // Exportar para CSV
    const headers = [
      'Tenant',
      'Slug',
      'Schema Provisionado',
      'Receitas',
      'Despesas',
      'Lucro',
      'Margem Lucro',
      'Duplicatas a Receber',
      'Duplicatas a Pagar',
    ];

    const rows = filteredAndSorted.map((tenant) => [
      tenant.tenant_name,
      tenant.tenant_slug,
      tenant.schema_provisionado ? 'Sim' : 'Não',
      tenant.receitas_total,
      tenant.despesas_total,
      tenant.lucro,
      tenant.margem_lucro,
      tenant.duplicatas_receber_pendentes,
      tenant.duplicatas_pagar_pendentes,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `financeiro-consolidado-${periodo.tipo}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-6 space-y-4">
      {/* Filtros e Ações */}
      <NCard className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 w-full md:max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome ou slug do tenant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-[#4aede5] focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <NButton onClick={handleExport} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar CSV
            </NButton>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Período: <span className="font-semibold">{periodo.tipo}</span>
          {periodo.data_inicio && (
            <>
              {' '}
              | De {formatDate(periodo.data_inicio)} até {formatDate(periodo.data_fim)}
            </>
          )}
        </div>
      </NCard>

      {/* Tabela de Métricas */}
      <NCard>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left p-4 font-semibold text-gray-700 dark:text-gray-300">
                  <button
                    onClick={() => handleSort('tenant_name')}
                    className="flex items-center gap-2 hover:text-[#4aede5] transition-colors"
                  >
                    Tenant
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="text-center p-4 font-semibold text-gray-700 dark:text-gray-300">
                  Schema
                </th>
                <th className="text-right p-4 font-semibold text-gray-700 dark:text-gray-300">
                  <button
                    onClick={() => handleSort('receitas_total')}
                    className="flex items-center gap-2 ml-auto hover:text-[#4aede5] transition-colors"
                  >
                    Receitas
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="text-right p-4 font-semibold text-gray-700 dark:text-gray-300">
                  <button
                    onClick={() => handleSort('despesas_total')}
                    className="flex items-center gap-2 ml-auto hover:text-[#4aede5] transition-colors"
                  >
                    Despesas
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="text-right p-4 font-semibold text-gray-700 dark:text-gray-300">
                  <button
                    onClick={() => handleSort('lucro')}
                    className="flex items-center gap-2 ml-auto hover:text-[#4aede5] transition-colors"
                  >
                    Lucro
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="text-right p-4 font-semibold text-gray-700 dark:text-gray-300">
                  Margem
                </th>
                <th className="text-right p-4 font-semibold text-gray-700 dark:text-gray-300">
                  A Receber
                </th>
                <th className="text-right p-4 font-semibold text-gray-700 dark:text-gray-300">
                  A Pagar
                </th>
                <th className="text-center p-4 font-semibold text-gray-700 dark:text-gray-300">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSorted.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center p-8 text-gray-500 dark:text-gray-400">
                    {searchTerm
                      ? 'Nenhum tenant encontrado com os critérios de busca.'
                      : 'Nenhum tenant ativo encontrado.'}
                  </td>
                </tr>
              ) : (
                filteredAndSorted.map((tenant) => (
                  <tr
                    key={tenant.tenant_id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="p-4">
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100">
                          {tenant.tenant_name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {tenant.tenant_slug}.noro.guru
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      {tenant.schema_provisionado ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-400 mx-auto" />
                      )}
                    </td>
                    <td className="p-4 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(tenant.receitas_total)}
                    </td>
                    <td className="p-4 text-right font-semibold text-orange-600 dark:text-orange-400">
                      {formatCurrency(tenant.despesas_total)}
                    </td>
                    <td
                      className={`p-4 text-right font-semibold ${
                        tenant.lucro >= 0
                          ? 'text-[#4aede5]'
                          : 'text-red-500 dark:text-red-400'
                      }`}
                    >
                      {formatCurrency(tenant.lucro)}
                    </td>
                    <td className="p-4 text-right text-gray-700 dark:text-gray-300">
                      {formatPercentage(tenant.margem_lucro)}
                    </td>
                    <td className="p-4 text-right text-gray-700 dark:text-gray-300">
                      {formatCurrency(tenant.duplicatas_receber_pendentes)}
                    </td>
                    <td className="p-4 text-right text-gray-700 dark:text-gray-300">
                      {formatCurrency(tenant.duplicatas_pagar_pendentes)}
                    </td>
                    <td className="p-4 text-center">
                      <a
                        href={`https://${tenant.tenant_slug}.noro.guru`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#4aede5] hover:text-[#3dbcb0] transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Resumo da Tabela */}
        {filteredAndSorted.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Mostrando <span className="font-semibold text-gray-900 dark:text-gray-100">{filteredAndSorted.length}</span> de{' '}
              <span className="font-semibold text-gray-900 dark:text-gray-100">{metricasPorTenant.length}</span> tenants
            </div>
          </div>
        )}
      </NCard>
    </div>
  );
}
