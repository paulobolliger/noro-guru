"use client";
import { DndContext, PointerSensor, useSensor, useSensors, DragEndEvent, DragStartEvent, DragOverEvent, closestCorners, DragOverlay, useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMemo, useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/../../packages/ui/use-toast';
import { GripVertical, Clock, User } from 'lucide-react';

type Lead = { 
  id: string; 
  organization_name?: string; 
  email?: string; 
  phone?: string;
  source?: string;
  value_cents?: number;
  created_at?: string;
  owner?: string;
  stage?: string;
};
type Column = { key: string; label: string };

function LeadItem({ lead }: { lead: Lead }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: lead.id });
  const { toast } = useToast();
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  } as React.CSSProperties;
  
  // Format value
  const valueFormatted = lead.value_cents 
    ? (lead.value_cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : null;
  
  // Format date
  const dateFormatted = lead.created_at 
    ? new Date(lead.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
    : null;
  
  // Calculate days in stage (mock - você pode calcular real depois)
  const daysInStage = lead.created_at 
    ? Math.floor((Date.now() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60 * 24))
    : null;
  
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
          {/* Header: Nome da empresa */}
          <div className="font-semibold text-[#D4AF37] mb-2 line-clamp-1">{lead.organization_name || 'Sem nome'}</div>
          
          {/* Contact Info */}
          <div className="space-y-1 mb-3 text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="line-clamp-1">{lead.email || lead.phone || '—'}</span>
            </div>
            {lead.source && (
              <div className="flex items-center gap-1.5">
                <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="line-clamp-1">{lead.source}</span>
              </div>
            )}
          </div>
          
          {/* Value, Date and Days */}
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/10 text-xs">
            <div className="flex items-center gap-3">
              {valueFormatted && (
                <div className="font-semibold text-emerald-400">{valueFormatted}</div>
              )}
              {daysInStage !== null && (
                <div className="flex items-center gap-1 text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>{daysInStage}d</span>
                </div>
              )}
            </div>
            {dateFormatted && (
              <div className="text-gray-500">{dateFormatted}</div>
            )}
          </div>
          
          {/* Actions */}
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={async (e) => {
                e.stopPropagation();
                const r = await fetch('/control/leads/kanban/assign', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id: lead.id }) });
                if (!r.ok) {
                  toast({ variant: 'destructive', title: 'Falha ao atribuir' });
                } else {
                  toast({ variant: 'success', title: 'Atribuído', description: 'Lead atribuído ao responsável.' });
                }
              }}
              className="text-xs px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors flex-1 text-gray-300"
            >
              Atribuir
            </button>
            <button
              onClick={async (e) => {
                e.stopPropagation();
                const title = prompt('Titulo da tarefa de follow-up', 'Contato inicial');
                if (!title) return;
                const r = await fetch('/control/leads/kanban/task', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id: lead.id, title }) });
                if (!r.ok) {
                  toast({ variant: 'destructive', title: 'Falha ao criar tarefa' });
                } else {
                  toast({ variant: 'success', title: 'Tarefa criada', description: `"${title}" adicionada.` });
                }
              }}
              className="text-xs px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors flex-1 text-gray-300"
            >
              Follow-up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function KanbanBoardDnd({ stages, groups }: { stages: Column[]; groups: Record<string, Lead[]> }) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Precisa arrastar 8px antes de ativar (evita drag acidental)
      },
    })
  );
  const [columns, setColumns] = useState<Record<string, Lead[]>>({ ...groups });
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const headerGradients: Record<string,string> = {
    novo: 'from-[#5053c4] to-[#333176]',
    contato_inicial: 'from-cyan-500 to-sky-500',
    qualificado: 'from-teal-500 to-emerald-500',
    proposta: 'from-[#5053c4] to-[#342ca4]',
    negociacao: 'from-orange-500 to-amber-500',
    ganho: 'from-emerald-600 to-green-600',
    perdido: 'from-rose-600 to-red-600',
  };

  function ColumnDroppable({ id, children }: { id: string; children: React.ReactNode }) {
    const { setNodeRef, isOver } = useDroppable({ id });
    return (
      <div
        ref={setNodeRef}
        className={`space-y-2 pr-2 transition-colors ${
          isOver ? 'bg-blue-50 dark:bg-blue-950/30 ring-2 ring-blue-400 rounded-lg' : ''
        } ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}
        style={{ minHeight: 120 }}
      >
        {children}
      </div>
    );
  }

  const itemsByCol = useMemo(() => {
    const out: Record<string, string[]> = {};
    stages.forEach((c) => (out[c.key] = (columns[c.key] || []).map((l) => l.id)));
    return out;
  }, [columns, stages]);

  function findContainer(id: string): string | null {
    if (columns[id as any]) return id; // it's a column key
    for (const k of Object.keys(columns)) {
      if ((columns[k] || []).some((l) => l.id === id)) return k;
    }
    return null;
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;
    const activeCol = findContainer(String(active.id));
    const overCol = findContainer(String(over.id));
    if (!activeCol || !overCol) return;

    if (activeCol === overCol) {
      const from = itemsByCol[activeCol].indexOf(String(active.id));
      const to = itemsByCol[overCol].indexOf(String(over.id));
      const next = arrayMove(columns[activeCol], from, to);
      setColumns((prev) => ({ ...prev, [activeCol]: next }));
      // persist order for this column
      try {
        const ids = next.map((l) => l.id);
        await fetch('/control/leads/kanban/reorder', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ stage: activeCol, ids }) });
      } catch {}
      return;
    }

    // move between columns (optimistic)
    const id = String(active.id);
    const lead = columns[activeCol].find((l) => l.id === id);
    setColumns((prev) => ({
      ...prev,
      [activeCol]: prev[activeCol].filter((l) => l.id !== id),
      [overCol]: [lead!, ...prev[overCol]],
    }));
    
    setIsUpdating(true);
    try {
      const r = await fetch('/control/leads/kanban/move', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id, stage: overCol }) });
      if (!r.ok) {
        let details = '';
        try { const j = await r.json(); details = j?.error || JSON.stringify(j); } catch {}
        throw new Error(details || 'move-failed');
      }
      // also persist new order in target column
      try { const ids = (columns[overCol] || []).map((l) => l.id); await fetch('/control/leads/kanban/reorder', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ stage: overCol, ids }) }); } catch {}
      toast({ variant: 'success', title: 'Lead movido', description: `${lead?.organization_name || id} → ${overCol}` });
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Falha ao mover', description: e?.message || String(e) });
      // revert
      setColumns({ ...groups });
    } finally {
      setIsUpdating(false);
    }
  };

  const activeLead: Lead | undefined = (() => {
    if (!activeId) return undefined;
    for (const k of Object.keys(columns)) {
      const f = (columns[k] || []).find((l) => l.id === activeId);
      if (f) return f;
    }
    return undefined;
  })();

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {stages.map((col) => (
          <Card key={col.key} className="bg-white/5 w-80 flex-shrink-0">
            <CardHeader className={`text-white rounded-t-xl bg-gradient-to-r ${headerGradients[col.key] || 'from-[#5053c4] to-[#342ca4]'}`}>
              <div className="flex items-center justify-between">
                <div className="font-medium">{col.label}</div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="bg-white/20 rounded-full px-2 py-0.5">{columns[col.key]?.length || 0}</span>
                  {Boolean((columns[col.key]||[]).length) && (
                    <span className="bg-white/20 rounded-full px-2 py-0.5">
                      R$ {(((columns[col.key]||[]).reduce((a:any,l:any)=>a+(l.value_cents||0),0))/100).toLocaleString('pt-BR')}
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-3">
              <ScrollArea className="max-h-[70vh]">
                <ColumnDroppable id={col.key}>
                  <SortableContext items={itemsByCol[col.key]} strategy={verticalListSortingStrategy}>
                    {(columns[col.key] || []).map((l) => (
                      <LeadItem key={l.id} lead={l} />
                    ))}
                  </SortableContext>
                  {!(columns[col.key]?.length) && (
                    <div className="text-xs text-muted border-2 border-dashed border-default rounded-lg p-6 text-center bg-white/5 hover:bg-white/10 transition-colors">
                      Arraste leads para cá
                    </div>
                  )}
                </ColumnDroppable>
              </ScrollArea>
            </CardContent>
          </Card>
        ))}
      </div>
      <DragOverlay>
        {activeLead ? (
          <div className="rounded-lg border border-default p-3 shadow-[0_20px_60px_rgba(0,0,0,0.3)] rotate-3 scale-105 transition-transform bg-[#1a1625]">
            <div className="flex items-start gap-2">
              <GripVertical className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-semibold text-[#D4AF37] mb-2">{activeLead.organization_name || 'Sem nome'}</div>
                <div className="text-xs text-gray-400 mb-2">{activeLead.email || activeLead.phone || '—'}</div>
                {activeLead.value_cents && (
                  <div className="text-sm font-semibold text-emerald-400">
                    {(activeLead.value_cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
