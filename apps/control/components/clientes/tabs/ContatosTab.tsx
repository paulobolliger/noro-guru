'use client';

import { useState, useEffect } from 'react';
import Portal from "@/components/ui/portal";
import { Phone, Plus, Trash2, X, Save } from 'lucide-react';
import { 
  getClienteContatosEmergencia, 
  createContatoEmergencia, 
  deleteContatoEmergencia 
} from "@/app/(protected)/clientes/[id]/actions";
import { useRouter } from 'next/navigation';

interface Contato {
  id: string;
  nome: string;
  parentesco?: string;
  telefone: string;
  email?: string;
  observacoes?: string;
}

interface ContatosTabProps {
  clienteId: string;
}

export default function ContatosTab({ clienteId }: ContatosTabProps) {
  const router = useRouter();
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    parentesco: '',
    telefone: '',
    email: '',
    observacoes: '',
  });

  useEffect(() => {
    loadContatos();
  }, [clienteId]);

  async function loadContatos() {
    setIsLoading(true);
    const result = await getClienteContatosEmergencia(clienteId);
    if (result.success && result.data) {
      setContatos(result.data);
    }
    setIsLoading(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }

  async function handleSave() {
    if (!formData.nome || !formData.telefone) {
      alert('Nome e telefone são obrigatórios');
      return;
    }

    setIsSaving(true);

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key as keyof typeof formData]);
    });

    const result = await createContatoEmergencia(clienteId, formDataToSend);

    if (result.success) {
      setShowModal(false);
      resetForm();
      await loadContatos();
      router.refresh();
    } else {
      alert('Erro ao salvar: ' + result.error);
    }

    setIsSaving(false);
  }

  async function handleDelete(contatoId: string) {
    if (!confirm('Deletar contato?')) return;

    const result = await deleteContatoEmergencia(contatoId, clienteId);
    if (result.success) {
      await loadContatos();
      router.refresh();
    }
  }

  function resetForm() {
    setFormData({
      nome: '',
      parentesco: '',
      telefone: '',
      email: '',
      observacoes: '',
    });
  }

  function getParentescoLabel(parentesco?: string) {
    const parentescos: Record<string, string> = {
      pai: 'Pai',
      mae: 'Mãe',
      conjuge: 'Cônjuge',
      filho: 'Filho(a)',
      irmao: 'Irmão(ã)',
      amigo: 'Amigo(a)',
      outro: 'Outro',
    };
    return parentesco ? parentescos[parentesco] || parentesco : '-';
  }

  return (
    <div className="surface-card rounded-xl shadow-sm border border-default">
      <div className="flex items-center justify-between p-6 border-b border-default border-default">
        <div className="flex items-center gap-3">
          <Phone className="w-6 h-6 text-green-600" />
          <div>
            <h2 className="text-xl font-semibold text-primary">Contatos de Emergência</h2>
            <p className="text-sm text-muted">{contatos.length} contato(s)</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
        >
          <Plus className="w-4 h-4" />
          Adicionar
        </button>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="text-center py-12 text-muted">Carregando...</div>
        ) : contatos.length === 0 ? (
          <div className="text-center py-12">
            <Phone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-muted mb-2">Nenhum contato cadastrado</p>
            <button
              onClick={() => setShowModal(true)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Adicionar primeiro contato
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {contatos.map((contato) => (
              <div
                key={contato.id}
                className="border border-default rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-primary">{contato.nome}</h3>
                      {contato.parentesco && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {getParentescoLabel(contato.parentesco)}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 text-sm text-muted">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <a 
                          href={`tel:${contato.telefone}`}
                          className="hover:text-blue-600"
                        >
                          {contato.telefone}
                        </a>
                        
                        <a href={`https://wa.me/${contato.telefone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-700 text-xs"
                        >
                          WhatsApp
                        </a>
                      </div>

                      {contato.email && (
                        <p>📧 {contato.email}</p>
                      )}

                      {contato.observacoes && (
                        <p className="text-muted mt-2">{contato.observacoes}</p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(contato.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <Portal>
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="surface-card rounded-xl w-full max-w-lg">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Adicionar Contato</h3>
                <button onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}>
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nome *</label>
                <input 
                  type="text" 
                  name="nome" 
                  value={formData.nome} 
                  onChange={handleChange}
                  placeholder="Nome completo"
                  className="w-full px-4 py-2 border rounded-lg" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Parentesco</label>
                <select 
                  name="parentesco" 
                  value={formData.parentesco} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">Selecione...</option>
                  <option value="pai">Pai</option>
                  <option value="mae">Mãe</option>
                  <option value="conjuge">Cônjuge</option>
                  <option value="filho">Filho(a)</option>
                  <option value="irmao">Irmão(ã)</option>
                  <option value="amigo">Amigo(a)</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Telefone *</label>
                <input 
                  type="tel" 
                  name="telefone" 
                  value={formData.telefone} 
                  onChange={handleChange}
                  placeholder="+55 11 99999-9999"
                  className="w-full px-4 py-2 border rounded-lg" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange}
                  placeholder="email@exemplo.com"
                  className="w-full px-4 py-2 border rounded-lg" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Observações</label>
                <textarea 
                  name="observacoes" 
                  value={formData.observacoes} 
                  onChange={handleChange}
                  rows={3}
                  placeholder="Informações adicionais..."
                  className="w-full px-4 py-2 border rounded-lg" 
                />
              </div>
            </div>

            <div className="p-6 border-t flex gap-3">
              <button 
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }} 
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-white/5"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSave} 
                disabled={isSaving} 
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isSaving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
        </Portal>
      )}
    </div>
  );
}
