'use client';

import { useState } from 'react';
import { Button as NButton } from '@/../../packages/ui/button';
import { Alert as NAlert } from '@/../../packages/ui/alert';
import { Check, X } from 'lucide-react';
import type { ControlPlaneUser, ControlPlanePermission } from '@/../../packages/types/control-plane-users';
import { CONTROL_PLANE_PERMISSIONS } from '@/../../packages/types/control-plane-users';
import { updateUserPermissions } from '@/app/(protected)/configuracoes/user-actions';

interface PermissionGridProps {
  user: ControlPlaneUser;
  onClose: () => void;
  onUpdate: () => void;
}

export default function PermissionGrid({ user, onClose, onUpdate }: PermissionGridProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<ControlPlanePermission[]>(
    user.permissoes || []
  );
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

  // Agrupar permissões por grupo
  const permissionsByGroup = CONTROL_PLANE_PERMISSIONS.reduce((acc, permission) => {
    if (!acc[permission.grupo]) {
      acc[permission.grupo] = [];
    }
    acc[permission.grupo].push(permission);
    return acc;
  }, {} as Record<string, ControlPlanePermission[]>);

  const isPermissionSelected = (permissionId: string) => {
    return selectedPermissions.some(p => p.id === permissionId);
  };

  const togglePermission = (permission: ControlPlanePermission) => {
    if (isPermissionSelected(permission.id)) {
      setSelectedPermissions(prev => prev.filter(p => p.id !== permission.id));
    } else {
      setSelectedPermissions(prev => [...prev, permission]);
    }
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    setStatus(null);

    try {
      const result = await updateUserPermissions(user.id, selectedPermissions);
      
      if (!result.success) {
        throw new Error(result.message);
      }

      setStatus({
        success: true,
        message: 'Permissões atualizadas com sucesso'
      });

      // Atualizar lista de usuários
      onUpdate();

      // Fechar grid após 2 segundos
      setTimeout(onClose, 2000);
    } catch (error: any) {
      setStatus({
        success: false,
        message: error.message || 'Erro ao atualizar permissões'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(permissionsByGroup).map(([group, permissions]) => (
          <div key={group} className="surface-card p-4 rounded-lg border border-default">
            <h3 className="text-lg font-semibold text-primary mb-4 capitalize">
              {group}
            </h3>
            <div className="space-y-3">
              {permissions.map((permission) => {
                const isSelected = isPermissionSelected(permission.id);
                const isDisabled = permission.requer_role && !permission.requer_role.includes(user.role);

                return (
                  <div
                    key={permission.id}
                    className={`p-3 rounded-lg transition-colors cursor-pointer ${
                      isSelected 
                        ? 'bg-blue-100/10 border border-blue-500/30' 
                        : 'border border-default hover:border-blue-500/30'
                    } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => !isDisabled && togglePermission(permission)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="pt-0.5">
                        <div className={`h-4 w-4 rounded border ${
                          isSelected ? 'bg-blue-500 border-blue-500' : 'border-default'
                        } flex items-center justify-center`}>
                          {isSelected && <Check size={12} className="text-white" />}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-primary">
                          {permission.nome}
                        </div>
                        <div className="text-xs text-muted mt-0.5">
                          {permission.descricao}
                        </div>
                        {isDisabled && (
                          <div className="text-xs text-amber-400 mt-1">
                            Requer role: {permission.requer_role?.join(' ou ')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
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
              onClick={onClose}
              variant="outline"
              disabled={isSaving}
            >
              Cancelar
            </NButton>
            <NButton
              onClick={handleSubmit}
              disabled={isSaving}
              variant="default"
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isSaving ? 'Salvando...' : 'Salvar Permissões'}
            </NButton>
          </div>
        </div>
      </div>
    </div>
  );
}