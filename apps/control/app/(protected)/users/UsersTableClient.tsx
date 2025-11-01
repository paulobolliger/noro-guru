// app/(protected)/users/UsersTableClient.tsx
'use client';

import { DataTable } from '@/components/ui/DataTable';

interface UserTenantRole {
  id: string;
  user_id: string;
  tenant_id: string;
  role: string;
  created_at: string;
  tenant?: Array<{
    name: string;
    slug: string;
    status: string;
    plan?: string;
  }> | null;
  user?: Array<{
    email: string;
  }> | null;
}

interface UsersTableClientProps {
  data: UserTenantRole[];
}

export default function UsersTableClient({ data }: UsersTableClientProps) {
  // Definir colunas da tabela com dados relacionados
  const columns = [
    {
      key: 'user.email',
      label: 'Usuário',
      sortable: true,
      render: (_: any, row: UserTenantRole) => {
        const userEmail = row.user?.[0]?.email;
        return (
          <div className="flex flex-col">
            <span className="font-medium">{userEmail || 'N/A'}</span>
            <span className="text-xs text-muted">{row.user_id.substring(0, 8)}...</span>
          </div>
        );
      },
    },
    {
      key: 'tenant.name',
      label: 'Tenant',
      sortable: true,
      render: (_: any, row: UserTenantRole) => {
        const tenant = row.tenant?.[0];
        return (
          <div className="flex flex-col">
            <span className="font-medium">{tenant?.name || 'N/A'}</span>
            <div className="flex gap-2 mt-1">
              <span className="text-xs text-muted">/{tenant?.slug || 'N/A'}</span>
              {tenant?.plan && (
                <span className="text-xs badge badge-secondary">{tenant.plan}</span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (value: string) => {
        const roleColors: Record<string, string> = {
          admin: 'badge-danger',
          manager: 'badge-warning',
          agent: 'badge-info',
          finance: 'badge-success',
          viewer: 'badge-secondary',
        };
        return (
          <span className={`badge ${roleColors[value] || 'badge-info'}`}>
            {value}
          </span>
        );
      },
    },
    {
      key: 'tenant.status',
      label: 'Status',
      sortable: true,
      render: (_: any, row: UserTenantRole) => {
        const status = row.tenant?.[0]?.status || 'unknown';
        const statusColors: Record<string, string> = {
          active: 'badge-success',
          provisioning: 'badge-warning',
          suspended: 'badge-danger',
          unknown: 'badge-secondary',
        };
        return (
          <span className={`badge ${statusColors[status]}`}>
            {status}
          </span>
        );
      },
    },
    {
      key: 'created_at',
      label: 'Criado em',
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
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      rowKey="id"
      searchable
      searchPlaceholder="Buscar por email, tenant, role ou status..."
      emptyMessage="Sem vínculos de usuários"
    />
  );
}

