// components/admin/LeadsClientPage.tsx
'use client';

import { useState } from 'react';
import type { Database } from '@/types/supabase';
import KanbanBoard from './KanbanBoard';
import LeadDetailModal from './LeadDetailModal';
import LeadsStats from './LeadsStats';
import { format } from 'date-fns';
import { LayoutGrid, List, Eye, Filter, Search } from 'lucide-react';

type Lead = Database['public']['Tables']['noro_leads']['Row'];

interface LeadsClientPageProps {
  leads: Lead[];
}

const STATUS_COLORS: { [key: string]: string } = {
  novo: 'bg-blue-100 text-blue-800',
  contato_inicial: 'bg-cyan-100 text-cyan-800',
  qualificado: 'bg-teal-100 text-teal-800',
  proposta_enviada: 'bg-purple-100 text-purple-800',
  negociacao: 'bg-orange-100 text-orange-800',
  ganho: 'bg-green-100 text-green-800',
  perdido: 'bg-red-100 text-red-800',
};

const STATUS_LABELS: { [key: string]: string } = {
  novo: 'Novo',
  contato_inicial: 'Contato Inicial',
  qualificado: 'Qualificado',
  proposta_enviada: 'Proposta Enviada',
  negociacao: 'Negociação',
  ganho: 'Ganho',
  perdido: 'Perdido',
};

export default function LeadsClientPage({ leads: initialLeads }: LeadsClientPageProps) {
  const [view, setView] = useState<'table' | 'kanban'>('table');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [filterTipo, setFilterTipo] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLeadUpdate = () => {
    // Recarregar leads
    window.location.reload();
  };

  // Filtrar leads
  const filteredLeads = leads.filter((lead) => {
    if (filterTipo !== 'all' && lead.tipo !== filterTipo) return false;
    if (filterStatus !== 'all' && lead.status !== filterStatus) return false;

    // Busca por nome, email ou destino
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = lead.nome?.toLowerCase().includes(query);
      const matchesEmail = lead.email?.toLowerCase().includes(query);
      const matchesDestino = lead.destino?.toLowerCase().includes(query);
      if (!matchesName && !matchesEmail && !matchesDestino) return false;
    }

    return true;
  });

  return (
    <>
      {/* Estatísticas */}
      <LeadsStats leads={leads} />

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Todos os Leads</h1>
            <p className="text-sm text-gray-500 mt-1">
              {filteredLeads.length} {filteredLeads.length === 1 ? 'lead' : 'leads'}
              {filteredLeads.length !== leads.length && ` (${leads.length} total)`}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Botão Filtros */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                showFilters
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter size={18} />
              Filtros
            </button>

            {/* Seletor de Visualização */}
            <div className="flex items-center gap-2 p-1 bg-gray-200 rounded-lg">
              <button
                onClick={() => setView('table')}
                className={`px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-2 ${
                  view === 'table'
                    ? 'bg-white text-gray-800 shadow'
                    : 'text-gray-500 hover:bg-gray-300'
                }`}
              >
                <List size={16} />
                Tabela
              </button>
              <button
                onClick={() => setView('kanban')}
                className={`px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-2 ${
                  view === 'kanban'
                    ? 'bg-white text-gray-800 shadow'
                    : 'text-gray-500 hover:bg-gray-300'
                }`}
              >
                <LayoutGrid size={16} />
                Kanban
              </button>
            </div>

          </div>
        </div>

        {/* Busca */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nome, email ou destino..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filtros */}
        {showFilters && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Lead
                </label>
                <select
                  value={filterTipo}
                  onChange={(e) => setFilterTipo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todos os tipos</option>
                  <option value="roteiro_pronto">Roteiro Pronto</option>
                  <option value="geracao_ia">Geração IA</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todos os status</option>
                  <option value="novo">Novo</option>
                  <option value="contato_inicial">Contato Inicial</option>
                  <option value="qualificado">Qualificado</option>
                  <option value="proposta_enviada">Proposta Enviada</option>
                  <option value="negociacao">Negociação</option>
                  <option value="ganho">Ganho</option>
                  <option value="perdido">Perdido</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setFilterTipo('all');
                    setFilterStatus('all');
                  }}
                  className="w-full px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Renderização Condicional */}
        {view === 'table' ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nome
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tipo
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Origem
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Data
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedLeadId(lead.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {lead.nome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lead.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="capitalize">
                          {lead.tipo?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="capitalize">
                          {lead.origem?.replace('_', ' ') || 'N/D'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            STATUS_COLORS[lead.status || 'novo'] || 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {STATUS_LABELS[lead.status || 'novo'] || lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(lead.created_at), 'dd/MM/yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLeadId(lead.id);
                          }}
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1 ml-auto"
                        >
                          <Eye size={16} />
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                      Nenhum lead encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <KanbanBoard
            leads={filteredLeads}
            onLeadClick={(leadId) => setSelectedLeadId(leadId)}
          />
        )}
      </div>

      {/* Modal de Detalhes */}
      {selectedLeadId && (
        <LeadDetailModal
          leadId={selectedLeadId}
          isOpen={!!selectedLeadId}
          onClose={() => setSelectedLeadId(null)}
          onUpdate={handleLeadUpdate}
        />
      )}
    </>
  );
}
