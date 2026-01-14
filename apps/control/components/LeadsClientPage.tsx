'use client';

import { useState } from 'react';
import LeadKpis from './leads/LeadKpis';
import LeadTable from './leads/LeadTable';
import { Search, Plus, LayoutGrid, List } from 'lucide-react';
import Link from 'next/link';

export interface LeadsClientPageProps {
  leads: any[];
}

export default function LeadsClientPage({ leads }: LeadsClientPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');

  const filteredLeads = leads.filter((lead) => {
    const query = searchQuery.toLowerCase();
    return (
      lead.organization_name?.toLowerCase().includes(query) ||
      lead.email?.toLowerCase().includes(query) ||
      lead.phone?.toLowerCase().includes(query)
    );
  });

  // Calculate KPI totals
  const totals = {
    total: leads.length,
    valorTotal: leads.reduce((acc, l) => acc + (l.value_cents || 0), 0),
    abertos: leads.filter((l) => !['ganho', 'perdido'].includes((l.stage || '').toLowerCase())).length,
    ganhos: leads.filter((l) => (l.stage || '').toLowerCase() === 'ganho').length,
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Leads</h1>
          <p className="text-sm text-gray-600 mt-1">
            Gerencie seus leads e oportunidades de vendas
          </p>
        </div>
        <Link
          href="/control/leads/create"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={18} />
          Novo Lead
        </Link>
      </div>

      {/* KPIs */}
      <LeadKpis totals={totals} />

      {/* Toolbar */}
      <div className="surface-card rounded-lg p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar por nome, email ou telefone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              />
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'table'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <List size={16} />
              Tabela
            </button>
            <Link
              href="/control/leads?view=kanban"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === 'kanban'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <LayoutGrid size={16} />
              Kanban
            </Link>
          </div>
        </div>
      </div>

      {/* Table */}
      <LeadTable leads={filteredLeads} />
    </div>
  );
}
