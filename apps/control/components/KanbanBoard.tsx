// components/admin/KanbanBoard.tsx
'use client';

import type { Database } from "@types/supabase";
import { Users, DollarSign } from 'lucide-react';

type Lead = Database['public']['Tables']['noro_leads']['Row'];

interface KanbanBoardProps {
  leads: Lead[];
}

// Defina as colunas do seu funil de vendas
const colunas = [
  { id: 'novo', title: 'Novo' },
  { id: 'contato_inicial', title: 'Contato Inicial' },
  { id: 'qualificado', title: 'Qualificado' },
  { id: 'proposta_enviada', title: 'Proposta Enviada' },
  { id: 'negociacao', title: 'Negociação' },
  { id: 'ganho', title: 'Ganho' },
  { id: 'perdido', title: 'Perdido' },
];

// Mapeamento de cores para cada status
const statusColors: { [key: string]: string } = {
  novo: 'bg-blue-500',
  contato_inicial: 'bg-cyan-500',
  qualificado: 'bg-teal-500',
  proposta_enviada: 'bg-purple-500',
  negociacao: 'bg-orange-500',
  ganho: 'bg-green-500',
  perdido: 'bg-red-500',
};


export default function KanbanBoard({ leads }: KanbanBoardProps) {
  // Agrupa os leads por status
  const leadsPorColuna = colunas.map(coluna => ({
    ...coluna,
    leads: leads.filter(lead => lead.status === coluna.id),
  }));

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {leadsPorColuna.map(coluna => (
        <div key={coluna.id} className="flex-shrink-0 w-80 bg-gray-100 rounded-lg">
          {/* Cabeçalho da Coluna */}
          <div className={`p-4 rounded-t-lg flex justify-between items-center ${statusColors[coluna.id] || 'bg-gray-400'}`}>
            <h2 className="font-bold text-white">{coluna.title}</h2>
            <span className="text-sm font-semibold text-white bg-white/20 rounded-full px-2 py-0.5">
              {coluna.leads.length}
            </span>
          </div>
          
          {/* Lista de Cards */}
          <div className="p-2 space-y-2 overflow-y-auto h-[calc(100vh-20rem)]">
            {coluna.leads.map(lead => (
              <div key={lead.id} className="bg-white p-4 rounded-md shadow border border-gray-200 cursor-grab">
                <p className="font-semibold text-gray-800">{lead.nome}</p>
                <p className="text-sm text-gray-500">{lead.destino_interesse || 'Sem destino'}</p>
                <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users size={14} />
                    <span>{lead.num_pessoas || 1}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign size={14} />
                    <span>{lead.valor_estimado ? lead.valor_estimado.toLocaleString('pt-BR') : 'N/D'}</span>
                  </div>
                </div>
              </div>
            ))}
            {coluna.leads.length === 0 && (
                <div className="text-center text-sm text-gray-400 p-4">
                    Nenhum lead nesta etapa.
                </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
