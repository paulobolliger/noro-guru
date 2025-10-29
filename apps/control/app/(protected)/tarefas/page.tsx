"use client";
import { CalendarCheck } from 'lucide-react';
import Link from 'next/link';
import { useTickets } from '@/hooks/useTickets';

export default function TarefasPage() {
  const { tickets, isLoading } = useTickets();
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <CalendarCheck size={32} className="text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-primary">Gestão de Tarefas</h1>
            <p className="text-muted mt-1">Tickets de suporte e atividades operacionais.</p>
          </div>
        </div>
      </div>

      <div className="surface-card rounded-xl p-6 shadow-sm border border-default">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-primary">Tickets recentes</h2>
        </div>
        {isLoading ? (
          <div className="text-sm text-muted">Carregando...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-white/5 border-b border-default">
                <tr>
                  <th className="text-left px-4 py-2 text-muted">Assunto</th>
                  <th className="text-left px-4 py-2 text-muted">Status</th>
                  <th className="text-left px-4 py-2 text-muted">Prioridade</th>
                  <th className="text-left px-4 py-2 text-muted">Atualizado</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t: any) => (
                  <tr key={t.id} className="border-t border-white/10 hover:bg-white/[0.02]">
                    <td className="px-4 py-2">{t.subject}</td>
                    <td className="px-4 py-2">{t.status}</td>
                    <td className="px-4 py-2">{t.priority}</td>
                    <td className="px-4 py-2 text-muted">{t.updated_at}</td>
                    <td className="px-4 py-2 text-right">
                      <Link href={`/support/${t.id}`} className="text-indigo-300 hover:underline">Abrir</Link>
                    </td>
                  </tr>
                ))}
                {!tickets.length && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-muted">Sem tickets</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}