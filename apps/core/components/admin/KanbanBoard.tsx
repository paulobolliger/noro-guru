// components/admin/KanbanBoard.tsx
'use client';

import { useState } from 'react';
import type { Database } from '@/types/supabase';
import { Users, DollarSign, GripVertical } from 'lucide-react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type Lead = Database['public']['Tables']['noro_leads']['Row'];

interface KanbanBoardProps {
  leads: Lead[];
  onLeadClick?: (leadId: string) => void;
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

interface LeadCardProps {
  lead: Lead;
  onLeadClick?: (leadId: string) => void;
  isDragging?: boolean;
}

function LeadCard({ lead, onLeadClick, isDragging = false }: LeadCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.3 : 1,
  };

  const totalViajantes = (lead.num_adultos || 0) + (lead.num_criancas || 0);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white p-4 rounded-md shadow border border-gray-200 hover:shadow-lg transition-all overflow-hidden ${
        isDragging ? 'rotate-3 scale-105 shadow-2xl' : ''
      }`}
    >
      <div className="flex items-start gap-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 mt-1 flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical size={16} />
        </div>
        <div
          className="flex-1 min-w-0 cursor-pointer"
          onClick={() => !isDragging && onLeadClick?.(lead.id)}
        >
          <p className="font-semibold text-gray-800 truncate">{lead.nome}</p>
          <p className="text-sm text-gray-500 truncate">{lead.destino || lead.email}</p>
          <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Users size={14} />
              <span>{totalViajantes || 'N/D'}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign size={14} />
              <span>
                {lead.valor_estimado ? `€${lead.valor_estimado.toLocaleString('pt-PT')}` : 'N/D'}
              </span>
            </div>
          </div>
          {lead.probabilidade_fechamento !== null && lead.probabilidade_fechamento !== undefined && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Prob. fechamento</span>
                <span className="font-semibold text-blue-600">{lead.probabilidade_fechamento}%</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface DroppableColumnProps {
  id: string;
  title: string;
  color: string;
  leads: Lead[];
  onLeadClick?: (leadId: string) => void;
  isUpdating: boolean;
}

function DroppableColumn({ id, title, color, leads, onLeadClick, isUpdating }: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  const valorTotal = leads.reduce((sum, lead) => sum + (lead.valor_estimado || 0), 0);

  return (
    <div className="flex-shrink-0 w-80 bg-gray-100 rounded-lg">
      {/* Cabeçalho da Coluna */}
      <div className={`p-4 rounded-t-lg flex justify-between items-center ${color}`}>
        <h2 className="font-bold text-white">{title}</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white bg-white/20 rounded-full px-2 py-0.5">
            {leads.length}
          </span>
          {leads.length > 0 && (
            <span className="text-xs text-white/80">€{valorTotal.toLocaleString('pt-PT')}</span>
          )}
        </div>
      </div>

      {/* Lista de Cards - Droppable Zone */}
      <div
        ref={setNodeRef}
        className={`p-2 space-y-2 overflow-y-auto h-[calc(100vh-20rem)] min-h-[200px] transition-colors ${
          isOver ? 'bg-blue-50 border-2 border-blue-300 border-dashed' : ''
        } ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <SortableContext items={leads.map((lead) => lead.id)} strategy={verticalListSortingStrategy}>
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} onLeadClick={onLeadClick} />
          ))}
          {leads.length === 0 && (
            <div className="text-center text-sm text-gray-400 p-4 border-2 border-dashed border-gray-300 rounded-lg mt-2">
              {isOver ? 'Solte aqui' : 'Arraste leads para cá'}
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}

export default function KanbanBoard({ leads, onLeadClick }: KanbanBoardProps) {
  const [localLeads, setLocalLeads] = useState<Lead[]>(leads);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Agrupa os leads por status
  const leadsPorColuna = colunas.map((coluna) => ({
    ...coluna,
    leads: localLeads.filter((lead) => lead.status === coluna.id),
  }));

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Encontrar o lead ativo
    const activeLead = localLeads.find((lead) => lead.id === activeId);
    if (!activeLead) return;

    // Se dropou sobre uma coluna
    const targetColumn = colunas.find((col) => col.id === overId);
    if (targetColumn && activeLead.status !== targetColumn.id) {
      setLocalLeads((leads) =>
        leads.map((lead) => (lead.id === activeId ? { ...lead, status: targetColumn.id } : lead))
      );
      return;
    }

    // Se dropou sobre outro lead, mover para a coluna desse lead
    const overLead = localLeads.find((lead) => lead.id === overId);
    if (overLead && activeLead.status !== overLead.status) {
      setLocalLeads((leads) =>
        leads.map((lead) => (lead.id === activeId ? { ...lead, status: overLead.status } : lead))
      );
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const movedLead = localLeads.find((lead) => lead.id === activeId);
    if (!movedLead) return;

    const originalStatus = leads.find((l) => l.id === activeId)?.status;

    // Se o status mudou, atualizar no backend
    if (movedLead.status !== originalStatus) {
      const newStatus = movedLead.status;

      setIsUpdating(true);
      try {
        const response = await fetch(`/api/admin/leads/${activeId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        });

        if (!response.ok) {
          throw new Error('Erro ao atualizar status');
        }

        console.log(`✅ Lead ${activeId} movido para ${newStatus}`);
      } catch (error) {
        console.error('❌ Erro ao atualizar lead:', error);
        // Reverter mudança
        setLocalLeads((leads) =>
          leads.map((lead) => (lead.id === activeId ? { ...lead, status: originalStatus || 'novo' } : lead))
        );
        alert('Erro ao mover lead. Por favor, tente novamente.');
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const activeLead = activeId ? localLeads.find((lead) => lead.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {leadsPorColuna.map((coluna) => (
          <DroppableColumn
            key={coluna.id}
            id={coluna.id}
            title={coluna.title}
            color={statusColors[coluna.id] || 'bg-gray-400'}
            leads={coluna.leads}
            onLeadClick={onLeadClick}
            isUpdating={isUpdating}
          />
        ))}
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeLead ? <LeadCard lead={activeLead} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  );
}
