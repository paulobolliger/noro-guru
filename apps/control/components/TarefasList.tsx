// components/admin/TarefasList.tsx
import Link from 'next/link';
import { Tarefa } from "@noro-types/admin";

interface TarefasListProps {
  tarefas: (Tarefa & { noro_leads?: { nome: string } | null })[];
}

export default function TarefasList({ tarefas }: TarefasListProps) {
  const getPrioridadeColor = (prioridade: string) => {
    const colors: Record<string, string> = {
      baixa: 'bg-green-100 text-green-700',
      media: 'bg-yellow-100 text-yellow-700',
      alta: 'bg-red-100 text-red-700',
      urgente: 'bg-red-500 text-white',
    };
    return colors[prioridade] || 'bg-white/10 text-primary';
  };

  const getDataVencimento = (data: string | null) => {
    if (!data) return 'Sem prazo';
    const hoje = new Date();
    const vencimento = new Date(data);
    const diff = Math.ceil((vencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));

    if (diff < 0) return 'Atrasado';
    if (diff === 0) return 'Hoje';
    if (diff === 1) return 'Amanhã';
    return `${diff} dias`;
  };

  return (
    <div className="surface-card rounded-xl p-6 shadow-sm border border-default">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-primary">Tarefas Pendentes</h2>
        <Link href="/admin/tarefas" className="text-link text-sm font-semibold">
          + Nova tarefa
        </Link>
      </div>
      <div className="space-y-3">
        {tarefas.length === 0 ? (
          <p className="text-muted text-center py-8">Nenhuma tarefa pendente</p>
        ) : (
          tarefas.map((tarefa) => (
            <div
              key={tarefa.id}
              className="flex items-start gap-3 rounded-lg border border-default bg-[var(--color-surface-alt)] p-3 transition-colors cursor-pointer hover:border-[rgba(29,211,192,0.25)] hover:bg-[rgba(29,211,192,0.08)]"
            >
              <input
                type="checkbox"
                className="mt-1 w-4 h-4 text-success rounded cursor-pointer"
                onChange={() => {
                  // TODO: Implementar marcar como concluída
                }}
              />
              <div className="flex-1">
                <p className="font-medium text-primary">{tarefa.titulo}</p>
                {tarefa.noro_leads && (
                  <p className="text-sm text-muted mt-1">
                    Lead: {tarefa.noro_leads.nome}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getPrioridadeColor(tarefa.prioridade)}`}>
                    {tarefa.prioridade.charAt(0).toUpperCase() + tarefa.prioridade.slice(1)}
                  </span>
                  <span className="text-xs text-muted">
                    {getDataVencimento(tarefa.data_vencimento)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}



