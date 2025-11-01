'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/useToast';
import { createTicket } from './actions';
import { X } from 'lucide-react';

interface CreateTicketFormProps {
  onClose: () => void;
}

export function CreateTicketForm({ onClose }: CreateTicketFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const toast = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await createTicket(formData);
        toast.success('Ticket criado!', 'O ticket foi criado com sucesso');
        router.refresh();
        onClose();
        (e.target as HTMLFormElement).reset();
      } catch (error) {
        console.error('Erro ao criar ticket:', error);
        toast.error(
          'Erro ao criar ticket',
          error instanceof Error ? error.message : 'Tente novamente'
        );
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="surface-card rounded-xl max-w-2xl w-full p-6 shadow-xl border border-default">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-primary">Novo Ticket</h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-primary transition-colors"
            disabled={isPending}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-primary mb-2">
              Assunto *
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              required
              disabled={isPending}
              className="w-full px-4 py-2 rounded-lg bg-surface border border-default text-primary focus:ring-2 focus:ring-accent focus:border-transparent disabled:opacity-50"
              placeholder="Resumo do ticket"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-primary mb-2">
              Descrição *
            </label>
            <textarea
              id="description"
              name="description"
              required
              disabled={isPending}
              rows={4}
              className="w-full px-4 py-2 rounded-lg bg-surface border border-default text-primary focus:ring-2 focus:ring-accent focus:border-transparent disabled:opacity-50 resize-none"
              placeholder="Descreva o problema ou solicitação em detalhes"
            />
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-primary mb-2">
              Prioridade
            </label>
            <select
              id="priority"
              name="priority"
              disabled={isPending}
              className="w-full px-4 py-2 rounded-lg bg-surface border border-default text-primary focus:ring-2 focus:ring-accent focus:border-transparent disabled:opacity-50"
            >
              <option value="low">Baixa</option>
              <option value="normal" defaultChecked>Normal</option>
              <option value="high">Alta</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-6 py-2 rounded-lg border border-default text-muted hover:text-primary hover:border-primary transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2 rounded-lg bg-accent text-white hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Criando...' : 'Criar Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
