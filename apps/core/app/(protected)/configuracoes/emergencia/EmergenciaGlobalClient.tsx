'use client';

import { useState, useRef } from 'react';
import { addEmergencyContactAction, deleteEmergencyContactAction } from '../../orcamentos/[id]/actions';

type Contact = {
  id: string;
  tipo: string;
  nome: string;
  telefone: string | null;
  whatsapp: string | null;
  email: string | null;
  observacoes: string | null;
  ativo: boolean;
};

const EC_TIPO_LABEL: Record<string, string> = {
  agencia: 'Agência',
  seguradora: 'Seguradora',
  consulado: 'Consulado',
  hospital: 'Hospital',
  outro: 'Outro',
};

export default function EmergenciaGlobalClient({ contacts }: { contacts: Contact[] }) {
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    const result = await addEmergencyContactAction(null, formData); // null = global do tenant
    setSaving(false);
    if (result.success) {
      setAdding(false);
      formRef.current?.reset();
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Central de emergência</h1>
        <p className="text-sm text-gray-500 mt-1">
          Contatos globais exibidos para todos os clientes no portal. Contatos específicos por
          viagem ficam na aba Emergência de cada orçamento.
        </p>
      </div>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setAdding(!adding)}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          {adding ? 'Cancelar' : '+ Adicionar contato'}
        </button>
      </div>

      {adding && (
        <form ref={formRef} onSubmit={handleAdd} className="border border-gray-200 rounded-xl p-4 bg-gray-50 mb-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Tipo</label>
              <select name="tipo" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                {Object.entries(EC_TIPO_LABEL).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Nome *</label>
              <input type="text" name="nome" required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Telefone</label>
              <input type="text" name="telefone" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">WhatsApp</label>
              <input type="text" name="whatsapp" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Email</label>
            <input type="email" name="email" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Observações</label>
            <textarea name="observacoes" rows={2} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none" />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? 'Salvando…' : 'Salvar contato'}
          </button>
        </form>
      )}

      {contacts.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-3xl mb-2">🆘</p>
          <p className="text-sm">Nenhum contato de emergência configurado.</p>
          <p className="text-xs mt-1">Adicione a agência, seguradora, consulados e hospitais.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {contacts.map((c) => (
            <div key={c.id} className="flex items-start justify-between border border-gray-100 rounded-xl p-4 bg-white">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    {EC_TIPO_LABEL[c.tipo] ?? c.tipo}
                  </span>
                  {!c.ativo && <span className="text-xs bg-gray-100 text-gray-400 px-2 rounded-full">inativo</span>}
                </div>
                <p className="text-sm font-semibold text-gray-800">{c.nome}</p>
                <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-gray-500">
                  {c.telefone && <span>☎ {c.telefone}</span>}
                  {c.whatsapp && <span>💬 {c.whatsapp}</span>}
                  {c.email && <span>✉ {c.email}</span>}
                </div>
                {c.observacoes && <p className="text-xs text-gray-400 mt-1">{c.observacoes}</p>}
              </div>
              <button
                onClick={async () => {
                  if (confirm(`Remover "${c.nome}"?`)) {
                    await deleteEmergencyContactAction(null, c.id);
                  }
                }}
                className="text-xs text-red-400 hover:text-red-600 ml-4 shrink-0"
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
