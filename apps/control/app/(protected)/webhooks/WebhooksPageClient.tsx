"use client";
import { useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import WebhooksTableClient from './WebhooksTableClient';
import { Webhook, Search, Activity, Settings, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';

interface WebhookLog {
  id: string;
  provider?: string;
  source?: string;
  vendor?: string;
  event?: string;
  type?: string;
  event_type?: string;
  status?: string;
  delivery_status?: string;
  created_at: string;
  payload?: any;
}

interface WebhooksPageClientProps {
  data: WebhookLog[];
  initialQuery?: string;
}

export default function WebhooksPageClient({ data, initialQuery = "" }: WebhooksPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const activeTab = pathname === '/webhooks/endpoints' ? 'endpoints' : 'eventos';

  // Calcular métricas
  const metrics = useMemo(() => {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const total = data.length;
    const last24hData = data.filter(log => new Date(log.created_at) >= last24h);
    
    const success = data.filter(log => {
      const status = (log.status || log.delivery_status || '').toLowerCase();
      return status === 'success' || status === 'delivered';
    }).length;

    const failed = data.filter(log => {
      const status = (log.status || log.delivery_status || '').toLowerCase();
      return status === 'failed' || status === 'error';
    }).length;

    const pending = data.filter(log => {
      const status = (log.status || log.delivery_status || '').toLowerCase();
      return status === 'pending' || status === 'processing';
    }).length;

    const successRate = total > 0 ? ((success / total) * 100).toFixed(1) : '0.0';

    return {
      total,
      last24h: last24hData.length,
      success,
      failed,
      pending,
      successRate,
    };
  }, [data]);

  // Filtrar dados
  const filteredData = useMemo(() => {
    let filtered = data;

    // Filtro por status
    if (statusFilter !== "all") {
      filtered = filtered.filter(log => {
        const status = (log.status || log.delivery_status || '').toLowerCase();
        if (statusFilter === "success") return status === 'success' || status === 'delivered';
        if (statusFilter === "failed") return status === 'failed' || status === 'error';
        if (statusFilter === "pending") return status === 'pending' || status === 'processing';
        return true;
      });
    }

    // Filtro por busca
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(log => {
        const source = (log.provider || log.source || log.vendor || '').toLowerCase();
        const event = (log.event || log.type || log.event_type || '').toLowerCase();
        return source.includes(query) || event.includes(query);
      });
    }

    return filtered;
  }, [data, searchQuery, statusFilter]);

  const tabs = [
    {
      id: 'eventos',
      label: 'Eventos',
      icon: Activity,
      href: '/webhooks',
    },
    {
      id: 'endpoints',
      label: 'Endpoints',
      icon: Settings,
      href: '/webhooks/endpoints',
    },
  ];

  return (
    <PageContainer>
      {/* Header com Tabs integradas */}
      <div className="sticky top-0 z-30 mb-6">
        <div
          className="max-w-[1200px] mx-auto rounded-xl shadow-md overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(59, 44, 164, 0.94), rgba(35, 33, 79, 0.92))' }}
        >
          {/* Título e Busca */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 px-4 md:px-6 py-4">
            <div className="flex items-center gap-3 flex-shrink-0">
              <Webhook size={28} className="text-[#D4AF37]" />
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-[#D4AF37] tracking-tight">Webhooks</h1>
                <p className="text-sm text-gray-300 mt-1">Gerencie eventos e endpoints de webhooks.</p>
              </div>
            </div>

            {/* Search */}
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
                    placeholder="Buscar por source ou event..."
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
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 px-4 md:px-6 border-t border-white/10">
            {tabs.map((tab) => {
              const isActive = tab.id === activeTab;
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  onClick={() => router.push(tab.href)}
                  className={`
                    flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all
                    ${isActive
                      ? 'border-[#4aede5] text-[#4aede5]'
                      : 'border-transparent text-gray-400 hover:text-white hover:border-gray-400'
                    }
                  `}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Webhooks */}
          <div className="bg-gray-50 dark:bg-[#1a1625] rounded-xl p-4 border-2 border-cyan-400 dark:border-[#4aede5] hover:scale-105 transition-transform shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-semibold text-gray-600 dark:text-gray-400">Total Eventos</span>
              <Activity size={20} className="text-cyan-500 dark:text-[#4aede5]" />
            </div>
            <div className="text-3xl font-bold text-cyan-600 dark:text-[#4aede5]">{metrics.total}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {metrics.last24h} nas últimas 24h
            </div>
          </div>

          {/* Success */}
          <div className="bg-gray-50 dark:bg-[#1a1625] rounded-xl p-4 border-2 border-emerald-400 dark:border-emerald-500 hover:scale-105 transition-transform shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-semibold text-gray-600 dark:text-gray-400">Sucesso</span>
              <CheckCircle size={20} className="text-emerald-500" />
            </div>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{metrics.success}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Taxa: {metrics.successRate}%
            </div>
          </div>

          {/* Failed */}
          <div className="bg-gray-50 dark:bg-[#1a1625] rounded-xl p-4 border-2 border-red-400 dark:border-red-500 hover:scale-105 transition-transform shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-semibold text-gray-600 dark:text-gray-400">Falhas</span>
              <XCircle size={20} className="text-red-500" />
            </div>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">{metrics.failed}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Erros de entrega
            </div>
          </div>

          {/* Pending */}
          <div className="bg-gray-50 dark:bg-[#1a1625] rounded-xl p-4 border-2 border-amber-400 dark:border-amber-500 hover:scale-105 transition-transform shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-semibold text-gray-600 dark:text-gray-400">Pendentes</span>
              <Clock size={20} className="text-amber-500" />
            </div>
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{metrics.pending}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Em processamento
            </div>
          </div>
        </div>
      </div>

      {/* Filtros por Status */}
      <div className="mb-6 flex gap-2">
        {[
          { value: 'all', label: 'Todos', color: 'gray' },
          { value: 'success', label: 'Sucesso', color: 'emerald' },
          { value: 'failed', label: 'Falhas', color: 'red' },
          { value: 'pending', label: 'Pendentes', color: 'amber' },
        ].map((filter) => (
          <button
            key={filter.value}
            onClick={() => setStatusFilter(filter.value)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              statusFilter === filter.value
                ? `bg-${filter.color}-500 text-white shadow-lg scale-105`
                : `bg-gray-100 dark:bg-[#1a1625] text-gray-600 dark:text-gray-400 border-2 border-gray-300 dark:border-gray-600 hover:border-${filter.color}-400`
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Tabela */}
      <WebhooksTableClient data={filteredData} />
    </PageContainer>
  );
}
