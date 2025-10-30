'use client';

import { useState } from 'react';
import { Button as NButton } from '@/../../packages/ui/button';
import { Alert as NAlert } from '@/../../packages/ui/alert';
import { Shield, Check, X } from 'lucide-react';
import type { ControlPlaneUser, ControlPlaneRole, UserStatus } from '@/../../packages/types/control-plane-users';
import { updateUserRole, updateUserStatus } from '@/app/(protected)/configuracoes/user-actions';

interface UserDetailsFormProps {
  user: ControlPlaneUser;
  onClose: () => void;
  onUpdate: () => void;
}

export default function UserDetailsForm({ user, onClose, onUpdate }: UserDetailsFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);
  const [role, setRole] = useState<ControlPlaneRole>(user.role);
  const [userStatus, setUserStatus] = useState<UserStatus>(user.status);

  const roleOptions: { value: ControlPlaneRole; label: string }[] = [
    { value: 'super_admin', label: 'Super Admin' },
    { value: 'admin', label: 'Admin' },
    { value: 'operador', label: 'Operador' },
    { value: 'auditor', label: 'Auditor' },
    { value: 'readonly', label: 'Readonly' }
  ];

  const statusOptions: { value: UserStatus; label: string }[] = [
    { value: 'ativo', label: 'Ativo' },
    { value: 'inativo', label: 'Inativo' },
    { value: 'pendente', label: 'Pendente' },
    { value: 'bloqueado', label: 'Bloqueado' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatus(null);

    try {
      // Atualizar role se mudou
      if (role !== user.role) {
        const roleResult = await updateUserRole(user.id, role);
        if (!roleResult.success) {
          throw new Error(roleResult.message);
        }
      }

      // Atualizar status se mudou
      if (userStatus !== user.status) {
        const statusResult = await updateUserStatus(user.id, userStatus);
        if (!statusResult.success) {
          throw new Error(statusResult.message);
        }
      }

      setStatus({
        success: true,
        message: 'Usuário atualizado com sucesso'
      });

      // Atualizar lista de usuários
      onUpdate();

      // Fechar formulário após 2 segundos
      setTimeout(onClose, 2000);
    } catch (error: any) {
      setStatus({
        success: false,
        message: error.message || 'Erro ao atualizar usuário'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-primary mb-2">
          E-mail
        </label>
        <input
          type="email"
          value={user.email}
          disabled
          className="w-full p-3 border border-default rounded-lg bg-[var(--color-surface-alt)] text-muted"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-primary mb-2">
          Role
        </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as ControlPlaneRole)}
          className="w-full p-3 border border-default rounded-lg bg-[var(--color-surface-alt)] text-primary"
        >
          {roleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-primary mb-2">
          Status
        </label>
        <select
          value={userStatus}
          onChange={(e) => setUserStatus(e.target.value as UserStatus)}
          className="w-full p-3 border border-default rounded-lg bg-[var(--color-surface-alt)] text-primary"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="pt-6 border-t border-default">
        <div className="flex items-center justify-between gap-4">
          {status && (
            <NAlert
              variant={status.success ? 'success' : 'error'}
              icon={status.success ? <Check size={16} /> : <X size={16} />}
            >
              {status.message}
            </NAlert>
          )}

          <div className="flex items-center gap-4">
            <NButton
              type="button"
              onClick={onClose}
              variant="outline"
              disabled={isSaving}
            >
              Cancelar
            </NButton>
            <NButton
              type="submit"
              disabled={isSaving}
              variant="default"
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </NButton>
          </div>
        </div>
      </div>
    </form>
  );
}