'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Shield, User2, Clock, History, Key, Settings2 } from 'lucide-react';
import { Button as NButton } from '@/../../packages/ui/button';
import { Alert as NAlert } from '@/../../packages/ui/alert';
import { Select as NSelect } from '@/../../packages/ui/select';
import type { ControlPlaneUser, UserActivity, ControlPlaneRole, UserStatus } from '@/../../packages/types/control-plane-users';
import UserDetailsForm from './UserDetailsForm';
import PermissionGrid from './PermissionGrid';

interface UtilizadoresTabProps {
  users: ControlPlaneUser[];
  currentUserId: string;
  userActivities: UserActivity[];
  refetchUsers: () => Promise<void>;
}

export default function UtilizadoresTab({ users, currentUserId, userActivities, refetchUsers }: UtilizadoresTabProps) {
  const [selectedUser, setSelectedUser] = useState<ControlPlaneUser | null>(null);
  const [activeView, setActiveView] = useState<'lista' | 'detalhes' | 'atividade' | 'permissoes'>('lista');
  const [filterRole, setFilterRole] = useState<ControlPlaneRole | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<UserStatus | 'all'>('all');

  if (!users?.length) {
    return (
      <div className="surface-card p-6 rounded-xl border border-default">
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-primary mb-2">Nenhum usuário encontrado</h3>
          <p className="text-muted mb-6">Não há usuários registrados no Control Plane.</p>
          <NButton
            onClick={() => {/* TODO: Implementar convite */}}
            variant="default"
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Convidar Usuário
          </NButton>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter(user => {
    if (filterRole !== 'all' && user.role !== filterRole) return false;
    if (filterStatus !== 'all' && user.status !== filterStatus) return false;
    return true;
  });

  // Map de cores por status
  const statusColors: Record<UserStatus, { bg: string; text: string }> = {
    ativo: { bg: 'bg-emerald-100/10', text: 'text-emerald-400' },
    inativo: { bg: 'bg-gray-100/10', text: 'text-gray-400' },
    pendente: { bg: 'bg-amber-100/10', text: 'text-amber-400' },
    bloqueado: { bg: 'bg-red-100/10', text: 'text-red-400' }
  };

  // Map de cores por role
  const roleColors: Record<ControlPlaneRole, { bg: string; text: string }> = {
    super_admin: { bg: 'bg-purple-100/10', text: 'text-purple-400' },
    admin: { bg: 'bg-blue-100/10', text: 'text-blue-400' },
    operador: { bg: 'bg-green-100/10', text: 'text-green-400' },
    auditor: { bg: 'bg-amber-100/10', text: 'text-amber-400' },
    readonly: { bg: 'bg-gray-100/10', text: 'text-gray-400' }
  };

  const renderUserList = () => (
    <div className="surface-card rounded-xl border border-default">
      <div className="p-6 border-b border-default">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-primary">Lista de Utilizadores</h3>
          <div className="flex items-center gap-4">
            <NSelect
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as any)}
              className="w-40"
            >
              <option value="all">Todas as Roles</option>
              <option value="super_admin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="operador">Operador</option>
              <option value="auditor">Auditor</option>
              <option value="readonly">Readonly</option>
            </NSelect>
            <NSelect
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-40"
            >
              <option value="all">Todos os Status</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
              <option value="pendente">Pendente</option>
              <option value="bloqueado">Bloqueado</option>
            </NSelect>
            <NButton
              onClick={() => {/* TODO: Implementar convite */}}
              variant="default"
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Convidar Usuário
            </NButton>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[var(--color-surface-alt)]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">Usuário</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">2FA</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase">Último Acesso</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-muted uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-default">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-[var(--color-surface-alt)] transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      {user.avatar_url ? (
                        <img className="h-10 w-10 rounded-full" src={user.avatar_url} alt="" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-100/10 flex items-center justify-center">
                          <User2 className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-primary">{user.nome || 'Sem nome'}</div>
                      <div className="text-sm text-muted">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[user.role].bg} ${roleColors[user.role].text}`}>
                    {user.role.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[user.status].bg} ${statusColors[user.status].text}`}>
                    {user.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.two_factor_enabled ? (
                    <span className="inline-flex items-center text-emerald-400">
                      <Shield className="h-4 w-4 mr-1" />
                      <span className="text-xs">Ativado</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-gray-400">
                      <Shield className="h-4 w-4 mr-1" />
                      <span className="text-xs">Desativado</span>
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                  {user.ultimo_acesso ? format(new Date(user.ultimo_acesso), 'dd/MM/yyyy HH:mm', { locale: ptBR }) : 'Nunca'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <div className="flex items-center justify-end gap-2">
                    <NButton
                      onClick={() => {
                        setSelectedUser(user);
                        setActiveView('detalhes');
                      }}
                      variant="ghost"
                      className="text-primary"
                    >
                      <Settings2 className="h-4 w-4" />
                    </NButton>
                    <NButton
                      onClick={() => {
                        setSelectedUser(user);
                        setActiveView('atividade');
                      }}
                      variant="ghost"
                      className="text-primary"
                    >
                      <History className="h-4 w-4" />
                    </NButton>
                    <NButton
                      onClick={() => {
                        setSelectedUser(user);
                        setActiveView('permissoes');
                      }}
                      variant="ghost"
                      className="text-primary"
                    >
                      <Key className="h-4 w-4" />
                    </NButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderUserDetails = () => {
    if (!selectedUser) return null;

    return (
      <UserDetailsForm 
        user={selectedUser} 
        onClose={() => {
          setSelectedUser(null);
          setActiveView('lista');
        }}
        onUpdate={refetchUsers}
      />
    );
  };

  const renderUserActivity = () => {
    if (!selectedUser) return null;

    const userLogs = userActivities.filter(
      (activity) => activity.user_id === selectedUser.id
    );

    return (
      <div className="surface-card rounded-xl border border-default p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-primary">Log de Atividades</h3>
          <NButton
            onClick={() => {
              setSelectedUser(null);
              setActiveView('lista');
            }}
            variant="ghost"
          >
            Voltar para Lista
          </NButton>
        </div>

        <div className="space-y-4">
          {userLogs.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-4 border border-default rounded-lg"
            >
              <Clock className="h-5 w-5 text-muted flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-primary font-medium">
                  {activity.descricao}
                </p>
                <div className="mt-1 text-xs text-muted flex items-center gap-4">
                  <span>{format(new Date(activity.created_at), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR })}</span>
                  {activity.ip_address && <span>IP: {activity.ip_address}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderUserPermissions = () => {
    if (!selectedUser) return null;

    return (
      <PermissionGrid 
        user={selectedUser} 
        onClose={() => {
          setSelectedUser(null);
          setActiveView('lista');
        }}
        onUpdate={refetchUsers}
      />
    );
  };

  return (
    <div className="space-y-6">
      {activeView === 'lista' && renderUserList()}
      {activeView === 'detalhes' && renderUserDetails()}
      {activeView === 'atividade' && renderUserActivity()}
      {activeView === 'permissoes' && renderUserPermissions()}
    </div>
  );
}