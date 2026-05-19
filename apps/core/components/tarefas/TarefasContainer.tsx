'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { List, Kanban } from 'lucide-react';
import TarefasKanban from './TarefasKanban';
import TarefasList from './TarefasList';
import TarefaDialog from './TarefaDialog';
import { Tarefa } from '@/app/(protected)/tarefas/tarefas-actions';

export default function TarefasContainer({ initialTarefas }: { initialTarefas: Tarefa[] }) {
    const [view, setView] = useState<'list' | 'kanban'>('kanban');

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
                    <Button
                        variant={view === 'list' ? 'secondary' : 'ghost'}
                        onClick={() => setView('list')}
                        size="sm"
                        className="h-8"
                    >
                        <List className="mr-2 h-4 w-4" /> Lista
                    </Button>
                    <Button
                        variant={view === 'kanban' ? 'secondary' : 'ghost'}
                        onClick={() => setView('kanban')}
                        size="sm"
                        className="h-8"
                    >
                        <Kanban className="mr-2 h-4 w-4" /> Kanban
                    </Button>
                </div>

                <TarefaDialog />
            </div>

            <div className="min-h-[500px]">
                {view === 'kanban' ? (
                    <TarefasKanban tarefas={initialTarefas} />
                ) : (
                    <TarefasList tarefas={initialTarefas} />
                )}
            </div>
        </div>
    );
}
