// app/(protected)/api-keys/ApiKeyActions.tsx
'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/useToast';

interface ApiKeyActionsProps {
  createAction: (formData: FormData) => Promise<void>;
  revokeAction: (formData: FormData) => Promise<void>;
}

export function ApiKeyCreateForm({ createAction }: { createAction: (formData: FormData) => Promise<void> }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const toast = useToast();

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await createAction(formData);
        toast.success('API Key criada!', 'A chave foi gerada com sucesso. Guarde-a em local seguro.');
        router.refresh();
      } catch (error: any) {
        toast.error('Erro ao criar API Key', error.message || 'Tente novamente mais tarde.');
      }
    });
  };

  return (
    <form action={handleSubmit} className="flex gap-2 items-end">
      <div className="flex flex-col">
        <label className="text-sm">Nome</label>
        <input 
          name="name" 
          placeholder="Ex: Visa Read" 
          className="border border-white/10 bg-white/5 text-primary placeholder:text-primary0 px-3 py-2 rounded w-64 focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
          disabled={isPending}
          required
        />
      </div>
      <button 
        type="submit"
        disabled={isPending}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'Criando...' : 'Criar'}
      </button>
    </form>
  );
}
