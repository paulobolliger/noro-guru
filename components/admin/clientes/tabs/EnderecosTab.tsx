'use client';

import { useState, useEffect } from 'react';
import { MapPin, Plus, Edit2, Trash2, X, Save, Star } from 'lucide-react';
import { 
  getClienteEnderecos, 
  createEndereco, 
  updateEndereco, 
  deleteEndereco 
} from '@/app/admin/(protected)/clientes/[id]/actions';
import { useRouter } from 'next/navigation';

interface Endereco {
  id: string;
  tipo: string;
  principal: boolean;
  logradouro: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade: string;
  estado?: string;
  cep?: string;
  pais: string;
}

interface EnderecosTabProps {
  clienteId: string;
}

export default function EnderecosTab({ clienteId }: EnderecosTabProps) {
  const router = useRouter();
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEndereco, setEditingEndereco] = useState<Endereco | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    tipo: 'residencial',
    principal: false,
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    pais: 'Brasil',
  });

  useEffect(() => {
    loadEnderecos();
  }, [clienteId]);

  async function loadEnderecos() {
    setIsLoading(true);
    const result = await getClienteEnderecos(clienteId);
    if (result.success && result.data) {
      setEnderecos(result.data);
    }
    setIsLoading(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }

  async function handleSave() {
    setIsSaving(true);

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, String(formData[key as keyof typeof formData]));
    });

    let result;
    if (editingEndereco) {
      result = await updateEndereco(editingEndereco.id, formDataToSend, clienteId);
    } else {
      result = await createEndereco(clienteId, formDataToSend);
    }

    if (result.success) {
      setShowModal(false);
      setEditingEndereco(null);
      resetForm();
      await loadEnderecos();
      router.refresh();
    } else {
      alert('Erro ao salvar: ' + result.error);
    }

    setIsSaving(false);
  }

  function handleEdit(endereco: Endereco) {
    setEditingEndereco(endereco);
    setFormData({
      tipo: endereco.tipo,
      principal: endereco.principal,
      logradouro: endereco.logradouro,
      numero: endereco.numero || '',
      complemento: endereco.complemento || '',
      bairro: endereco.bairro || '',
      cidade: endereco.cidade,
      estado: endereco.estado || '',
      cep: endereco.cep || '',
      pais: endereco.pais,
    });
    setShowModal(true);
  }

  async function handleDelete(enderecoId: string) {
    if (!confirm('Deletar endereço?')) return;

    const result = await deleteEndereco(enderecoId, clienteId);
    if (result.success) {
      await loadEnderecos();
      router.refresh();
    }
  }

  function resetForm() {
    setFormData({
      tipo: 'residencial',
      principal: false,
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: '',
      pais: 'Brasil',
    });
  }

  function getTipoLabel(tipo: string) {
    const tipos: Record<string, string> = {
      residencial: 'Residencial',
      comercial: 'Comercial',
      cobranca: 'Cobrança',
      entrega: 'Entrega',
    };
    return tipos[tipo] || tipo;
  }

  function getTipoColor(tipo: string) {
    const cores: Record<string, string> = {
      residencial: 'bg-blue-100 text-blue-800',
      comercial: 'bg-purple-100 text-purple-800',
      cobranca: 'bg-yellow-100 text-yellow-800',
      entrega: 'bg-green-100 text-green-800',
    };
    return cores[tipo] || 'bg-gray-100 text-gray-800';
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <MapPin className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Endereços</h2>
            <p className="text-sm text-gray-600">{enderecos.length} endereço(s)</p>
          </div>
        </div>
        
        <button
          onClick={() => {
            setEditingEndereco(null);
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
        >
          <Plus className="w-4 h-4" />
          Adicionar
        </button>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">Carregando...</div>
        ) : enderecos.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">Nenhum endereço cadastrado</p>
            <button
              onClick={() => setShowModal(true)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Adicionar primeiro endereço
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enderecos.map((endereco) => (
              <div
                key={endereco.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTipoColor(endereco.tipo)}`}>
                      {getTipoLabel(endereco.tipo)}
                    </span>
                    {endereco.principal && (
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    )}
                  </div>
                </div>

                <div className="space-y-1 mb-4 text-sm text-gray-700">
                  <p className="font-medium">{endereco.logradouro}, {endereco.numero}</p>
                  {endereco.complemento && <p>{endereco.complemento}</p>}
                  {endereco.bairro && <p>{endereco.bairro}</p>}
                  <p>{endereco.cidade}{endereco.estado ? `, ${endereco.estado}` : ''}</p>
                  {endereco.cep && <p>CEP: {endereco.cep}</p>}
                  <p className="text-gray-500">{endereco.pais}</p>
                </div>

                <div className="flex gap-2 pt-3 border-t">
                  <button
                    onClick={() => handleEdit(endereco)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(endereco.id)}
                    className="flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">
                  {editingEndereco ? 'Editar' : 'Adicionar'} Endereço
                </h3>
                <button onClick={() => {
                  setShowModal(false);
                  setEditingEndereco(null);
                  resetForm();
                }}>
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tipo *</label>
                  <select 
                    name="tipo" 
                    value={formData.tipo} 
                    onChange={handleChange} 
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="residencial">Residencial</option>
                    <option value="comercial">Comercial</option>
                    <option value="cobranca">Cobrança</option>
                    <option value="entrega">Entrega</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="principal"
                      checked={formData.principal}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-gray-700">Endereço Principal</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">CEP</label>
                <input 
                  type="text" 
                  name="cep" 
                  value={formData.cep} 
                  onChange={handleChange}
                  placeholder="00000-000"
                  className="w-full px-4 py-2 border rounded-lg" 
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-2">Logradouro *</label>
                  <input 
                    type="text" 
                    name="logradouro" 
                    value={formData.logradouro} 
                    onChange={handleChange}
                    placeholder="Rua, Avenida..."
                    className="w-full px-4 py-2 border rounded-lg" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Número</label>
                  <input 
                    type="text" 
                    name="numero" 
                    value={formData.numero} 
                    onChange={handleChange}
                    placeholder="123"
                    className="w-full px-4 py-2 border rounded-lg" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Complemento</label>
                <input 
                  type="text" 
                  name="complemento" 
                  value={formData.complemento} 
                  onChange={handleChange}
                  placeholder="Apt, Sala, Bloco..."
                  className="w-full px-4 py-2 border rounded-lg" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bairro</label>
                <input 
                  type="text" 
                  name="bairro" 
                  value={formData.bairro} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Cidade *</label>
                  <input 
                    type="text" 
                    name="cidade" 
                    value={formData.cidade} 
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Estado</label>
                  <input 
                    type="text" 
                    name="estado" 
                    value={formData.estado} 
                    onChange={handleChange}
                    placeholder="SP, RJ..."
                    className="w-full px-4 py-2 border rounded-lg" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">País *</label>
                <input 
                  type="text" 
                  name="pais" 
                  value={formData.pais} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg" 
                />
              </div>
            </div>

            <div className="p-6 border-t flex gap-3">
              <button 
                onClick={() => {
                  setShowModal(false);
                  setEditingEndereco(null);
                  resetForm();
                }} 
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
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
      )}
    </div>
  );
}