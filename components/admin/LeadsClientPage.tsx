// components/admin/LeadsClientPage.tsx
'use client';

import { useState } from 'react';
import type { Database } from '@/types/supabase';
import KanbanBoard from './KanbanBoard';
import { format } from 'date-fns';
import { LayoutGrid, List, Plus } from 'lucide-react';
import Link from 'next/link';

type Lead = Database['public']['Tables']['noro_leads']['Row'];

interface LeadsClientPageProps {
  leads: Lead[];
}

export default function LeadsClientPage({ leads }: LeadsClientPageProps) {
  const [view, setView] = useState<'table' | 'kanban'>('table');

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Todos os Leads</h1>
        <div className="flex items-center gap-4">
          {/* Seletor de Visualização */}
          <div className="flex items-center gap-2 p-1 bg-gray-200 rounded-lg">
            <button
              onClick={() => setView('table')}
              className={`px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-2 ${view === 'table' ? 'bg-white text-gray-800 shadow' : 'text-gray-500 hover:bg-gray-300'}`}
            >
              <List size={16} />
              Tabela
            </button>
            <button
              onClick={() => setView('kanban')}
              className={`px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-2 ${view === 'kanban' ? 'bg-white text-gray-800 shadow' : 'text-gray-500 hover:bg-gray-300'}`}
            >
              <LayoutGrid size={16} />
              Kanban
            </button>
          </div>
          {/* Botão Novo Lead */}
          <Link
            href="/admin/leads/novo"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-shadow"
          >
            <Plus size={20} />
            Novo Lead
          </Link>
        </div>
      </div>
      
      {/* Renderização Condicional */}
      {view === 'table' ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origem</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leads.length > 0 ? leads.map((lead) => (
                <tr key={lead.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lead.nome}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.origem}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(lead.created_at), 'dd/MM/yyyy')}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    Nenhum lead encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <KanbanBoard leads={leads} />
      )}
    </div>
  );
}