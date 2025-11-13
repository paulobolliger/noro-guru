// components/admin/ClienteModal.tsx
'use client';

import { useState, useTransition } from 'react';
import { X, User, Mail, Phone, MapPin, Users, DollarSign, FileText, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { createClienteAction, updateClienteAction } from '@/app/clientes/actions';

interface Cliente {
  id?: string;
  nome: string;
  email: string;
  telefone?: string | null;
  whatsapp?: string | null;
  origem?: string | null;
  destino_interesse?: string | null;
  num_pessoas?: number | null;
  valor_estimado?: number | null;
  observacoes?: string | null;
}

interface ClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  cliente?: Cliente | null; // Se fornecido, é modo edição
}

export default function ClienteModal({ isOpen, onClose, cliente }: ClienteModalProps) {
  const isEditMode = !!cliente;
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = isEditMode
        ? await updateClienteAction(cliente.id!, formData)
        : await createClienteAction(formData);

      setStatus(result);

      if (result.success) {
        setTimeout(() => {
          onClose();
          setStatus(null);
        }, 1500);
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditMode ? 'Editar Cliente' : 'Adicionar Novo Cliente'}
            </h2>
            <p className="text-gray-600 mt-1">
              {isEditMode ? 'Atualize as informações do cliente' : 'Preencha os dados do novo cliente'}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <User size={18} />
                Nome Completo *
              </label>
              <input
                type="text"
                name="nome"
                defaultValue={cliente?.nome || ''}
                required
                placeholder="Ex: João Silva"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Mail size={18} />
                E-mail *
              </label>
              <input
                type="email"
                name="email"
                defaultValue={cliente?.email || ''}
                required
                placeholder="joao@exemplo.com"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Telefone */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Phone size={18} />
                Telefone
              </label>
              <input
                type="tel"
                name="telefone"
                defaultValue={cliente?.telefone || ''}
                placeholder="+351 912 345 678"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* WhatsApp */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Phone size={18} />
                WhatsApp
              </label>
              <input
                type="tel"
                name="whatsapp"
                defaultValue={cliente?.whatsapp || ''}
                placeholder="+351 912 345 678"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Origem */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MapPin size={18} />
                Origem do Lead
              </label>
              <select
                name="origem"
                defaultValue={cliente?.origem || 'site'}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="site">Site</option>
                <option value="instagram">Instagram</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="facebook">Facebook</option>
                <option value="indicacao">Indicação</option>
                <option value="google">Google</option>
              </select>
            </div>

            {/* Destino de Interesse */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MapPin size={18} />
                Destino de Interesse
              </label>
              <input
                type="text"
                name="destino_interesse"
                defaultValue={cliente?.destino_interesse || ''}
                placeholder="Ex: Paris, França"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Número de Pessoas */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Users size={18} />
                Nº de Pessoas
              </label>
              <input
                type="number"
                name="num_pessoas"
                defaultValue={cliente?.num_pessoas || ''}
                min="1"
                placeholder="2"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Valor Total Gasto */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <DollarSign size={18} />
                Valor Total Gasto (€)
              </label>
              <input
                type="number"
                name="valor_estimado"
                defaultValue={cliente?.valor_estimado || ''}
                min="0"
                step="0.01"
                placeholder="5000.00"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Observações */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FileText size={18} />
                Observações
              </label>
              <textarea
                name="observacoes"
                defaultValue={cliente?.observacoes || ''}
                rows={4}
                placeholder="Notas adicionais sobre o cliente..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>

          {/* Status Message */}
          {status && (
            <div
              className={`mt-6 flex items-center gap-2 p-4 rounded-lg ${
                status.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {status.success ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <p className="text-sm font-medium">{status.message}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isPending && <Loader2 className="animate-spin" size={20} />}
              {isPending ? 'Salvando...' : isEditMode ? 'Atualizar Cliente' : 'Adicionar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}