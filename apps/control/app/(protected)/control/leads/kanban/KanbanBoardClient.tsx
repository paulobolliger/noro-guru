"use client";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

type Lead = { id: string; organization_name?: string; email?: string; phone?: string };

export default function KanbanBoardClient({ stages, groups }: { stages: { key: string; label: string }[]; groups: Record<string, Lead[]> }) {
  const router = useRouter();
  const [local, setLocal] = useState<Record<string, Lead[]>>(() => ({ ...groups }));
  const stageKeys = useMemo(() => stages.map((s) => s.key), [stages]);

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData("text/plain", id);
  };

  const onDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>, stage: string) => {
      e.preventDefault();
      const id = e.dataTransfer.getData("text/plain");
      if (!id) return;
      // optimistic
      setLocal((prev) => {
        const next: Record<string, Lead[]> = {} as any;
        for (const k of Object.keys(prev)) next[k] = [...prev[k]];
        for (const k of Object.keys(next)) next[k] = next[k].filter((l) => l.id !== id);
        next[stage] = next[stage] || [];
        const lead = Object.values(prev).flat().find((l) => l.id === id);
        if (lead) next[stage].unshift(lead);
        return next;
      });
      try {
        const r = await fetch("/control/leads/kanban/move", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ id, stage }),
        });
        if (!r.ok) throw new Error("move-failed");
        router.refresh();
      } catch {
        setLocal({ ...groups });
        // toast placeholder;
      }
    },
    [router, groups]
  );

  return (
    <div className="grid gap-4 md:grid-cols-5">
      {stages.map((col) => (
        <div
          key={col.key}
          className="border rounded p-3 bg-white/5 min-h-64"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => onDrop(e, col.key)}
        >
          <div className="font-medium mb-2 flex items-center justify-between">
            <span>{col.label}</span>
            <span className="text-xs text-muted">{local[col.key]?.length || 0}</span>
          </div>
          <div className="space-y-2">
            {(local[col.key] || []).map((l) => (
              <div
                key={l.id}
                className="surface-card rounded border p-3 space-y-2"
                draggable
                onDragStart={(e) => onDragStart(e, l.id)}
              >
                <div className="font-medium">{l.organization_name}</div>
                <div className="text-xs text-muted">{l.email || l.phone || "-"}</div>
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      const r = await fetch("/control/leads/kanban/assign", {
                        method: "POST",
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify({ id: l.id }),
                      });
                      if (!r.ok) alert("Falha ao atribuir");
                      router.refresh();
                    }}
                    className="text-xs px-2 py-1 rounded bg-slate-100 hover:bg-slate-200"
                  >
                    Atribuir
                  </button>
                  <button
                    onClick={async () => {
                      const title = prompt("Titulo da tarefa de follow-up", "Contato inicial");
                      if (!title) return;
                      const r = await fetch("/control/leads/kanban/task", {
                        method: "POST",
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify({ id: l.id, title }),
                      });
                      if (!r.ok) alert("Falha ao criar tarefa");
                      router.refresh();
                    }}
                    className="text-xs px-2 py-1 rounded bg-slate-100 hover:bg-slate-200"
                  >
                    Follow-up
                  </button>
                </div>
              </div>
            ))}
            {!(local[col.key]?.length) && <div className="text-xs text-muted">Vazio</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

