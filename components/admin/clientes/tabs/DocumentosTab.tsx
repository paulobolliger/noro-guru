'use client';

import { useState, useEffect } from 'react';
import { FileText, Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { 
  getClienteDocumentos, 
  createDocumento, 
  deleteDocumento 
} from '@/app/admin/(protected)/clientes/[id]/actions';
import { useRouter } from 'next/navigation';

interface Documento {
  id: string;
  tipo: string;
  numero?: string;
  pais_emissor?: string;
  data_emissao?: string;
  data_validade?: string;
  status: string;
  created_at: string;
}

interface DocumentosTabProps {
  clienteId: string;
}

export default function DocumentosTab({ clienteId }: DocumentosTabProps) {
  const router = useRouter();
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    tipo: 'passaporte',
    numero: '',
    pais_emissor: 'Brasil',
    data_emissao: '',
    data_validade: '',
    status: 'valido',
  });

  useEffect(() => {
    loadDocumentos();
  }, [clienteId]);

  async function loadDocumentos() {
    setIsLoading(true);
    const result = await getClienteDocumentos(clienteId);
    if (result.success && result.data) {
      setDocumentos(result.data);
    }
    setIsLoading(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }

  async function handleSave() {
    setIsSaving(true);

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key as keyof typeof formData]);
    });

    const result = await createDocumento(clienteId, formDataToSend);

    if (result.success) {
      setShowModal(false);
      resetForm();
      await loadDocumentos();
      router.refresh();
    } else {
      alert('Erro ao salvar: ' + result.error);
    }

    setIsSaving(false);
  }

  async function handleDelete(docId: string) {
    if (!confirm('Deletar documento?')) return;

    const result = await deleteDocumento(docId, clienteId);
    if (result.success) {
      await loadDocumentos();
      router.refresh();
    }
  }

  function resetForm() {
    setFormData({
      tipo: 'passaporte',
      numero: '',
      pais_emissor: 'Brasil',
      data_emissao: '',
      data_validade: '',
      status: 'valido',
    });
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Documentos</h2>
            <p className="text-sm text-gray-600">{documentos.length} documento(s)</p>
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
          <div className="text-center py-12 text-gray-500">Carregando...</div>
        ) : documentos.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">Nenhum documento cadastrado</p>
            <button
              onClick={() => setShowModal(true)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Adicionar primeiro documento
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documentos.map((doc) => (
              <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900">{doc.tipo}</span>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {doc.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {doc.numero && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Número:</span> {doc.numero}
                    </p>
                  )}
                  {doc.data_validade && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Validade:</span>{' '}
                      {new Date(doc.data_validade).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 pt-3 border-t">
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                    Deletar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Adicionar Documento</h3>
                <button onClick={() => setShowModal(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tipo</label>
                <select name="tipo" value={formData.tipo} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
                  <option value="passaporte">Passaporte</option>
                  <option value="visto">Visto</option>
                  <option value="rg">RG</option>
                  <option value="cpf">CPF</option>
                  <option value="cnh">CNH</option>
                  <option value="vacina">Vacina</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Número</label>
                <input 
                  type="text" 
                  name="numero" 
                  value={formData.numero} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border rounded-lg" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">País Emissor</label>
                <input 
                  type="text" 
                  name="pais_emissor" 
                  value={formData.pais_emissor} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border rounded-lg" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Emissão</label>
                  <input 
                    type="date" 
                    name="data_emissao" 
                    value={formData.data_emissao} 
                    onChange={handleChange} 
                    className="w-full px-4 py-2 border rounded-lg" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Validade</label>
                  <input 
                    type="date" 
                    name="data_validade" 
                    value={formData.data_validade} 
                    onChange={handleChange} 
                    className="w-full px-4 py-2 border rounded-lg" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
                  <option value="valido">Válido</option>
                  <option value="vencido">Vencido</option>
                  <option value="pendente">Pendente</option>
                </select>
              </div>
            </div>

            <div className="p-6 border-t flex gap-3">
              <button 
                onClick={() => setShowModal(false)} 
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