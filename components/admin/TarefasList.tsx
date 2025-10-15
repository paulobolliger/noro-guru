// components/admin/TarefasList.tsx
import Link from 'next/link';
import { Tarefa } from '@/types/admin';

interface TarefasListProps {
  tarefas: (Tarefa & { nomade_leads?: { nome: string } | null })[];
}

export default function TarefasList({ tarefas }: TarefasListProps) {
  const getPrioridadeColor = (prioridade: string) => {
    const colors: Record<string, string> = {
      baixa: 'bg-green-100 text-green-700',
      media: 'bg-yellow-100 text-yellow-700',
      alta: 'bg-red-100 text-red-700',
      urgente: 'bg-red-500 text-white',
    };
    return colors[prioridade] || 'bg-gray-100 text-gray-700';
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
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Tarefas Pendentes</h2>
        <Link href="/admin/tarefas" className="text-blue-600 text-sm font-semibold hover:text-blue-700">
          + Nova tarefa
        </Link>
      </div>
      <div className="space-y-3">
        {tarefas.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Nenhuma tarefa pendente</p>
        ) : (
          tarefas.map((tarefa) => (
            <div
              key={tarefa.id}
              className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <input
                type="checkbox"
                className="mt-1 w-4 h-4 text-blue-600 rounded cursor-pointer"
                onChange={() => {
                  // TODO: Implementar marcar como concluída
                }}
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{tarefa.titulo}</p>
                {tarefa.nomade_leads && (
                  <p className="text-sm text-gray-600 mt-1">
                    Lead: {tarefa.nomade_leads.nome}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getPrioridadeColor(tarefa.prioridade)}`}>
                    {tarefa.prioridade.charAt(0).toUpperCase() + tarefa.prioridade.slice(1)}
                  </span>
                  <span className="text-xs text-gray-500">
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