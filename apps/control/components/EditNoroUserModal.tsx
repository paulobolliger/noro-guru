'use client';

import { useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import type { NoroUser, NoroUserRole } from '@/../../packages/types/noro-users';
import { createClient } from '@/../../packages/lib/supabase/client';

interface EditNoroUserModalProps {
  user: NoroUser;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditNoroUserModal({ user, isOpen, onClose, onSuccess }: EditNoroUserModalProps) {
  const [formData, setFormData] = useState({
    nome: user.nome || '',
    email: user.email,
    telefone: user.telefone || '',
    whatsapp: user.whatsapp || '',
    role: user.role,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      const supabase = createClient();

      const { error: updateError } = await supabase
        .from('noro_users')
        .update({
          nome: formData.nome || null,
          telefone: formData.telefone || null,
          whatsapp: formData.whatsapp || null,
          role: formData.role,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Erro ao atualizar usuário:', err);
      setError(err instanceof Error ? err.message : 'Erro ao atualizar usuário');
    } finally {
      setIsSaving(false);
    }
  };

  const roleOptions: { value: NoroUserRole; label: string; description: string }[] = [
    { value: 'cliente', label: 'Cliente', description: 'Usuário cliente do sistema' },
    { value: 'agente', label: 'Agente', description: 'Agente de viagens com acesso a vendas' },
    { value: 'financeiro', label: 'Financeiro', description: 'Acesso a finanças e relatórios' },
    { value: 'admin', label: 'Admin', description: 'Administrador com acesso completo' },
    { value: 'super_admin', label: 'Super Admin', description: 'Acesso total ao sistema' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="surface-card rounded-xl border border-default max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[var(--color-surface-card)] border-b border-default px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-primary">Editar Utilizador</h3>
            <p className="text-sm text-description mt-1">Atualize as informações do usuário</p>
          </div>
          <button
            onClick={onClose}
            className="text-secondary hover:text-primary transition-colors"
            disabled={isSaving}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-label mb-2">
              Nome Completo
            </label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="input-field w-full"
              placeholder="Digite o nome completo"
              required
            />
          </div>

          {/* Email (readonly) */}
          <div>
            <label className="block text-sm font-medium text-label mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              className="input-field w-full bg-[var(--color-surface)] cursor-not-allowed opacity-60"
              readOnly
              disabled
            />
            <p className="text-xs text-description mt-1">
              O email não pode ser alterado
            </p>
          </div>

          {/* Telefone e WhatsApp */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-label mb-2">
                Telefone
              </label>
              <input
                type="tel"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                className="input-field w-full"
                placeholder="+351 123 456 789"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-label mb-2">
                WhatsApp
              </label>
              <input
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="input-field w-full"
                placeholder="+351 123 456 789"
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-label mb-2">
              Função no Sistema
            </label>
            <div className="space-y-2">
              {roleOptions.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    formData.role === option.value
                      ? 'bg-accent/20 border-accent'
                      : 'bg-[var(--color-surface)] border-default hover:border-accent/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={option.value}
                    checked={formData.role === option.value}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as NoroUserRole })}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-primary text-sm">{option.label}</div>
                    <div className="text-xs text-description mt-0.5">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* User Info */}
          <div className="bg-[var(--color-surface)] rounded-lg p-4 border border-default">
            <div className="text-xs text-description space-y-1">
              <div>
                <span className="font-medium text-label">ID:</span> {user.id}
              </div>
              <div>
                <span className="font-medium text-label">Criado em:</span>{' '}
                {new Date(user.created_at).toLocaleString('pt-BR')}
              </div>
              <div>
                <span className="font-medium text-label">Atualizado em:</span>{' '}
                {new Date(user.updated_at).toLocaleString('pt-BR')}
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="sticky bottom-0 bg-[var(--color-surface-card)] border-t border-default px-6 py-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary px-4 py-2 rounded-lg"
            disabled={isSaving}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="btn-primary px-4 py-2 rounded-lg flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save size={16} />
                Salvar Alterações
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
