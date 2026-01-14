'use client';

import { Tarefa, deleteTarefa } from '@/app/(protected)/tarefas/tarefas-actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@noro/ui/table';
import { Badge } from '@noro/ui/badge';
import { Button } from '@noro/ui/button';
import { Trash2 } from 'lucide-react';
import { useToast } from '@noro/ui/use-toast';

export default function TarefasList({ tarefas }: { tarefas: Tarefa[] }) {
    const { toast } = useToast();

    async function handleDelete(id: string) {
        if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;
        try {
            await deleteTarefa(id);
            toast({ title: 'Deletado', description: 'Tarefa removida.' });
        } catch (e) {
            toast({ title: 'Erro', variant: 'destructive', description: "Não foi possível excluir a tarefa." });
        }
    }

    return (
        <div className="bg-white rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Título</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Prioridade</TableHead>
                        <TableHead>Vencimento</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tarefas.map(tarefa => (
                        <TableRow key={tarefa.id}>
                            <TableCell className="font-medium">{tarefa.titulo}</TableCell>
                            <TableCell>
                                <Badge variant="outline" className={
                                    tarefa.status === 'concluida' ? 'bg-green-50 text-green-700 border-green-200' :
                                        tarefa.status === 'em_andamento' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''
                                }>
                                    {tarefa.status === 'concluida' ? 'Concluído' :
                                        tarefa.status === 'em_andamento' ? 'Em Andamento' :
                                            tarefa.status === 'pendente' ? 'A Fazer' :
                                                tarefa.status === 'cancelada' ? 'Cancelada' : tarefa.status}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge variant={
                                    tarefa.prioridade === 'alta' || tarefa.prioridade === 'urgente' ? 'destructive' :
                                        tarefa.prioridade === 'media' ? 'default' : 'secondary'
                                }>
                                    {tarefa.prioridade}
                                </Badge>
                            </TableCell>
                            <TableCell>{tarefa.data_vencimento ? new Date(tarefa.data_vencimento).toLocaleDateString() : '-'}</TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(tarefa.id)}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {tarefas.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                Nenhuma tarefa encontrada.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
