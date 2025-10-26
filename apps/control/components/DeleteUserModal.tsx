// components/admin/DeleteUserModal.tsx
'use client';

import { useState, useTransition } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { deleteUserAction } from '../../app/admin/(protected)/configuracoes/actions';

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { id: string; nome: string | null; email: string } | null;
}

export default function DeleteUserModal({ isOpen, onClose, user }: DeleteUserModalProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    if (!user) return;

    setError(null);
    startTransition(async () => {
      const result = await deleteUserAction(user.id);
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
      <div className="bg-white rounded-xl w-full max-w-md p-8 shadow-2xl relative text-center" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Remover Utilizador</h2>
        <p className="text-gray-600 mb-6">
          Tem a certeza de que quer remover <strong className="text-gray-900">{user.email}</strong>? Esta ação é irreversível.
        </p>
        
        {error && <div className="flex items-center gap-2 rounded-lg bg-red-100 p-3 text-red-700 mb-4 text-left"><AlertCircle size={20} /><p className="text-sm">{error}</p></div>}

        <div className="flex gap-4">
            <button onClick={onClose} disabled={isPending} className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                Cancelar
            </button>
            <button onClick={handleDelete} disabled={isPending} className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-red-400">
                {isPending && <Loader2 className="animate-spin" size={20} />}
                {isPending ? 'A remover...' : 'Sim, Remover'}
            </button>
        </div>
      </div>
    </div>
  );
}

