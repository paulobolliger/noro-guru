// components/admin/LeadsClientPage.tsx
'use client';

import { useState } from 'react';
import type { Database } from "@noro-types/supabase";
import KanbanBoard from './KanbanBoard';
import { format } from 'date-fns';
import { LayoutGrid, List, Plus } from 'lucide-react';
import Link from 'next/link';
import PageHeader from './layout/PageHeader';
import LeadCreateModal from './leads/LeadCreateModal';

type Lead = Database['public']['Tables']['noro_leads']['Row'];

interface LeadsClientPageProps {
  leads: Lead[];
}

export default function LeadsClientPage({ leads }: LeadsClientPageProps) {
  const [view, setView] = useState<'table' | 'kanban'>('table');
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="rounded-xl surface-card border border-default shadow-[0_1px_0_0_rgba(255,255,255,0.03)]">
      <PageHeader
        title="Todos os Leads"
        actions={(
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-lg border border-default bg-[var(--color-surface-alt)] p-1">
              <button onClick={() => setView('table')} className={`px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-2 ${view === 'table' ? 'bg-white/90 text-slate-900 shadow' : 'text-muted hover:bg-white/10'}`}>
                <List size={16} />
                Tabela
              </button>
              <button onClick={() => setView('kanban')} className={`px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-2 ${view === 'kanban' ? 'bg-white/90 text-slate-900 shadow' : 'text-muted hover:bg-white/10'}`}>
                <LayoutGrid size={16} />
                Kanban
              </button>
            </div>
            <button onClick={() => setCreateOpen(true)} className="btn-primary inline-flex items-center gap-2 rounded-lg px-5 py-2.5 font-semibold transition-transform duration-200 ease-in-out">
              <Plus size={20} />
              Novo Lead
            </button>
          </div>
        )}
      />
      {createOpen && <LeadCreateModal isOpen={createOpen} onClose={() => setCreateOpen(false)} />}

      {/* Renderização Condicional */}
      {view === 'table' ? (
        <div className="overflow-x-auto rounded-xl border border-default">
          <table className="min-w-full divide-y divide-default">
            <thead className="bg-[var(--color-surface-alt)] border-b border-default">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Nome</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Origem</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Data</th>
              </tr>
            </thead>
            <tbody className="surface-card divide-y divide-default">
              {leads.length > 0 ? leads.map((lead) => (
                <tr key={lead.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">{lead.nome}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">{lead.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">{lead.origem}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full border border-default bg-[var(--color-surface-alt)] text-primary">
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                    {format(new Date(lead.created_at), 'dd/MM/yyyy')}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-muted">
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




