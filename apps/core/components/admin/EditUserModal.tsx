// components/admin/EditUserModal.tsx
'use client';

import { useState, useTransition } from 'react';
import { X, Shield, Loader2, AlertCircle } from 'lucide-react';
import { updateUserRoleAction } from '@/app/configuracoes/actions';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { id: string; nome: string | null; email: string; role: string } | null;
}

export default function EditUserModal({ isOpen, onClose, user }: EditUserModalProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;

    const formData = new FormData(event.currentTarget);
    const newRole = formData.get('role') as string;

    setError(null);
    startTransition(async () => {
      const result = await updateUserRoleAction(user.id, newRole);
      if (result.success) {
        onClose();
      } else {
        setError(result.message);
      }
    });
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl w-full max-w-md p-8 shadow-2xl relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Editar Utilizador</h2>
        <p className="text-gray-600 mb-6">{user.email}</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">Função (Role)</label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <select id="role" name="role" defaultValue={user.role} required className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
          </div>
          {error && <div className="flex items-center gap-2 rounded-lg bg-red-100 p-3 text-red-700"><AlertCircle size={20} /><p className="text-sm">{error}</p></div>}
          <button type="submit" disabled={isPending} className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400">
            {isPending && <Loader2 className="animate-spin" size={20} />}
            {isPending ? 'A guardar...' : 'Guardar Alterações'}
          </button>
        </form>
      </div>
    </div>
  );
}

