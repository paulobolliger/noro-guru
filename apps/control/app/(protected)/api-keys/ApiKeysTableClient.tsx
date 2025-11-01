// app/(protected)/api-keys/ApiKeysTableClient.tsx
'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/ui/DataTable';
import { useToast } from '@/hooks/useToast';

interface ApiKey {
  id: string;
  name: string;
  last4: string;
  scope: string[] | string;
  expires_at?: string;
  created_at: string;
  tenant_id?: string;
}

interface ApiKeysTableClientProps {
  keys: ApiKey[];
  revokeAction: (formData: FormData) => Promise<void>;
}

export default function ApiKeysTableClient({ keys, revokeAction }: ApiKeysTableClientProps) {
  const [revoking, setRevoking] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const toast = useToast();

  const handleRevoke = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja revogar a chave "${name}"?`)) {
      return;
    }

    setRevoking(id);
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('id', id);
        await revokeAction(formData);
        toast.success('API Key revogada', `A chave "${name}" foi revogada com sucesso.`);
        router.refresh();
      } catch (error: any) {
        toast.error('Erro ao revogar chave', error.message || 'Tente novamente mais tarde.');
      } finally {
        setRevoking(null);
      }
    });
  };

  const columns = [
    {
      key: 'name',
      label: 'Nome',
      sortable: true,
      render: (value: string) => (
        <span className="font-medium">{value}</span>
      ),
    },
    {
      key: 'last4',
      label: 'Last4',
      sortable: false,
      render: (value: string) => (
        <span className="font-mono text-sm">••••{value}</span>
      ),
    },
    {
      key: 'scope',
      label: 'Scope',
      sortable: false,
      render: (value: string[] | string) => {
        const scopes = Array.isArray(value) ? value : [String(value)];
        return (
          <div className="flex flex-wrap gap-1">
            {scopes.map((scope, idx) => (
              <span key={idx} className="badge badge-info text-xs">
                {scope}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      key: 'expires_at',
      label: 'Expira',
      sortable: true,
      render: (value: string | undefined) => {
        if (!value) return <span className="text-muted">—</span>;
        const date = new Date(value);
        const now = new Date();
        const isExpired = date < now;
        return (
          <div className="flex flex-col">
            <span className={isExpired ? 'text-red-400' : 'text-sm'}>
              {date.toLocaleDateString('pt-BR')}
            </span>
            {isExpired && (
              <span className="text-xs text-red-400">Expirada</span>
            )}
          </div>
        );
      },
    },
    {
      key: 'created_at',
      label: 'Criada',
      sortable: true,
      render: (value: string) => {
        const date = new Date(value);
        return (
          <div className="flex flex-col">
            <span className="text-sm">{date.toLocaleDateString('pt-BR')}</span>
            <span className="text-xs text-muted">{date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        );
      },
    },
    {
      key: 'id',
      label: 'Ações',
      sortable: false,
      render: (_: any, row: ApiKey) => (
        <button
          onClick={() => handleRevoke(row.id, row.name)}
          disabled={revoking === row.id}
          className="text-rose-400 hover:underline hover:text-rose-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {revoking === row.id ? 'Revogando...' : 'Revogar'}
        </button>
      ),
      className: 'text-right',
    },
  ];

  return (
    <DataTable
      data={keys}
      columns={columns}
      rowKey="id"
      emptyMessage="Nenhuma API key cadastrada"
    />
  );
}
