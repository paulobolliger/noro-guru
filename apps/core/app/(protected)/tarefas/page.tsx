import { getTarefas } from './tarefas-actions';
import TarefasContainer from '@/components/tarefas/TarefasContainer';
import { CalendarCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function TarefasPage() {
  const tarefas = await getTarefas();

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <CalendarCheck size={32} className="text-gray-700" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Tarefas</h1>
          <p className="text-gray-600">Centralize suas pendências em um só lugar.</p>
        </div>
      </div>

      <TarefasContainer initialTarefas={tarefas} />
    </div>
  );
}
