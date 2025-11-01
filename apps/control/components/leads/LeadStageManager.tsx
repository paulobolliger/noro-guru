"use client";
import { useState, useTransition } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useToast } from "@/../../packages/ui/use-toast";
import { createStage, updateStage, deleteStage, reorderStages } from "@/app/(protected)/control/leads/stages/actions";
import { X, GripVertical, Plus, CheckCircle2, XCircle, Save, Trash2 } from "lucide-react";

type Stage = {
  id: string;
  slug: string;
  label: string;
  ord: number;
  is_won: boolean;
  is_lost: boolean;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  initialStages: Stage[];
};

function SortableStageItem({ stage, onUpdate, onDelete }: { stage: Stage; onUpdate: (id: string, updates: Partial<Stage>) => void; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: stage.id });
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(stage.label);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = () => {
    if (label.trim()) {
      onUpdate(stage.id, { label: label.trim() });
      setIsEditing(false);
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-3 p-3 rounded-lg border border-default surface-card hover:border-primary/30 transition-colors group">
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-muted hover:text-primary transition-colors">
        <GripVertical className="w-4 h-4" />
      </div>
      
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') { setLabel(stage.label); setIsEditing(false); }
            }}
            className="w-full px-2 py-1 rounded border border-primary bg-transparent text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            autoFocus
          />
        ) : (
          <div className="flex items-center gap-2">
            <span className="font-medium text-primary">{stage.label}</span>
            <span className="text-xs text-muted">({stage.slug})</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onUpdate(stage.id, { is_won: !stage.is_won })}
          className={`p-1.5 rounded transition-colors ${stage.is_won ? 'bg-emerald-500/20 text-emerald-400' : 'text-muted hover:bg-white/5'}`}
          title="Marcar como vitória"
        >
          <CheckCircle2 className="w-4 h-4" />
        </button>
        
        <button
          type="button"
          onClick={() => onUpdate(stage.id, { is_lost: !stage.is_lost })}
          className={`p-1.5 rounded transition-colors ${stage.is_lost ? 'bg-rose-500/20 text-rose-400' : 'text-muted hover:bg-white/5'}`}
          title="Marcar como perda"
        >
          <XCircle className="w-4 h-4" />
        </button>

        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="p-1.5 rounded text-muted hover:text-primary hover:bg-white/5 transition-colors opacity-0 group-hover:opacity-100"
            title="Editar"
          >
            <Save className="w-4 h-4" />
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            if (confirm(`Deletar stage "${stage.label}"?`)) {
              onDelete(stage.id);
            }
          }}
          className="p-1.5 rounded text-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors opacity-0 group-hover:opacity-100"
          title="Deletar"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function LeadStageManager({ isOpen, onClose, initialStages }: Props) {
  const [stages, setStages] = useState<Stage[]>(initialStages);
  const [newStageLabel, setNewStageLabel] = useState("");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setStages((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      const newOrder = arrayMove(items, oldIndex, newIndex);
      
      // Update server
      startTransition(async () => {
        try {
          const formData = new FormData();
          formData.append("ids", JSON.stringify(newOrder.map(s => s.id)));
          await reorderStages(formData);
          toast({ variant: "success", title: "Ordem atualizada" });
        } catch (error: any) {
          toast({ variant: "destructive", title: "Erro ao reordenar", description: error.message });
          setStages(items); // revert
        }
      });
      
      return newOrder;
    });
  };

  const handleCreate = () => {
    if (!newStageLabel.trim()) return;

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("label", newStageLabel.trim());
        formData.append("slug", newStageLabel.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_"));
        await createStage(formData);
        toast({ variant: "success", title: "Stage criada", description: `"${newStageLabel}" adicionada ao pipeline.` });
        setNewStageLabel("");
        window.location.reload(); // refresh to get new stage
      } catch (error: any) {
        toast({ variant: "destructive", title: "Erro ao criar stage", description: error.message });
      }
    });
  };

  const handleUpdate = (id: string, updates: Partial<Stage>) => {
    const stage = stages.find(s => s.id === id);
    if (!stage) return;

    // Optimistic update
    setStages(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("id", id);
        if (updates.label) formData.append("label", updates.label);
        formData.append("is_won", String(updates.is_won ?? stage.is_won));
        formData.append("is_lost", String(updates.is_lost ?? stage.is_lost));
        await updateStage(formData);
        toast({ variant: "success", title: "Stage atualizada" });
      } catch (error: any) {
        toast({ variant: "destructive", title: "Erro ao atualizar", description: error.message });
        setStages(initialStages); // revert
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("id", id);
        await deleteStage(formData);
        setStages(prev => prev.filter(s => s.id !== id));
        toast({ variant: "success", title: "Stage deletada" });
      } catch (error: any) {
        toast({ variant: "destructive", title: "Erro ao deletar", description: error.message });
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-xl border border-default surface-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-default bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent">
          <div>
            <h2 className="text-xl font-semibold text-primary">Gerenciar Pipeline</h2>
            <p className="text-sm text-muted mt-1">Adicione, remova ou reordene as etapas do seu pipeline de vendas</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 text-muted hover:text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Add new stage */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-primary mb-2">Nova Stage</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newStageLabel}
                onChange={(e) => setNewStageLabel(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                placeholder="Ex: Qualificação, Proposta Enviada..."
                className="flex-1 px-3 py-2 rounded-lg border border-default bg-transparent text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
                disabled={isPending}
              />
              <button
                onClick={handleCreate}
                disabled={!newStageLabel.trim() || isPending}
                className="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Adicionar
              </button>
            </div>
          </div>

          {/* Stages list */}
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-primary">Etapas do Pipeline</label>
              <span className="text-xs text-muted">{stages.length} etapa(s)</span>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={stages.map(s => s.id)} strategy={verticalListSortingStrategy}>
                {stages.map((stage) => (
                  <SortableStageItem
                    key={stage.id}
                    stage={stage}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                  />
                ))}
              </SortableContext>
            </DndContext>

            {!stages.length && (
              <div className="text-center py-12 text-muted border-2 border-dashed border-default rounded-lg">
                <p className="text-sm">Nenhuma stage cadastrada</p>
                <p className="text-xs mt-1">Adicione a primeira etapa do seu pipeline acima</p>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10">
            <p className="text-xs font-medium text-primary mb-2">Legenda:</p>
            <div className="space-y-1 text-xs text-muted">
              <div className="flex items-center gap-2">
                <GripVertical className="w-3 h-3" />
                <span>Arraste para reordenar</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Marcar como stage de vitória (lead ganho)</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="w-3 h-3 text-rose-400" />
                <span>Marcar como stage de perda (lead perdido)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-default bg-gradient-to-t from-black/20 to-transparent">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-default text-primary hover:bg-white/5 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
