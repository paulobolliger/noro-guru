// components/admin/clientes/tabs/DocumentosTab.tsx
'use client';

import { useState, useEffect } from 'react';
import { FileText, Plus, Edit2, Trash2, X, Save, UploadCloud, Loader2, AlertCircle, Eye } from 'lucide-react';
import { 
  getClienteDocumentos, 
  createDocumento, 
  updateDocumento,
  deleteDocumento 
} from '@/app/admin/(protected)/clientes/[id]/actions';
import { useRouter } from 'next/navigation';
import type { DocumentoStatus, DocumentoTipo } from '@/types/clientes';
import { PAISES_E_NACIONALIDADES } from '@/lib/client-data';

// Interface completa do documento, alinhada com a DB
interface Documento {
  id: string;
  tipo: DocumentoTipo;
  numero?: string | null;
  pais_emissor?: string | null;
  data_emissao?: string | null;
  data_validade?: string | null;
  status: DocumentoStatus;
  arquivo_url?: string | null;
  arquivo_nome?: string | null;
  created_at: string;
}

interface DocumentosTabProps {
  clienteId: string;
}

// Estado inicial do formulário
const initialFormState = {
  tipo: 'passaporte' as DocumentoTipo,
  numero: '',
  pais_emissor: 'Brasil',
  data_emissao: '',
  data_validade: '',
  status: 'valido' as DocumentoStatus,
  observacoes: '',
  // Campos de arquivo
  arquivo_url: '',
  arquivo_public_id: '',
  arquivo_nome: '',
  arquivo_tamanho: 0,
};

