'use client';

import { Tarefa, updateTarefaStatus } from '@/app/(protected)/tarefas/tarefas-actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useTransition } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface KanbanProps {
    tarefas: Tarefa[];
}

const COLUMNS = [
    { id: 'pendente', title: 'A Fazer', color: 'bg-gray-100', border: 'border-gray-200' },
    { id: 'em_andamento', title: 'Em Andamento', color: 'bg-blue-50', border: 'border-blue-200' },
    { id: 'concluida', title: 'Concluído', color: 'bg-green-50', border: 'border-green-200' }
];

export default function TarefasKanban({ tarefas }: KanbanProps) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleDragStart = (e: React.DragEvent, id: string) => {
        e.dataTransfer.setData('taskId', id);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, status: string) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');

        startTransition(async () => {
            try {
                await updateTarefaStatus(taskId, status);
                toast({ title: "Tarefa atualizada", description: `Movida para ${status}`, variant: "success" });
            } catch (error) {
                toast({ title: "Erro", description: "Não foi possível mover a tarefa", variant: "destructive" });
            }
        });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
            {COLUMNS.map((col) => {
                const colTarefas = tarefas.filter(t =>
                    (t.status === col.id) ||
                    (col.id === 'pendente' && !['em_andamento', 'concluida'].includes(t.status))
                );

                return (
                    <div
                        key={col.id}
                        className={`flex flex-col h-full rounded-xl border ${col.border} ${col.color} p-4`}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, col.id)}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-700">{col.title}</h3>
                            <Badge className="bg-white text-gray-700 border-gray-200">{colTarefas.length}</Badge>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-3">
                            {colTarefas.map((tarefa) => (
                                <div
                                    key={tarefa.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, tarefa.id)}
                                    className="cursor-move"
                                >
                                    <Card className="shadow-sm hover:shadow-md transition-shadow">
                                        <CardHeader className="p-4 pb-2">
                                            <div className="flex justify-between items-start">
                                                <CardTitle className="text-sm font-medium leading-tight">
                                                    {tarefa.titulo}
                                                </CardTitle>
                                                <Badge className={
                                                    tarefa.prioridade === 'alta' || tarefa.prioridade === 'urgente'
                                                        ? 'text-[10px] px-1 py-0 h-5 bg-red-100 text-red-700 border-red-200'
                                                        : tarefa.prioridade === 'media'
                                                            ? 'text-[10px] px-1 py-0 h-5 bg-blue-100 text-blue-700 border-blue-200'
                                                            : 'text-[10px] px-1 py-0 h-5 bg-gray-100 text-gray-700 border-gray-200'
                                                }>
                                                    {tarefa.prioridade}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-2">
                                            {tarefa.descricao && (
                                                <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                                                    {tarefa.descricao}
                                                </p>
                                            )}
                                            <div className="flex items-center text-xs text-gray-400 gap-2">
                                                {tarefa.data_vencimento && (
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        <span>{new Date(tarefa.data_vencimento).toLocaleDateString()}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                            {colTarefas.length === 0 && (
                                <div className="text-center py-10 text-gray-400 text-sm border-2 border-dashed border-gray-300/50 rounded-lg">
                                    Arraste itens aqui
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
