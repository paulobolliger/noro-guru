'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/useToast';

interface NotificacoesActionsProps {
  markAllReadAction: () => Promise<void>;
}

export function MarkAllReadButton({ markAllReadAction }: NotificacoesActionsProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const toast = useToast();

  const handleMarkAllRead = () => {
    startTransition(async () => {
      try {
        await markAllReadAction();
        toast.success('Notificações atualizadas', 'Todas as notificações foram marcadas como lidas');
        router.refresh();
      } catch (error) {
        console.error('Erro ao marcar notificações:', error);
        toast.error('Erro ao atualizar', 'Não foi possível marcar as notificações como lidas');
      }
    });
  };

  return (
    <button
      onClick={handleMarkAllRead}
      disabled={isPending}
      className="text-sm text-muted hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isPending ? 'Atualizando...' : 'Marcar todas como lidas'}
    </button>
  );
}