export default function DocumentosTab({ clienteId }: DocumentosTabProps) {
  const router = useRouter();
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Documento | null>(null);
  
  const [formData, setFormData] = useState(initialFormState);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    loadDocumentos();
  }, [clienteId]);

  async function loadDocumentos() {
    setIsLoading(true);
    const result = await getClienteDocumentos(clienteId);
    if (result.success && result.data) {
      setDocumentos(result.data as Documento[]);
    }
    setIsLoading(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setFileToUpload(file);
      setUploadError(null);
    }
  }

  async function handleUpload() {
    if (!fileToUpload) return null;

    const uploadFormData = new FormData();
    uploadFormData.append('file', fileToUpload);
    uploadFormData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`, {
        method: 'POST',
        body: uploadFormData,
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message);
      }
      return data;
    } catch (error: any) {
      setUploadError(error.message);
      return null;
    }
  }

  async function handleSave() {
    setIsSaving(true);
    setUploadError(null);

    let uploadedFileData = null;
    if (fileToUpload) {
      uploadedFileData = await handleUpload();
      if (!uploadedFileData) {
        setIsSaving(false);
        return;
      }
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key as keyof typeof formData] as string);
    });

    if (uploadedFileData) {
      formDataToSend.set('arquivo_url', uploadedFileData.secure_url);
      formDataToSend.set('arquivo_public_id', uploadedFileData.public_id);
      formDataToSend.set('arquivo_nome', uploadedFileData.original_filename);
      formDataToSend.set('arquivo_tamanho', uploadedFileData.bytes);
    }

    const result = editingDoc
      ? await updateDocumento(editingDoc.id, formDataToSend)
      : await createDocumento(clienteId, formDataToSend);

    if (result.success) {
      closeModal();
      await loadDocumentos();
      router.refresh();
    } else {
      alert('Erro ao salvar: ' + result.error);
    }

    setIsSaving(false);
  }

  async function handleDelete(docId: string) {
    if (!confirm('Tem certeza que deseja deletar este documento?')) return;
    const result = await deleteDocumento(docId, clienteId);
    if (result.success) {
      await loadDocumentos();
      router.refresh();
    }
  }

  function handleEdit(doc: Documento) {
    setEditingDoc(doc);
    setFormData({
      tipo: doc.tipo,
      numero: doc.numero || '',
      pais_emissor: doc.pais_emissor || 'Brasil',
      data_emissao: doc.data_emissao ? new Date(doc.data_emissao).toISOString().split('T')[0] : '',
      data_validade: doc.data_validade ? new Date(doc.data_validade).toISOString().split('T')[0] : '',
      status: doc.status,
      observacoes: '', // Limpo para edição, já que não temos esse campo na UI de lista
      // Campos de arquivo não são editáveis diretamente
      arquivo_url: doc.arquivo_url || '',
      arquivo_public_id: '',
      arquivo_nome: doc.arquivo_nome || '',
      arquivo_tamanho: 0,
    });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingDoc(null);
    setFileToUpload(null);
    setUploadError(null);
    setFormData(initialFormState);
  }
  
  const getStatusConfig = (status: string) => {
    const configs: Record<string, { bg: string; text: string }> = {
        valido: { bg: 'bg-green-100', text: 'text-green-800' },
        vencido: { bg: 'bg-red-100', text: 'text-red-800' },
        pendente: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
        renovando: { bg: 'bg-blue-100', text: 'text-blue-800' },
    };
    return configs[status] || { bg: 'bg-gray-100', text: 'text-gray-800' };
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Documentos</h2>
            <p className="text-sm text-gray-600">{documentos.length} documento(s) cadastrados</p>
          </div>
        </div>
        
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg">
          <Plus className="w-4 h-4" /> Adicionar Documento
        </button>
      </div>

      {/* Grid de Documentos */}
      <div className="p-6">
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">Carregando...</div>
        ) : documentos.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">Nenhum documento cadastrado.</p>
            <button onClick={() => setShowModal(true)} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Adicionar primeiro documento
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documentos.map((doc) => {
              const statusConfig = getStatusConfig(doc.status);
              return (
                <div key={doc.id} className="border border-gray-200 rounded-lg p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-gray-900 capitalize">{doc.tipo.replace('_', ' ')}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                        {doc.status}
                      </span>
                    </div>
                    <div className="space-y-2 mb-4">
                      {doc.numero && <p className="text-sm text-gray-600"><span className="font-medium">Número:</span> {doc.numero}</p>}
                      {doc.data_validade && <p className="text-sm text-gray-600"><span className="font-medium">Validade:</span> {new Date(doc.data_validade).toLocaleDateString('pt-BR')}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-3 border-t">
                    {doc.arquivo_url && (
                        <a href={doc.arquivo_url} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Eye className="w-4 h-4" /> Visualizar
                        </a>
                    )}
                    <button onClick={() => handleEdit(doc)} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                      <Edit2 className="w-4 h-4" /> Editar
                    </button>
                    <button onClick={() => handleDelete(doc.id)} className="flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-semibold">{editingDoc ? 'Editar' : 'Adicionar'} Documento</h3>
              <button onClick={closeModal}><X className="w-6 h-6" /></button>
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
                  <option value="vacina">Certificado de Vacina</option>
                  <option value="certidao">Certidão</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Número</label>
                <input type="text" name="numero" value={formData.numero} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">País Emissor</label>
                <select name="pais_emissor" value={formData.pais_emissor} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
                    {PAISES_E_NACIONALIDADES.map(p => (
                        <option key={p.sigla} value={p.nome_pais}>{p.nome_pais}</option>
                    ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Data de Emissão</label>
                  <input type="date" name="data_emissao" value={formData.data_emissao} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Data de Validade</label>
                  <input type="date" name="data_validade" value={formData.data_validade} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
                  <option value="valido">Válido</option>
                  <option value="vencido">Vencido</option>
                  <option value="pendente">Pendente</option>
                  <option value="renovando">Em Renovação</option>
                </select>
              </div>
              <div>
                  <label className="block text-sm font-medium mb-2">Anexar Arquivo</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                          <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                              <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                  <span>Selecione um arquivo</span>
                                  <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                              </label>
                          </div>
                          {fileToUpload && <p className="text-xs text-gray-500">{fileToUpload.name}</p>}
                          {!fileToUpload && formData.arquivo_nome && <p className="text-xs text-gray-500">Arquivo atual: {formData.arquivo_nome}</p>}
                          {uploadError && <p className="text-xs text-red-500 flex items-center justify-center gap-1"><AlertCircle size={14}/> {uploadError}</p>}
                      </div>
                  </div>
              </div>
            </div>
            <div className="p-6 border-t flex gap-3 justify-end">
              <button onClick={closeModal} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancelar</button>
              <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                {isSaving && <Loader2 className="animate-spin w-4 h-4" />}
                {isSaving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}