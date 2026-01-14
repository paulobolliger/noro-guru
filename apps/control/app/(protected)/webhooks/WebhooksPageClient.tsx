"use client";
import { useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
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
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-heading flex items-center gap-2">
            <Webhook className="text-primary" size={24} />
            Webhooks
          </h2>
          <p className="text-sm text-secondary mt-1">Gerencie eventos e endpoints de webhooks.</p>
        </div>
      </div>

      {/* Metrics Metrics */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-heading uppercase tracking-wide">Monitoramento (24h)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Webhooks */}
          <div className="bg-surface-card rounded-xl p-5 border border-default shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-secondary uppercase tracking-wider">Eventos Totais</span>
              <Activity size={18} className="text-primary" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-heading">{metrics.total}</span>
              <span className="text-xs text-secondary">{metrics.last24h} hoje</span>
            </div>
          </div>

          {/* Success */}
          <div className="bg-surface-card rounded-xl p-5 border border-default shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-secondary uppercase tracking-wider">Sucesso</span>
              <CheckCircle size={18} className="text-emerald-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-heading">{metrics.success}</span>
              <span className="text-xs text-emerald-600 font-medium">{metrics.successRate}% taxa</span>
            </div>
          </div>

          {/* Failed */}
          <div className="bg-surface-card rounded-xl p-5 border border-default shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-secondary uppercase tracking-wider">Falhas</span>
              <XCircle size={18} className="text-red-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-heading">{metrics.failed}</span>
              <span className="text-xs text-secondary">erros</span>
            </div>
          </div>

          {/* Pending */}
          <div className="bg-surface-card rounded-xl p-5 border border-default shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-secondary uppercase tracking-wider">Pendentes</span>
              <Clock size={18} className="text-amber-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-heading">{metrics.pending}</span>
              <span className="text-xs text-secondary">fila</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-default overflow-x-auto">
        <div className="flex gap-6">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => router.push(tab.href)}
                className={`
                    flex items-center gap-2 pb-3 text-sm font-medium transition-all border-b-2 whitespace-nowrap
                    ${isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-secondary hover:text-heading hover:border-default'
                  }
                  `}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Toolbar & Filter */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center bg-surface-card p-4 rounded-xl border border-default shadow-sm">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 text-tertiary" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por source ou event..."
              className="w-full pl-10 pr-4 py-2 bg-surface-base border border-default rounded-lg text-heading text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-tertiary"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {[
              { value: 'all', label: 'Todos' },
              { value: 'success', label: 'Sucesso' },
              { value: 'failed', label: 'Falhas' },
              { value: 'pending', label: 'Pendentes' },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setStatusFilter(filter.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${statusFilter === filter.value
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-surface-base text-secondary border border-default hover:bg-surface-base/80'
                  }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-surface-card border border-default rounded-xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-default flex justify-between items-center">
            <h3 className="text-sm font-bold text-heading uppercase tracking-wide">Log de Eventos</h3>
            <span className="text-xs font-medium text-tertiary bg-surface-base px-2 py-1 rounded-full border border-default">
              {filteredData.length} registros
            </span>
          </div>
          <WebhooksTableClient data={filteredData} />
        </div>
      </div>
    </div>
  );
}
