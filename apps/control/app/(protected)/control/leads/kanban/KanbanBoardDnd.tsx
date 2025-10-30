"use client";
import { DndContext, PointerSensor, useSensor, useSensors, DragEndEvent, DragStartEvent, closestCorners, DragOverlay, useDroppable } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMemo, useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/../../packages/ui/use-toast';

type Lead = { id: string; organization_name?: string; email?: string; phone?: string };
type Column = { key: string; label: string };

function LeadItem({ lead }: { lead: Lead }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: lead.id });
  const { toast } = useToast();
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  } as React.CSSProperties;
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="surface-card rounded-lg border p-3 shadow-sm hover:shadow transition">
      <div className="font-medium text-primary">{lead.organization_name}</div>
      <div className="text-xs text-muted mt-0.5">{lead.email || lead.phone || '-'}</div>
      <div className="flex gap-2 mt-2">
        <button
          onClick={async () => {
            const r = await fetch('/control/leads/kanban/assign', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id: lead.id }) });
            if (!r.ok) {
              toast({ variant: 'destructive', title: 'Falha ao atribuir' });
            } else {
              toast({ title: 'Atribuído', description: 'Lead atribuído ao responsável.' });
            }
          }}
          className="text-xs px-2 py-1 rounded bg-slate-100 hover:bg-slate-200"
        >
          Atribuir
        </button>
        <button
          onClick={async () => {
            const title = prompt('Titulo da tarefa de follow-up', 'Contato inicial');
            if (!title) return;
            const r = await fetch('/control/leads/kanban/task', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id: lead.id, title }) });
            if (!r.ok) {
              toast({ variant: 'destructive', title: 'Falha ao criar tarefa' });
            } else {
              toast({ title: 'Tarefa criada', description: `"${title}" adicionada.` });
            }
          }}
          className="text-xs px-2 py-1 rounded bg-slate-100 hover:bg-slate-200"
        >
          Follow-up
        </button>
      </div>
    </div>
  );
}

export default function KanbanBoardDnd({ stages, groups }: { stages: Column[]; groups: Record<string, Lead[]> }) {
  const sensors = useSensors(useSensor(PointerSensor));
  const [columns, setColumns] = useState<Record<string, Lead[]>>({ ...groups });
  const [activeId, setActiveId] = useState<string | null>(null);
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
        className={`space-y-2 pr-2 transition-colors ${isOver ? 'bg-blue-50 ring-2 ring-blue-200 rounded-lg' : ''}`}
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
                    <div className="text-xs text-muted border-2 border-dashed border-default rounded-lg p-6 text-center">
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
          <div className="rounded-lg border surface-card p-3 shadow-[0_12px_40px_rgba(0,0,0,0.18)] rotate-1 scale-[1.02] transition">
            <div className="font-medium text-primary">{activeLead.organization_name}</div>
            <div className="text-xs text-muted mt-0.5">{activeLead.email || activeLead.phone || '-'}</div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
