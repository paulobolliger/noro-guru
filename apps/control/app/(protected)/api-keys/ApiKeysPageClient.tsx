"use client";
import { useState, useMemo } from "react";
import PageContainer from "@/components/layout/PageContainer";
import ApiKeysTableClient from './ApiKeysTableClient';
import { ApiKeyCreateForm } from './ApiKeyActions';
import { Key, Search, Plus, Activity, Clock, AlertTriangle, TrendingUp } from 'lucide-react';

interface ApiKey {
  id: string;
  name: string;
  last4: string;
  scope: string[] | string;
  expires_at?: string;
  created_at: string;
  tenant_id?: string;
}

interface ApiKeysPageClientProps {
  keys: ApiKey[];
  usageByKey: Record<string, any[]>;
  createAction: (formData: FormData) => Promise<void>;
  revokeAction: (formData: FormData) => Promise<void>;
}

export default function ApiKeysPageClient({ 
  keys, 
  usageByKey, 
  createAction, 
  revokeAction 
}: ApiKeysPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUsageTable, setShowUsageTable] = useState(false);
  const [metricPeriod, setMetricPeriod] = useState<1 | 7 | 30 | 90>(7);

  // Calcular métricas
  const metrics = useMemo(() => {
    const now = new Date();
    const periodStart = new Date(now);
    periodStart.setDate(periodStart.getDate() - metricPeriod);

    let totalRequests = 0;
    let totalMs = 0;
    let totalErrors = 0;
    let requestCount = 0;

    Object.values(usageByKey).forEach((usageArr) => {
      usageArr.forEach((row: any) => {
        const rowDate = new Date(row.day);
        if (rowDate >= periodStart) {
          totalRequests += Number(row.calls || 0);
          totalMs += Number(row.avg_ms || 0) * Number(row.calls || 0);
          totalErrors += Number(row.errors || 0);
          requestCount += Number(row.calls || 0);
        }
      });
    });

    const activeKeys = keys.filter(k => {
      if (!k.expires_at) return true;
      return new Date(k.expires_at) > now;
    }).length;

    const expiredKeys = keys.length - activeKeys;
    const avgResponseTime = requestCount > 0 ? Math.round(totalMs / requestCount) : 0;
    const errorRate = totalRequests > 0 ? ((totalErrors / totalRequests) * 100).toFixed(2) : '0.00';

    return {
      totalKeys: keys.length,
      activeKeys,
      expiredKeys,
      totalRequests,
      avgResponseTime,
      errorRate,
    };
  }, [keys, usageByKey, metricPeriod]);

  // Filtrar keys por busca
  const filteredKeys = useMemo(() => {
    if (!searchQuery.trim()) return keys;
    
    const query = searchQuery.toLowerCase();
    return keys.filter((key) => 
      key.name.toLowerCase().includes(query) ||
      key.last4.toLowerCase().includes(query) ||
      (Array.isArray(key.scope) ? key.scope : [key.scope]).some(s => 
        String(s).toLowerCase().includes(query)
      )
    );
  }, [keys, searchQuery]);

  return (
    <PageContainer>
      {/* Header com busca */}
      <div className="sticky top-0 z-30 mb-6">
        <div
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 max-w-[1200px] mx-auto px-4 md:px-6 py-4 rounded-xl shadow-md"
          style={{ background: 'linear-gradient(135deg, rgba(59, 44, 164, 0.94), rgba(35, 33, 79, 0.92))' }}
        >
          <div className="flex items-center gap-3 flex-shrink-0">
            <Key size={28} className="text-[#D4AF37]" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-[#D4AF37] tracking-tight">API Keys</h1>
              <p className="text-sm text-gray-300 mt-1">Crie e revogue chaves por tenant.</p>
            </div>
          </div>

          {/* Search Icon/Input */}
          <div className="flex items-center gap-2">
            {!searchExpanded && (
              <button
                onClick={() => setSearchExpanded(true)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Expandir busca"
              >
                <Search size={20} className="text-[#D4AF37]" />
              </button>
            )}
            {searchExpanded && (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nome, last4 ou scope..."
                  className="px-3 py-2 rounded-lg border-2 border-[#D4AF37] dark:border-[#4aede5] bg-white/10 backdrop-blur-sm text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] dark:focus:ring-[#4aede5] w-64"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setSearchExpanded(false);
                    setSearchQuery("");
                  }}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Botão Nova API Key */}
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#E6C25A] hover:from-[#E6C25A] hover:to-[#D4AF37] text-[#1a1625] font-bold rounded-lg transition-all hover:scale-105 shadow-lg"
            >
              <Plus size={18} />
              <span className="hidden md:inline">Nova API Key</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="mb-6">
        {/* Seletor de período + Toggle Uso Detalhado */}
        <div className="flex justify-between items-center mb-3">
          {/* Toggle Uso Detalhado */}
          <button
            onClick={() => setShowUsageTable(!showUsageTable)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
              showUsageTable
                ? 'bg-[#4aede5] border-[#4aede5] text-[#1a1625] font-bold'
                : 'bg-transparent border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-[#4aede5] hover:text-[#4aede5]'
            }`}
          >
            <TrendingUp size={18} />
            <span className="text-sm">{showUsageTable ? 'Ocultar' : 'Mostrar'} Uso Detalhado</span>
          </button>

          {/* Seletor de período */}
          <div className="inline-flex gap-1 p-1 bg-gray-100 dark:bg-[#1a1625] rounded-lg border-2 border-gray-200 dark:border-white/10">
            {[1, 7, 30, 90].map((days) => (
              <button
                key={days}
                onClick={() => setMetricPeriod(days as 1 | 7 | 30 | 90)}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  metricPeriod === days
                    ? 'bg-[#D4AF37] text-gray-900 font-semibold'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {days}d
              </button>
            ))}
          </div>
        </div>

        {/* Grid de métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Keys */}
          <div className="bg-gray-50 dark:bg-[#1a1625] rounded-xl p-4 border-2 border-cyan-400 dark:border-[#4aede5] hover:scale-105 transition-transform shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-semibold text-gray-600 dark:text-gray-400">API Keys</span>
              <Key size={20} className="text-cyan-500 dark:text-[#4aede5]" />
            </div>
            <div className="text-3xl font-bold text-cyan-600 dark:text-[#4aede5]">{metrics.totalKeys}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {metrics.activeKeys} ativas • {metrics.expiredKeys} expiradas
            </div>
          </div>

          {/* Total Requests */}
          <div className="bg-gray-50 dark:bg-[#1a1625] rounded-xl p-4 border-2 border-emerald-400 dark:border-emerald-500 hover:scale-105 transition-transform shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-semibold text-gray-600 dark:text-gray-400">Requests</span>
              <Activity size={20} className="text-emerald-500" />
            </div>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {metrics.totalRequests.toLocaleString()}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Últimos {metricPeriod} dias
            </div>
          </div>

          {/* Avg Response Time */}
          <div className="bg-gray-50 dark:bg-[#1a1625] rounded-xl p-4 border-2 border-blue-400 dark:border-blue-500 hover:scale-105 transition-transform shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-semibold text-gray-600 dark:text-gray-400">Avg Response</span>
              <Clock size={20} className="text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{metrics.avgResponseTime}ms</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Tempo médio de resposta
            </div>
          </div>

          {/* Error Rate */}
          <div className="bg-gray-50 dark:bg-[#1a1625] rounded-xl p-4 border-2 border-amber-400 dark:border-amber-500 hover:scale-105 transition-transform shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-semibold text-gray-600 dark:text-gray-400">Error Rate</span>
              <AlertTriangle size={20} className="text-amber-500" />
            </div>
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{metrics.errorRate}%</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Taxa de erro
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">{showCreateForm && (
        <div className="bg-gray-50 dark:bg-[#1a1625] rounded-xl p-6 border-2 border-[#D4AF37] dark:border-[#4aede5] shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Criar Nova API Key</h3>
            <button
              onClick={() => setShowCreateForm(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>
          <ApiKeyCreateForm createAction={createAction} />
        </div>
      )}

        <ApiKeysTableClient keys={filteredKeys} revokeAction={revokeAction} />

        {/* Tabela de Uso Detalhado (condicional) */}
        {showUsageTable && (
          <div className="rounded-xl border-2 border-[#D4AF37] dark:border-[#4aede5] shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-gradient-to-b from-gray-100 dark:from-indigo-500/10 via-gray-50 dark:via-purple-500/5 to-transparent px-4 md:px-6 py-3 border-b-2 border-[#D4AF37] dark:border-[#4aede5]">
            <div className="flex items-center gap-2">
              <TrendingUp size={20} className="text-[#D4AF37]" />
              <h2 className="text-lg font-bold text-[#D4AF37]">Uso Detalhado (últimos 30 dias)</h2>
            </div>
          </div>
          
          <div className="overflow-auto">
            <table className="w-full text-sm bg-white dark:bg-[#1a1625]">
              <thead className="bg-gradient-to-b from-gray-100 dark:from-indigo-500/10 via-gray-50 dark:via-purple-500/5 to-transparent border-b-2 border-[#D4AF37] dark:border-[#4aede5]">
                <tr>
                  <th className="text-left px-4 md:px-6 py-3 text-xs font-bold text-[#D4AF37] uppercase">Key</th>
                  <th className="text-left px-4 md:px-6 py-3 text-xs font-bold text-[#D4AF37] uppercase">Data</th>
                  <th className="text-right px-4 md:px-6 py-3 text-xs font-bold text-[#D4AF37] uppercase">Calls</th>
                  <th className="text-right px-4 md:px-6 py-3 text-xs font-bold text-[#D4AF37] uppercase">Avg (ms)</th>
                  <th className="text-right px-4 md:px-6 py-3 text-xs font-bold text-[#D4AF37] uppercase">Errors</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                {keys.flatMap((k: any) => 
                  (usageByKey[k.id] || []).slice(0, 5).map((row: any) => (
                    <tr key={`${k.id}-${row.day}`} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 md:px-6 py-3">
                        <div className="font-medium text-gray-900 dark:text-white">{k.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">••••{k.last4}</div>
                      </td>
                      <td className="px-4 md:px-6 py-3 text-gray-700 dark:text-gray-300">
                        {new Date(row.day).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                      </td>
                      <td className="px-4 md:px-6 py-3 text-right font-medium text-gray-900 dark:text-white">
                        {Number(row.calls || 0).toLocaleString()}
                      </td>
                      <td className="px-4 md:px-6 py-3 text-right text-gray-700 dark:text-gray-300">
                        {Number(row.avg_ms || 0).toFixed(0)}
                      </td>
                      <td className="px-4 md:px-6 py-3 text-right">
                        <span className={Number(row.errors || 0) > 0 ? 'text-red-500 font-semibold' : 'text-gray-700 dark:text-gray-300'}>
                          {Number(row.errors || 0)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
                {keys.every((k: any) => !(usageByKey[k.id]?.length)) && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-gray-600 dark:text-gray-400">
                      Sem dados de uso nos últimos 30 dias
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        )}

        <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-[#1a1625] rounded-lg p-4 border border-gray-200 dark:border-white/10">
          <p>Obs.: a chave em texto claro aparece apenas no momento da criação. Guarde com segurança.</p>
        </div>
      </div>
    </PageContainer>
  );
}
