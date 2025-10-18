// components/forms/ClientUpdateForm.tsx
'use client';

import { useState, useTransition } from 'react';
import { updateClientFromPublicForm } from '@/app/admin/(protected)/clientes/[id]/actions';
import type { Database } from '@/types/supabase';
import { User, Mail, Phone, Calendar, Globe, Briefcase, CreditCard, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PROFISSOES, PAISES_E_NACIONALIDADES } from '@/lib/client-data';

type Cliente = Database['public']['Tables']['noro_clientes']['Row'];

interface ClientUpdateFormProps {
  cliente: Cliente;
  token: string;
}

export default function ClientUpdateForm({ cliente, token }: ClientUpdateFormProps) {
  const [formData, setFormData] = useState({
    nome: cliente.nome || '',
    email: cliente.email || '',
    telefone: cliente.telefone || '',
    whatsapp: cliente.whatsapp || '',
    cpf: cliente.cpf || '',
    passaporte: cliente.passaporte || '',
    data_nascimento: cliente.data_nascimento || '',
    nacionalidade: cliente.nacionalidade || '',
    profissao: cliente.profissao || '',
  });

  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      const value = formData[key as keyof typeof formData];
      if (value) {
        formDataToSend.append(key, value);
      }
    });

    startTransition(async () => {
      const result = await updateClientFromPublicForm(token, formDataToSend);
      setStatus(result);
    });
  };

  if (status?.success) {
    return (
        <div className="text-center py-12">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">Dados Atualizados!</h2>
            <p className="mt-2 text-gray-600">{status.message}</p>
        </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Dados de Contato */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User size={20} /> Informações de Contato
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo *</label>
            <input type="text" name="nome" value={formData.nome} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
            <input type="tel" name="telefone" value={formData.telefone} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
            <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
          </div>
        </div>
      </section>

      {/* Documentação */}
      <section className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CreditCard size={20} /> Documentação
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">CPF</label>
            <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Passaporte</label>
            <input type="text" name="passaporte" value={formData.passaporte} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1"><Calendar size={14} /> Data de Nascimento</label>
            <input type="date" name="data_nascimento" value={formData.data_nascimento} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1"><Globe size={14} /> Nacionalidade</label>
            <select name="nacionalidade" value={formData.nacionalidade} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg">
              <option value="">Selecione...</option>
              {PAISES_E_NACIONALIDADES.map(p => (
                <option key={p.sigla} value={p.gentilico}>{p.gentilico}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1"><Briefcase size={14} /> Profissão</label>
            <select name="profissao" value={formData.profissao} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg">
              <option value="">Selecione...</option>
              {PROFISSOES.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Feedback e Ação */}
      {status && !status.success && (
        <div className="mt-6 flex items-center gap-2 p-4 rounded-lg bg-red-100 text-red-700">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{status.message}</p>
        </div>
      )}

      <div className="pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400"
        >
          {isPending && <Loader2 className="animate-spin" size={20} />}
          {isPending ? 'A guardar...' : 'Guardar Alterações'}
        </button>
      </div>
    </form>
  );
}