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
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-heading flex items-center gap-2">
            <Key className="text-primary" size={24} />
            API Keys
          </h2>
          <p className="text-sm text-secondary mt-1">Gerencie chaves de acesso para integração via API.</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-heading uppercase tracking-wide">Visão Geral</h3>
            <div className="inline-flex gap-1 p-1 bg-surface-base rounded-lg border border-default">
            {[1, 7, 30, 90].map((days) => (
              <button
                key={days}
                onClick={() => setMetricPeriod(days as 1 | 7 | 30 | 90)}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  metricPeriod === days
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-secondary hover:text-heading'
                }`}
              >
                {days}d
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Keys */}
            <div className="bg-surface-card rounded-xl p-5 border border-default shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-secondary uppercase tracking-wider">Chaves Ativas</span>
                    <Key size={18} className="text-primary" />
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-heading">{metrics.activeKeys}</span>
                    <span className="text-xs text-secondary">de {metrics.totalKeys} total</span>
                </div>
            </div>

            {/* Requests */}
            <div className="bg-surface-card rounded-xl p-5 border border-default shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-secondary uppercase tracking-wider">Requisições</span>
                    <Activity size={18} className="text-emerald-500" />
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-heading">{metrics.totalRequests.toLocaleString()}</span>
                    <span className="text-xs text-secondary">no período</span>
                </div>
            </div>

            {/* Avg Response */}
            <div className="bg-surface-card rounded-xl p-5 border border-default shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-secondary uppercase tracking-wider">Tempo Médio</span>
                    <Clock size={18} className="text-blue-500" />
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-heading">{metrics.avgResponseTime}ms</span>
                    <span className="text-xs text-secondary">latência</span>
                </div>
            </div>

            {/* Error Rate */}
            <div className="bg-surface-card rounded-xl p-5 border border-default shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-secondary uppercase tracking-wider">Taxa de Erro</span>
                    <AlertTriangle size={18} className="text-amber-500" />
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-heading">{metrics.errorRate}%</span>
                    <span className="text-xs text-secondary">falhas</span>
                </div>
            </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center bg-surface-card p-4 rounded-xl border border-default shadow-sm">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 text-tertiary" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar chave..."
                  className="w-full pl-10 pr-4 py-2 bg-surface-base border border-default rounded-lg text-heading text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-tertiary"
                />
            </div>
            <div className="flex gap-3">
                 <button
                    onClick={() => setShowUsageTable(!showUsageTable)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-medium ${
                    showUsageTable
                        ? 'bg-surface-base border-primary text-primary'
                        : 'bg-surface-base border-default text-secondary hover:border-primary/50'
                    }`}
                >
                    <TrendingUp size={16} />
                    {showUsageTable ? 'Ocultar Uso' : 'Ver Uso Detalhado'}
                </button>

                <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="btn-primary px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                >
                    <Plus size={16} />
                    <span>Nova Chave</span>
                </button>
            </div>
        </div>

        {/* Create Form Area */}
        {showCreateForm && (
            <div className="bg-surface-card rounded-xl p-6 border border-default shadow-sm animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-heading uppercase tracking-wide">Criar Nova API Key</h3>
                    <button onClick={() => setShowCreateForm(false)} className="text-secondary hover:text-heading">✕</button>
                </div>
                <ApiKeyCreateForm createAction={createAction} />
            </div>
        )}

        {/* Data Table */}
        <div className="bg-surface-card border border-default rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-default flex justify-between items-center">
                <h3 className="text-sm font-bold text-heading uppercase tracking-wide">Chaves Cadastradas</h3>
                <span className="text-xs font-medium text-tertiary bg-surface-base px-2 py-1 rounded-full border border-default">
                    {filteredKeys.length} chaves
                </span>
            </div>
            <ApiKeysTableClient keys={filteredKeys} revokeAction={revokeAction} />
        </div>

        {/* Detailed Usage Table */}
         {showUsageTable && (
          <div className="bg-surface-card border border-default rounded-xl overflow-hidden shadow-sm animate-in fade-in slide-in-from-top-4">
            <div className="p-6 border-b border-default flex justify-between items-center bg-surface-base/50">
               <h3 className="text-sm font-bold text-heading uppercase tracking-wide flex items-center gap-2">
                    <TrendingUp size={16} className="text-primary" />
                    Uso Detalhado (últimos 30 dias)
               </h3>
            </div>
            
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead className="bg-surface-base border-b border-default text-xs uppercase text-secondary font-semibold tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-medium text-left">Key</th>
                      <th className="px-6 py-4 font-medium text-left">Data</th>
                      <th className="px-6 py-4 font-medium text-right">Chamadas</th>
                      <th className="px-6 py-4 font-medium text-right">Latência (ms)</th>
                      <th className="px-6 py-4 font-medium text-right">Erros</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-default">
                  {keys.flatMap((k: any) => 
                    (usageByKey[k.id] || []).slice(0, 5).map((row: any) => (
                      <tr key={`${k.id}-${row.day}`} className="hover:bg-surface-base/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-medium text-heading">{k.name}</div>
                          <div className="text-xs text-tertiary font-mono">••••{k.last4}</div>
                        </td>
                        <td className="px-6 py-4 text-secondary">
                          {new Date(row.day).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                        </td>
                        <td className="px-6 py-4 text-right text-heading font-medium">
                          {Number(row.calls || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right text-secondary">
                          {Number(row.avg_ms || 0).toFixed(0)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className={Number(row.errors || 0) > 0 ? 'text-red-500 font-bold' : 'text-tertiary'}>
                            {Number(row.errors || 0)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                  {keys.every((k: any) => !(usageByKey[k.id]?.length)) && (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-secondary">
                        <Activity size={32} className="mx-auto mb-2 opacity-20" />
                        Sem dados de uso recentes.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <div className="text-sm text-tertiary bg-surface-card rounded-lg p-4 border border-default">
          <p>Obs.: a chave em texto claro aparece apenas no momento da criação. Guarde com segurança.</p>
        </div>
      </div>
    </div>
  );
}
