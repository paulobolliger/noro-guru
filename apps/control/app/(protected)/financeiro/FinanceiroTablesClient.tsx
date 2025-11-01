// app/(protected)/financeiro/FinanceiroTablesClient.tsx
'use client';

import { DataTable } from '@/components/ui/DataTable';

interface LedgerAccount {
  id: string;
  code: string;
  name: string;
  type: string;
}

interface LedgerEntry {
  account_id: string;
  tenant_id?: string;
  amount_cents: number;
  memo?: string;
  occurred_at: string;
}

interface FinanceiroTablesClientProps {
  accounts: LedgerAccount[];
  entries: LedgerEntry[];
}

export default function FinanceiroTablesClient({ accounts, entries }: FinanceiroTablesClientProps) {
  const accountsColumns = [
    {
      key: 'code',
      label: 'Código',
      sortable: true,
      render: (value: string) => (
        <span className="font-mono text-sm">{value}</span>
      ),
    },
    {
      key: 'name',
      label: 'Conta',
      sortable: true,
    },
    {
      key: 'type',
      label: 'Tipo',
      sortable: true,
      render: (value: string) => {
        const typeColors: Record<string, string> = {
          asset: 'badge-info',
          liability: 'badge-warning',
          equity: 'badge-success',
          revenue: 'badge-success',
          expense: 'badge-danger',
        };
        return (
          <span className={`badge ${typeColors[value] || 'badge-secondary'}`}>
            {value}
          </span>
        );
      },
    },
  ];

  const entriesColumns = [
    {
      key: 'account_id',
      label: 'Conta',
      sortable: true,
      render: (value: string) => (
        <span className="font-mono text-sm">{value}</span>
      ),
    },
    {
      key: 'tenant_id',
      label: 'Tenant',
      sortable: true,
      render: (value: string) => (
        <span className="text-sm">{value || '—'}</span>
      ),
    },
    {
      key: 'amount_cents',
      label: 'Valor',
      sortable: true,
      render: (value: number) => {
        const amount = (value || 0) / 100;
        const isPositive = amount >= 0;
        return (
          <span className={`font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        );
      },
    },
    {
      key: 'occurred_at',
      label: 'Data',
      sortable: true,
      render: (value: string) => {
        if (!value) return '—';
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
      key: 'memo',
      label: 'Memo',
      sortable: false,
      render: (value: string) => (
        <span className="text-sm text-muted">{value || '—'}</span>
      ),
    },
  ];

  return (
    <>
      <div>
        <div className="mb-3">
          <h2 className="text-lg font-semibold text-primary">Plano de Contas</h2>
        </div>
        <DataTable
          data={accounts}
          columns={accountsColumns}
          rowKey="id"
          searchable
          searchPlaceholder="Buscar conta..."
          emptyMessage="Sem contas cadastradas"
        />
      </div>

      <div>
        <div className="mb-3">
          <h2 className="text-lg font-semibold text-primary">Lançamentos Recentes</h2>
        </div>
        <DataTable
          data={entries}
          columns={entriesColumns}
          rowKey="account_id"
          searchable
          searchPlaceholder="Buscar lançamentos..."
          emptyMessage="Sem lançamentos registrados"
        />
      </div>
    </>
  );
}
