// app/(protected)/notificacoes/NotificacoesTableClient.tsx
'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Trash2 } from 'lucide-react';
import { DataTable, type BulkAction } from '@/components/ui/DataTable';
import { useToast } from '@/hooks/useToast';
import { markNotificationAsRead } from './actions';
import { bulkMarkAsRead, bulkDeleteNotifications } from './bulkActions';
import type { FilterConfig } from '@/components/ui/FilterBar';

interface Notificacao {
  id: string;
  titulo: string;
  mensagem?: string;
  lida: boolean;
  created_at: string;
  user_id: string;
  tenant_id?: string;
}

interface NotificacoesTableClientProps {
  data: Notificacao[];
}

export default function NotificacoesTableClient({ data }: NotificacoesTableClientProps) {
  const [isPending, startTransition] = useTransition();
  const [markingId, setMarkingId] = useState<string | null>(null);
  const router = useRouter();
  const toast = useToast();

  // Configuração de filtros
  const filters: FilterConfig[] = [
    {
      key: 'lida',
      label: 'Status',
      type: 'multi-select',
      options: [
        { value: 'true', label: 'Lida', color: '#64748b' },
        { value: 'false', label: 'Nova', color: '#D4AF37' },
      ],
    },
    {
      key: 'created_at',
      label: 'Período',
      type: 'date-range',
    },
  ];

  // Ações em lote
  const bulkActions: BulkAction<Notificacao>[] = [
    {
      id: 'mark-read',
      label: 'Marcar como lida',
      icon: <Check size={16} />,
      variant: 'success',
      action: async (selected) => {
        try {
          const ids = selected.map(n => n.id);
          const result = await bulkMarkAsRead(ids);
          toast.success(
            'Notificações atualizadas',
            `${result.count} ${result.count === 1 ? 'notificação marcada' : 'notificações marcadas'} como lida`
          );
          router.refresh();
        } catch (error) {
          toast.error('Erro ao atualizar', 'Não foi possível marcar as notificações');
        }
      },
    },
    {
      id: 'delete',
      label: 'Excluir',
      icon: <Trash2 size={16} />,
      variant: 'danger',
      confirmMessage: 'Tem certeza que deseja excluir {count} notificações? Esta ação não pode ser desfeita.',
      action: async (selected) => {
        try {
          const ids = selected.map(n => n.id);
          const result = await bulkDeleteNotifications(ids);
          toast.success(
            'Notificações excluídas',
            `${result.count} ${result.count === 1 ? 'notificação excluída' : 'notificações excluídas'} com sucesso`
          );
          router.refresh();
        } catch (error) {
          toast.error('Erro ao excluir', 'Não foi possível excluir as notificações');
        }
      },
    },
  ];

  const handleMarkAsRead = (id: string) => {
    setMarkingId(id);
    startTransition(async () => {
      try {
        await markNotificationAsRead(id);
        toast.success('Marcada como lida', 'Notificação atualizada com sucesso');
        router.refresh();
      } catch (error) {
        console.error('Erro ao marcar notificação:', error);
        toast.error('Erro ao atualizar', 'Não foi possível marcar a notificação como lida');
      } finally {
        setMarkingId(null);
      }
    });
  };

  const columns = [
    {
      key: 'lida',
      label: '',
      sortable: false,
      render: (value: boolean) => (
        <div className="flex items-center justify-center">
          {!value && (
            <div className="w-2 h-2 bg-accent rounded-full" title="Não lida" />
          )}
        </div>
      ),
      className: 'w-8',
    },
    {
      key: 'titulo',
      label: 'Título',
      sortable: true,
      render: (value: string, row: Notificacao) => (
        <div 
          className={`flex flex-col ${!row.lida ? 'cursor-pointer' : ''}`}
          onClick={() => !row.lida && handleMarkAsRead(row.id)}
        >
          <span className={`font-medium ${!row.lida ? 'text-primary' : 'text-muted'} ${markingId === row.id ? 'opacity-50' : ''}`}>
            {value}
          </span>
          {row.mensagem && (
            <span className="text-sm text-muted mt-1">{row.mensagem}</span>
          )}
        </div>
      ),
    },
    {
      key: 'created_at',
      label: 'Data',
      sortable: true,
      render: (value: string) => {
        const date = new Date(value);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        let timeAgo = '';
        if (diffMins < 1) {
          timeAgo = 'Agora mesmo';
        } else if (diffMins < 60) {
          timeAgo = `${diffMins} min atrás`;
        } else if (diffHours < 24) {
          timeAgo = `${diffHours}h atrás`;
        } else if (diffDays < 7) {
          timeAgo = `${diffDays}d atrás`;
        } else {
          timeAgo = date.toLocaleDateString('pt-BR');
        }

        return (
          <div className="flex flex-col">
            <span className="text-sm">{timeAgo}</span>
            <span className="text-xs text-muted">
              {date.toLocaleString('pt-BR', { 
                day: '2-digit', 
                month: '2-digit', 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
        );
      },
      className: 'w-32',
    },
    {
      key: 'lida',
      label: 'Status',
      sortable: true,
      render: (value: boolean) => (
        <span className={`badge ${value ? 'badge-secondary' : 'badge-info'}`}>
          {value ? 'Lida' : 'Nova'}
        </span>
      ),
      className: 'w-24',
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      rowKey="id"
      searchable
      searchPlaceholder="Buscar notificações..."
      emptyMessage="Sem notificações"
      filters={filters}
      filterStorageKey="notificacoes"
      selectable
      bulkActions={bulkActions}
      pagination
      pageSize={25}
      pageSizeOptions={[10, 25, 50, 100]}
      exportable
      exportConfig={{
        filename: 'notificacoes',
        formats: ['csv'],
        includeFiltered: true,
      }}
    />
  );
}
