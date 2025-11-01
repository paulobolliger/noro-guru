'use client';

import { useState } from 'react';
import { X, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import type { NoroUser } from '@/../../packages/types/noro-users';
import { createClient } from '@/../../packages/lib/supabase/client';

interface DeleteNoroUserModalProps {
  user: NoroUser | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteNoroUserModal({ user, isOpen, onClose, onSuccess }: DeleteNoroUserModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [confirmText, setConfirmText] = useState('');

  if (!isOpen || !user) return null;

  const handleDelete = async () => {
    if (confirmText.toLowerCase() !== 'deletar') {
      setError('Digite "deletar" para confirmar');
      return;
    }

    setError('');
    setIsDeleting(true);

    try {
      const supabase = createClient();

      // Deletar usuário
      const { error: deleteError } = await supabase
        .from('noro_users')
        .delete()
        .eq('id', user.id);

      if (deleteError) throw deleteError;

      onSuccess();
      onClose();
      setConfirmText('');
    } catch (err) {
      console.error('Erro ao deletar usuário:', err);
      setError(err instanceof Error ? err.message : 'Erro ao deletar usuário');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="surface-card rounded-xl border border-default max-w-md w-full">
        {/* Header */}
        <div className="bg-[var(--color-surface-card)] border-b border-default px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="text-red-500" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary">Deletar Utilizador</h3>
              <p className="text-sm text-description mt-0.5">Esta ação não pode ser desfeita</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-secondary hover:text-primary transition-colors"
            disabled={isDeleting}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
            <p className="text-sm text-primary mb-3">
              Você está prestes a deletar o seguinte utilizador:
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user.nome?.charAt(0)?.toUpperCase() || user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <div className="font-medium text-primary">{user.nome || 'Sem nome'}</div>
                  <div className="text-sm text-description">{user.email}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-yellow-500 flex-shrink-0 mt-0.5" size={18} />
              <div className="text-sm text-description">
                <p className="font-medium text-primary mb-1">Atenção!</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Todos os dados associados serão removidos</li>
                  <li>O usuário não poderá mais fazer login</li>
                  <li>Esta ação é permanente e irreversível</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-label mb-2">
              Digite <span className="text-red-500 font-semibold">deletar</span> para confirmar:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="input-field w-full"
              placeholder="deletar"
              autoFocus
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[var(--color-surface-card)] border-t border-default px-6 py-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary px-4 py-2 rounded-lg"
            disabled={isDeleting}
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting || confirmText.toLowerCase() !== 'deletar'}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            {isDeleting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Deletando...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Deletar Utilizador
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
