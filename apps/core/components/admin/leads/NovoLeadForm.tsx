// components/admin/leads/NovoLeadForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { createLeadAction } from '@/app/leads/actions';

const STATUS_OPTIONS = ['novo', 'contato_inicial', 'qualificado', 'proposta_enviada', 'negociacao', 'ganho', 'perdido'];

const STATUS_LABELS: Record<string, string> = {
  novo: 'Novo',
  contato_inicial: 'Contato Inicial',
  qualificado: 'Qualificado',
  proposta_enviada: 'Proposta Enviada',
  negociacao: 'Negociação',
  ganho: 'Ganho',
  perdido: 'Perdido',
};

export default function NovoLeadForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const result = await createLeadAction(formData);

      if (result.success) {
        router.push('/leads');
        router.refresh();
      } else {
        setError(result.message || 'Erro ao criar lead');
      }
    } catch (err) {
      setError('Erro inesperado ao criar lead');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      {/* Header com botões */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} />
          Voltar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save size={20} />
              Salvar Lead
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Formulário */}
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações do Lead</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome/Empresa <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="organization_name"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: João Silva ou Empresa ABC"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: contato@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <input
                type="tel"
                name="phone"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: (11) 98765-4321"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Origem
              </label>
              <input
                type="text"
                name="source"
                defaultValue="manual"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Website, Indicação, Redes Sociais"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor Estimado (centavos)
                <span className="text-xs text-gray-500 ml-2">Ex: 500000 = €5.000</span>
              </label>
              <input
                type="number"
                name="value_cents"
                min="0"
                defaultValue="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 500000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estágio/Status
              </label>
              <select
                name="stage"
                defaultValue="novo"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {STATUS_OPTIONS.map(status => (
                  <option key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Observações */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Observações
          </label>
          <textarea
            name="notes"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Observações adicionais sobre o lead..."
          />
        </div>
      </div>
    </form>
  );
}
