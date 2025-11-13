'use client'

import { useState } from 'react'
import LeadsTable from '@/components/leads/LeadsTable'
import LeadsKanban from '@/components/leads/LeadsKanban'
import { LayoutGrid, Table as TableIcon } from 'lucide-react'

interface Lead {
  id: string
  nome: string
  email: string
  telefone?: string
  empresa?: string
  status: 'novo' | 'contato' | 'qualificado' | 'proposta' | 'convertido' | 'perdido'
  origem: string
  valor_estimado?: number
  created_at: string
}

interface LeadsViewProps {
  leads: Lead[]
}

export default function LeadsView({ leads }: LeadsViewProps) {
  const [view, setView] = useState<'kanban' | 'table'>('kanban')

  const handleLeadMove = (leadId: string, newStatus: Lead['status']) => {
    console.log(`Lead ${leadId} movido para ${newStatus}`)
    // Aqui você pode fazer a chamada para o Supabase para atualizar o status
  }

  return (
    <div className="space-y-6">
      {/* Toggle de visualização */}
      <div className="flex items-center gap-2 bg-white rounded-lg shadow p-1 w-fit">
        <button
          onClick={() => setView('kanban')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            view === 'kanban'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          Kanban
        </button>
        <button
          onClick={() => setView('table')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            view === 'table'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <TableIcon className="w-5 h-5" />
          Tabela
        </button>
      </div>

      {/* Visualizações */}
      {view === 'kanban' ? (
        <LeadsKanban leads={leads} onLeadMove={handleLeadMove} />
      ) : (
        <LeadsTable leads={leads} />
      )}
    </div>
  )
}
