"use client";
import { DndContext, PointerSensor, useSensor, useSensors, DragEndEvent, DragStartEvent, closestCorners, DragOverlay, useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMemo, useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GripVertical, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { updateTicketStatus } from './actions';

type Ticket = { 
  id: string; 
  subject?: string; 
  tenant_id?: string;
  priority?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
};

type Column = { 
  key: string; 
  label: string; 
  count: number;
};

const priorityColors: Record<string, string> = {
  low: 'text-gray-400',
  normal: 'text-blue-400',
  high: 'text-orange-400',
  urgent: 'text-red-400',
};

const priorityLabels: Record<string, string> = {
  low: 'Baixa',
  normal: 'Normal',
  high: 'Alta',
  urgent: 'Urgente',
};

function TicketCard({ ticket }: { ticket: Ticket }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: ticket.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  } as React.CSSProperties;
  
  const daysOpen = ticket.created_at 
    ? Math.floor((Date.now() - new Date(ticket.created_at).getTime()) / (1000 * 60 * 60 * 24))
    : null;
  
  const dateFormatted = ticket.created_at 
    ? new Date(ticket.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
    : null;
  
  const priorityColor = priorityColors[ticket.priority || 'normal'] || 'text-gray-400';
  const priorityLabel = priorityLabels[ticket.priority || 'normal'] || 'Normal';

  return (
    <div ref={setNodeRef} style={style} className="surface-card rounded-lg border border-default p-3 shadow-sm hover:shadow-md transition-all group bg-[#1a1625]">
      <div className="flex items-start gap-2">
        {/* Grip Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-300 transition-colors mt-1 flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-4 h-4" />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Subject */}
          <div className="font-semibold text-[#D4AF37] mb-2 line-clamp-2">{ticket.subject || 'Sem assunto'}</div>
          
          {/* Tenant ID */}
          {ticket.tenant_id && (
            <div className="text-xs text-gray-400 mb-2 flex items-center gap-1.5">
              <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="line-clamp-1">{ticket.tenant_id}</span>
            </div>
          )}
          
          {/* Priority */}
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/10">
            <div className={`flex items-center gap-1 text-xs ${priorityColor}`}>
              <AlertCircle className="w-3 h-3" />
              <span>{priorityLabel}</span>
            </div>
            {daysOpen !== null && (
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                <span>{daysOpen}d aberto</span>
              </div>
            )}
          </div>
          
          {/* Footer: Date and ID */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">{dateFormatted}</span>
            <span className="text-gray-600 font-mono">#{ticket.id.slice(0, 8)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function KanbanColumn({ column, tickets }: { column: Column; tickets: Ticket[] }) {
  const { setNodeRef } = useDroppable({ id: column.key });
  
  const headerGradients: Record<string, string> = {
    open: 'from-blue-600 to-blue-500',
    'in-progress': 'from-yellow-600 to-yellow-500',
    waiting: 'from-purple-600 to-purple-500',
    resolved: 'from-green-600 to-green-500',
    closed: 'from-gray-600 to-gray-500',
  };

  return (
    <Card className="border-default surface-card min-w-[320px] flex flex-col h-full">
      <CardHeader className={`text-white rounded-t-xl bg-gradient-to-r ${headerGradients[column.key] || 'from-[#5053c4] to-[#342ca4]'}`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-base">{column.label}</h3>
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold">{column.count}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-3 overflow-hidden">
        <ScrollArea className="h-full pr-3">
          <div ref={setNodeRef} className="space-y-2 min-h-[100px]">
            <SortableContext items={tickets.map(t => t.id)} strategy={verticalListSortingStrategy}>
              {tickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </SortableContext>
            {tickets.length === 0 && (
              <div className="text-center text-muted py-8 text-sm">
                Nenhum ticket
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default function SupportKanbanBoard({ 
  columns, 
  ticketsByStatus 
}: { 
  columns: Column[]; 
  ticketsByStatus: Record<string, Ticket[]>;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const activeTicket = useMemo(() => {
    if (!activeId) return null;
    for (const tickets of Object.values(ticketsByStatus)) {
      const ticket = tickets.find((t) => t.id === activeId);
      if (ticket) return ticket;
    }
    return null;
  }, [activeId, ticketsByStatus]);

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    
    if (!over || active.id === over.id) return;
    
    const ticketId = String(active.id);
    const newStatus = String(over.id);
    
    // Find current status
    let currentStatus = '';
    for (const [status, tickets] of Object.entries(ticketsByStatus)) {
      if (tickets.find(t => t.id === ticketId)) {
        currentStatus = status;
        break;
      }
    }
    
    if (currentStatus === newStatus) return;
    
    setIsUpdating(true);
    try {
      await updateTicketStatus(ticketId, newStatus);
      window.location.reload(); // Refresh to see changes
    } catch (error) {
      console.error('Error updating ticket:', error);
      alert('Erro ao atualizar ticket');
    } finally {
      setIsUpdating(false);
    }
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  return (
    <div className={`relative ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((col) => (
            <KanbanColumn 
              key={col.key} 
              column={col} 
              tickets={ticketsByStatus[col.key] || []} 
            />
          ))}
        </div>
        
        <DragOverlay>
          {activeTicket && (
            <div className="rotate-3 scale-105">
              <TicketCard ticket={activeTicket} />
            </div>
          )}
        </DragOverlay>
      </DndContext>
      
      {isUpdating && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl">
          <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg">
            Atualizando...
          </div>
        </div>
      )}
    </div>
  );
}
