// components/admin/InviteUserModal.tsx
'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { X, Mail, Shield, Loader2, AlertCircle } from 'lucide-react';
import { inviteUserAction } from '@/app/core/(protected)/configuracoes/actions';

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InviteUserModal({ isOpen, onClose }: InviteUserModalProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Limpa o estado quando o modal é fechado
  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setSuccess(null);
      formRef.current?.reset();
    }
  }, [isOpen]);

  const handleSubmit = (formData: FormData) => {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await inviteUserAction(formData);
      if (result.success) {
        setSuccess(result.message);
        setTimeout(() => {
          onClose(); // Fecha o modal após o sucesso
        }, 2000);
      } else {
        setError(result.message);
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl w-full max-w-md p-8 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Convidar Novo Utilizador</h2>

        <form ref={formRef} action={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              E-mail do Utilizador
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="exemplo@nomade.guru"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Função (Role)
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <select
                id="role"
                name="role"
                defaultValue="admin"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-100 p-3 text-red-700">
              <AlertCircle size={20} />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-lg bg-green-100 p-3 text-green-700">
              <p className="text-sm">{success}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            {isPending && <Loader2 className="animate-spin" size={20} />}
            {isPending ? 'A enviar convite...' : 'Enviar Convite'}
          </button>
        </form>
      </div>
    </div>
  );
}

