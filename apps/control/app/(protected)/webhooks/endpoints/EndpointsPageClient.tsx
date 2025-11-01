"use client";
import { useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import EndpointsHeader from "@/components/webhooks/EndpointsHeader";
import { Webhook, Search, Activity, Settings, CheckCircle, XCircle, Globe, Plus } from 'lucide-react';

interface WebhookEndpoint {
  id: string;
  code: string;
  url: string;
  is_active: boolean;
  created_at: string;
  events?: string[];
}

interface EndpointsPageClientProps {
  endpoints: WebhookEndpoint[];
  toggleAction: (formData: FormData) => Promise<void>;
  removeAction: (formData: FormData) => Promise<void>;
}

export default function EndpointsPageClient({ 
  endpoints, 
  toggleAction,
  removeAction 
}: EndpointsPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const activeTab = pathname === '/webhooks/endpoints' ? 'endpoints' : 'eventos';

  // Calcular métricas
  const metrics = useMemo(() => {
    const total = endpoints.length;
    const active = endpoints.filter(e => e.is_active).length;
    const inactive = total - active;
    const activeRate = total > 0 ? ((active / total) * 100).toFixed(1) : '0.0';

    return {
      total,
      active,
      inactive,
      activeRate,
    };
  }, [endpoints]);

  // Filtrar dados
  const filteredEndpoints = useMemo(() => {
    let filtered = endpoints;

    // Filtro por status
    if (statusFilter === "active") {
      filtered = filtered.filter(e => e.is_active);
    } else if (statusFilter === "inactive") {
      filtered = filtered.filter(e => !e.is_active);
    }

    // Filtro por busca
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(e => {
        return (
          e.code.toLowerCase().includes(query) ||
          e.url.toLowerCase().includes(query)
        );
      });
    }

    return filtered;
  }, [endpoints, searchQuery, statusFilter]);

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

            {/* Search + Botão Criar */}
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
                    placeholder="Buscar por code ou URL..."
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

              {/* Botão Novo Endpoint */}
              <EndpointsHeader />
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Endpoints */}
          <div className="bg-gray-50 dark:bg-[#1a1625] rounded-xl p-4 border-2 border-cyan-400 dark:border-[#4aede5] hover:scale-105 transition-transform shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-semibold text-gray-600 dark:text-gray-400">Total Endpoints</span>
              <Globe size={20} className="text-cyan-500 dark:text-[#4aede5]" />
            </div>
            <div className="text-3xl font-bold text-cyan-600 dark:text-[#4aede5]">{metrics.total}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              URLs configuradas
            </div>
          </div>

          {/* Active */}
          <div className="bg-gray-50 dark:bg-[#1a1625] rounded-xl p-4 border-2 border-emerald-400 dark:border-emerald-500 hover:scale-105 transition-transform shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-semibold text-gray-600 dark:text-gray-400">Ativos</span>
              <CheckCircle size={20} className="text-emerald-500" />
            </div>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{metrics.active}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Taxa: {metrics.activeRate}%
            </div>
          </div>

          {/* Inactive */}
          <div className="bg-gray-50 dark:bg-[#1a1625] rounded-xl p-4 border-2 border-gray-400 dark:border-gray-500 hover:scale-105 transition-transform shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-semibold text-gray-600 dark:text-gray-400">Inativos</span>
              <XCircle size={20} className="text-gray-500" />
            </div>
            <div className="text-3xl font-bold text-gray-600 dark:text-gray-400">{metrics.inactive}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Desativados
            </div>
          </div>
        </div>
      </div>

      {/* Filtros por Status */}
      <div className="mb-6 flex gap-2">
        {[
          { value: 'all', label: 'Todos', color: 'gray' },
          { value: 'active', label: 'Ativos', color: 'emerald' },
          { value: 'inactive', label: 'Inativos', color: 'gray' },
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
      <div className="rounded-xl border-2 border-[#D4AF37] dark:border-[#4aede5] shadow-lg overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full text-sm bg-white dark:bg-[#1a1625]">
            <thead className="bg-gradient-to-b from-gray-100 dark:from-indigo-500/10 via-gray-50 dark:via-purple-500/5 to-transparent border-b-2 border-[#D4AF37] dark:border-[#4aede5]">
              <tr>
                <th className="text-left px-4 md:px-6 py-3 text-xs font-bold text-[#D4AF37] uppercase">Code</th>
                <th className="text-left px-4 md:px-6 py-3 text-xs font-bold text-[#D4AF37] uppercase">URL</th>
                <th className="text-center px-4 md:px-6 py-3 text-xs font-bold text-[#D4AF37] uppercase">Status</th>
                <th className="text-left px-4 md:px-6 py-3 text-xs font-bold text-[#D4AF37] uppercase">Criado</th>
                <th className="text-right px-4 md:px-6 py-3 text-xs font-bold text-[#D4AF37] uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/10">
              {filteredEndpoints.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 md:px-6 py-3 font-medium text-gray-900 dark:text-white">{e.code}</td>
                  <td className="px-4 md:px-6 py-3 text-gray-700 dark:text-gray-300 font-mono text-xs">
                    {e.url}
                  </td>
                  <td className="px-4 md:px-6 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                      e.is_active
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}>
                      {e.is_active ? <CheckCircle size={12} /> : <XCircle size={12} />}
                      {e.is_active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-3 text-gray-700 dark:text-gray-300">
                    {new Date(e.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 md:px-6 py-3 text-right space-x-2">
                    <form action={toggleAction} className="inline">
                      <input type="hidden" name="id" value={e.id} />
                      <input type="hidden" name="active" value={String(e.is_active)} />
                      <button
                        type="submit"
                        className="text-sm text-[#4aede5] hover:text-[#D4AF37] transition-colors underline"
                      >
                        {e.is_active ? 'Desativar' : 'Ativar'}
                      </button>
                    </form>
                    <form action={removeAction} className="inline ml-3">
                      <input type="hidden" name="id" value={e.id} />
                      <button
                        type="submit"
                        className="text-sm text-[#4aede5] hover:text-red-400 transition-colors underline"
                      >
                        Remover
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {filteredEndpoints.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-600 dark:text-gray-400">
                    {searchQuery || statusFilter !== 'all' 
                      ? 'Nenhum endpoint encontrado com os filtros aplicados.' 
                      : 'Nenhum endpoint cadastrado.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  );
}
