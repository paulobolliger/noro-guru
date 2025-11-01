// app/(protected)/webhooks/WebhooksTableClient.tsx
'use client';

import { DataTable } from '@/components/ui/DataTable';

interface WebhookLog {
  id: string;
  provider?: string;
  source?: string;
  vendor?: string;
  event?: string;
  type?: string;
  event_type?: string;
  status?: string;
  delivery_status?: string;
  created_at: string;
  payload?: any;
}

interface WebhooksTableClientProps {
  data: WebhookLog[];
}

export default function WebhooksTableClient({ data }: WebhooksTableClientProps) {
  const columns = [
    {
      key: 'source',
      label: 'Source',
      sortable: true,
      render: (_: any, row: WebhookLog) => {
        const source = row.provider || row.source || row.vendor || '-';
        return (
          <span className="badge badge-secondary">{source}</span>
        );
      },
    },
    {
      key: 'event',
      label: 'Event',
      sortable: true,
      render: (_: any, row: WebhookLog) => {
        const event = row.event || row.type || row.event_type || '-';
        return (
          <span className="font-medium">{event}</span>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (_: any, row: WebhookLog) => {
        const status = row.status || row.delivery_status || 'unknown';
        const statusColors: Record<string, string> = {
          success: 'badge-success',
          delivered: 'badge-success',
          pending: 'badge-warning',
          processing: 'badge-info',
          failed: 'badge-danger',
          error: 'badge-danger',
          unknown: 'badge-secondary',
        };
        return (
          <span className={`badge ${statusColors[status.toLowerCase()] || 'badge-secondary'}`}>
            {status}
          </span>
        );
      },
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

        let timeAgo = '';
        if (diffMins < 1) {
          timeAgo = 'Agora';
        } else if (diffMins < 60) {
          timeAgo = `${diffMins}m atrás`;
        } else if (diffHours < 24) {
          timeAgo = `${diffHours}h atrás`;
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
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      rowKey="id"
      emptyMessage="Nenhum evento de webhook encontrado"
    />
  );
}
