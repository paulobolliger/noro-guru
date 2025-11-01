'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Shield, User2, Search, Plus, Edit2, Trash2, Mail, Phone } from 'lucide-react';
import type { NoroUser, NoroUserRole } from '@/../../packages/types/noro-users';
import EditNoroUserModal from './EditNoroUserModal';
import DeleteNoroUserModal from './DeleteNoroUserModal';

interface UtilizadoresTabProps {
  users: NoroUser[];
  currentUserId: string;
  refetchUsers: () => Promise<void>;
}

export default function UtilizadoresTab({ users, currentUserId, refetchUsers }: UtilizadoresTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<NoroUserRole | 'all'>('all');
  const [selectedUser, setSelectedUser] = useState<NoroUser | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (!users?.length) {
    return (
      <div className="surface-card p-6 rounded-xl border border-default">
        <div className="text-center py-12">
          <User2 size={48} className="mx-auto text-secondary mb-4" />
          <h3 className="text-lg font-semibold text-primary mb-2">Nenhum usuário encontrado</h3>
          <p className="text-description mb-6">Não há usuários registrados no sistema NORO.</p>
          <button
            onClick={() => {/* TODO: Implementar criação de usuário */}}
            className="btn-primary px-4 py-2 rounded-lg flex items-center gap-2 mx-auto"
          >
            <Plus size={16} />
            Adicionar Usuário
          </button>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // Map de cores por role
  const roleColors: Record<NoroUserRole, { bg: string; text: string; label: string }> = {
    super_admin: { bg: 'bg-purple-500/20', text: 'text-purple-400', label: 'Super Admin' },
    admin: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Admin' },
    agente: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Agente' },
    financeiro: { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'Financeiro' },
    cliente: { bg: 'bg-gray-500/20', text: 'text-gray-400', label: 'Cliente' }
  };

  return (
    <div className="space-y-6">
      {/* Modals */}
      {selectedUser && (
        <>
          <EditNoroUserModal
            user={selectedUser}
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedUser(null);
            }}
            onSuccess={() => {
              refetchUsers();
            }}
          />
          <DeleteNoroUserModal
            user={selectedUser}
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedUser(null);
            }}
            onSuccess={() => {
              refetchUsers();
            }}
          />
        </>
      )}

      {/* Header com Filtros */}
      <div className="surface-card rounded-xl border border-default p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-primary">Utilizadores do Sistema NORO</h3>
            <p className="text-sm text-description mt-1">
              Gerencie todos os utilizadores (clientes, agentes, administradores)
            </p>
          </div>
          <button
            onClick={() => {/* TODO: Implementar criação */}}
            className="btn-primary px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={16} />
            Novo Utilizador
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome ou email..."
              className="input-field w-full pl-10"
            />
          </div>

          {/* Filtro de Role */}
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as NoroUserRole | 'all')}
            className="input-field"
          >
            <option value="all">Todas as Funções</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="agente">Agente</option>
            <option value="financeiro">Financeiro</option>
            <option value="cliente">Cliente</option>
          </select>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 pt-6 border-t border-default">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{users.length}</div>
            <div className="text-xs text-description mt-1">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{users.filter(u => u.role === 'super_admin').length}</div>
            <div className="text-xs text-description mt-1">Super Admins</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{users.filter(u => u.role === 'admin').length}</div>
            <div className="text-xs text-description mt-1">Admins</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{users.filter(u => u.role === 'agente').length}</div>
            <div className="text-xs text-description mt-1">Agentes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-400">{users.filter(u => u.role === 'cliente').length}</div>
            <div className="text-xs text-description mt-1">Clientes</div>
          </div>
        </div>
      </div>

      {/* Tabela de Usuários */}
      <div className="surface-card rounded-xl border border-default overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--color-surface-alt)]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-description uppercase">Utilizador</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-description uppercase">Função</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-description uppercase">Contacto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-description uppercase">Criado em</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-description uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-default">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[var(--color-surface-alt)] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        {user.avatar_url ? (
                          <img className="h-10 w-10 rounded-full object-cover" src={user.avatar_url} alt="" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {user.nome?.charAt(0)?.toUpperCase() || user.email.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-primary">{user.nome || 'Sem nome'}</div>
                        <div className="text-sm text-description flex items-center gap-1">
                          <Mail size={12} />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${roleColors[user.role].bg} ${roleColors[user.role].text}`}>
                      {roleColors[user.role].label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-description space-y-1">
                      {user.telefone && (
                        <div className="flex items-center gap-1">
                          <Phone size={12} />
                          {user.telefone}
                        </div>
                      )}
                      {user.whatsapp && (
                        <div className="flex items-center gap-1 text-green-400">
                          <Phone size={12} />
                          {user.whatsapp}
                        </div>
                      )}
                      {!user.telefone && !user.whatsapp && (
                        <span className="text-secondary italic">Sem contacto</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-description">
                    {format(new Date(user.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setIsEditModalOpen(true);
                        }}
                        className="p-2 rounded text-secondary hover:text-primary hover:bg-[var(--color-surface)] transition-colors"
                        title="Editar"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-2 rounded text-secondary hover:text-red-500 hover:bg-red-500/10 transition-colors"
                        title="Remover"
                        disabled={user.id === currentUserId}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Search size={48} className="mx-auto text-secondary mb-4" />
            <h3 className="text-lg font-semibold text-primary mb-2">Nenhum resultado encontrado</h3>
            <p className="text-description">Tente ajustar os filtros de busca</p>
          </div>
        )}
      </div>
    </div>
  );
}