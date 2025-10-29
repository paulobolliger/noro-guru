'use client';

import { useEffect, useState } from 'react';
import { FileText, Plus, Edit2, Trash2, X, UploadCloud, Loader2, AlertCircle, Eye, AlertTriangle } from 'lucide-react';
import { NButton, NSelect, NTextarea, NAlert, NInput } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { 
  getClienteDocumentos, 
  createDocumento, 
  updateDocumento,
  deleteDocumento 
} from "@/app/(protected)/clientes/[id]/actions";
import type { DocumentoStatus, DocumentoTipo } from "@types/clientes";
import { PAISES_E_NACIONALIDADES } from "@lib/client-data";

interface Documento {
  id: string;
  tipo: DocumentoTipo;
  numero?: string | null;
  pais_emissor?: string | null;
  orgao_emissor?: string | null;
  data_emissao?: string | null;
  data_validade?: string | null;
  status: DocumentoStatus;
  arquivo_url?: string | null;
  arquivo_public_id?: string | null;
  arquivo_nome?: string | null;
  arquivo_tamanho?: number | null;
  observacoes?: string | null;
  created_at: string;
}

interface DocumentosTabProps {
  clienteId: string;
}

const initialFormState = {
  tipo: 'passaporte' as DocumentoTipo,
  numero: '',
  pais_emissor: 'Brasil',
  orgao_emissor: '',
  data_emissao: '',
  data_validade: '',
  status: 'valido' as DocumentoStatus,
  observacoes: '',
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
  const [statusMsg, setStatusMsg] = useState<{ ok: boolean; msg: string } | null>(null);
  const [listFilter, setListFilter] = useState<'todos' | 'vencendo' | 'vencidos'>('todos');

  useEffect(() => { loadDocumentos(); }, [clienteId]);

  async function loadDocumentos() {
    setIsLoading(true);
    const result = await getClienteDocumentos(clienteId);
    if (result.success && result.data) setDocumentos(result.data as Documento[]);
    setIsLoading(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setFileToUpload(file);
    setUploadError(null);
  }

  async function handleUpload() {
    if (!fileToUpload) return null;
    try {
      const folder = `clientes/${clienteId}/documentos`;
      const signRes = await fetch('/api/cloudinary/sign', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ folder })
      });
      const sign = await signRes.json();
      if (!signRes.ok) throw new Error(sign.error || 'Falha na assinatura do upload');

      const form = new FormData();
      form.append('file', fileToUpload);
      form.append('api_key', sign.apiKey);
      form.append('timestamp', String(sign.timestamp));
      if (sign.folder) form.append('folder', sign.folder);
      form.append('signature', sign.signature);

      const resp = await fetch(`https://api.cloudinary.com/v1_1/${sign.cloudName}/auto/upload`, { method: 'POST', body: form });
      const data = await resp.json();
      if (data.error) throw new Error(data.error.message || 'Falha no upload');
      return data;
    } catch (error: any) {
      setUploadError(error.message);
      return null;
    }
  }

  function closeModal() {
    setShowModal(false);
    setEditingDoc(null);
    setFormData(initialFormState);
    setFileToUpload(null);
    setUploadError(null);
  }

  function handleEdit(doc: Documento) {
    setEditingDoc(doc);
    setFormData({
      tipo: doc.tipo,
      numero: doc.numero || '',
      pais_emissor: doc.pais_emissor || 'Brasil',
      orgao_emissor: doc.orgao_emissor || '',
      data_emissao: doc.data_emissao || '',
      data_validade: doc.data_validade || '',
      status: doc.status,
      observacoes: doc.observacoes || '',
      arquivo_url: doc.arquivo_url || '',
      arquivo_public_id: doc.arquivo_public_id || '',
      arquivo_nome: doc.arquivo_nome || '',
      arquivo_tamanho: doc.arquivo_tamanho || 0,
    });
    setShowModal(true);
  }

  async function handleDelete(id: string) {
    const ok = confirm('Excluir este documento?');
    if (!ok) return;
    const result = await deleteDocumento(id, clienteId);
    if (result.success) { await loadDocumentos(); router.refresh(); setStatusMsg({ ok: true, msg: 'Documento removido com sucesso.'}); }
    else setStatusMsg({ ok: false, msg: 'Erro ao deletar: ' + result.error });
  }

  async function handleSave() {
    setIsSaving(true);
    setUploadError(null);

    let uploaded: any = null;
    if (fileToUpload) {
      uploaded = await handleUpload();
      if (!uploaded) { setIsSaving(false); return; }
    }

    const fd = new FormData();
    Object.keys(formData).forEach((key) => {
      // @ts-ignore
      const v = formData[key];
      if (v !== undefined && v !== null) fd.append(key, String(v));
    });
    if (uploaded) {
      fd.set('arquivo_url', uploaded.secure_url);
      fd.set('arquivo_public_id', uploaded.public_id);
      fd.set('arquivo_nome', uploaded.original_filename || uploaded.public_id);
      fd.set('arquivo_tamanho', String(uploaded.bytes || 0));
    }

    const result = editingDoc
      ? await updateDocumento(editingDoc.id, fd)
      : await createDocumento(clienteId, fd);

    if (result.success) {
      closeModal();
      await loadDocumentos();
      router.refresh();
      setStatusMsg({ ok: true, msg: 'Documento salvo com sucesso.'});
    } else {
      setStatusMsg({ ok: false, msg: 'Erro ao salvar: ' + (result.error || result.message) });
    }

    setIsSaving(false);
  }

  function getStatusConfig(status: string) {
    const configs: Record<string, { bg: string; text: string }> = {
      valido: { bg: 'bg-green-100', text: 'text-green-800' },
      vencido: { bg: 'bg-red-100', text: 'text-red-800' },
      pendente: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      renovando: { bg: 'bg-blue-100', text: 'text-blue-800' },
    };
    return configs[status] || { bg: 'bg-white/10', text: 'text-gray-800' };
  }

  return (
    <div className="surface-card rounded-xl shadow-sm border border-default">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-default border-default">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold text-primary">Documentos</h2>
            <p className="text-sm text-muted">
              {documentos.length} documento(s) cadastrados{listFilter !== 'todos' ? ` • Filtro: ${listFilter}` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <NSelect
            value={listFilter}
            onChange={(e) => setListFilter(e.target.value as any)}
            className="px-3 py-2 rounded-lg text-sm font-medium"
            title="Filtrar documentos"
          >
            <option value="todos">Todos</option>
            <option value="vencendo">Vencendo (≤ 90 dias)</option>
            <option value="vencidos">Vencidos</option>
          </NSelect>
          <NButton onClick={() => setShowModal(true)} variant="primary" leftIcon={<Plus className="w-4 h-4" />}>Adicionar Documento</NButton>
        </div>
      </div>

      {statusMsg && (
        <div className="px-6 pt-4">
          <NAlert variant={statusMsg.ok ? 'success' : 'error'} icon={statusMsg.ok ? <AlertCircle className="w-4 h-4"/> : <AlertTriangle className="w-4 h-4"/>}>
            {statusMsg.msg}
          </NAlert>
        </div>
      )}

      {/* Grid de Documentos */}
      <div className="p-6">
        {isLoading ? (
          <div className="text-center py-12 text-muted">Carregando...</div>
        ) : documentos.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-muted mb-2">Nenhum documento cadastrado.</p>
            <button onClick={() => setShowModal(true)} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Adicionar primeiro documento
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documentos
              .filter(doc => {
                if (listFilter === 'todos') return true;
                if (!doc.data_validade) return false;
                const validade = new Date(doc.data_validade);
                const now = new Date();
                const diasRestantes = Math.ceil((validade.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                if (listFilter === 'vencendo') return diasRestantes >= 0 && diasRestantes <= 90;
                if (listFilter === 'vencidos') return diasRestantes < 0;
                return true;
              })
              .map((doc) => {
                const statusConfig = getStatusConfig(doc.status);
                const validade = doc.data_validade ? new Date(doc.data_validade) : null;
                const now = new Date();
                const diasRestantes = validade ? Math.ceil((validade.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null;
                const isVencido = diasRestantes !== null && diasRestantes < 0;
                const isAExpirar = diasRestantes !== null && diasRestantes >= 0 && diasRestantes <= 90;
                return (
                  <div key={doc.id} className="border border-default rounded-lg p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <span className="font-semibold text-primary capitalize">{doc.tipo.replace('_', ' ')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                            {doc.status}
                          </span>
                          {isVencido && (
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3"/> Vencido
                            </span>
                          )}
                          {!isVencido && isAExpirar && (
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                              Vence em {diasRestantes} dia(s)
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        {doc.numero && <p className="text-sm text-muted"><span className="font-medium">Número:</span> {doc.numero}</p>}
                        {doc.data_validade && <p className="text-sm text-muted"><span className="font-medium">Validade:</span> {new Date(doc.data_validade).toLocaleDateString('pt-BR')}</p>}
                        {diasRestantes !== null && (
                          <p className="text-sm text-muted">
                            <span className="font-medium">Dias restantes:</span> {diasRestantes >= 0 ? diasRestantes : `-${Math.abs(diasRestantes)}`} {diasRestantes >= 0 ? '' : '(vencido)'}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-3 border-t">
                      {doc.arquivo_url && (
                        <>
                          <a href={doc.arquivo_url} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Eye className="w-4 h-4" /> Visualizar
                          </a>
                          <a href={doc.arquivo_url} download className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-primary hover:bg-white/5 rounded-lg">
                            Baixar
                          </a>
                        </>
                      )}
                      <button onClick={() => handleEdit(doc)} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-primary hover:bg-white/5 rounded-lg">
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
          <div className="surface-card rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-default flex items-center justify-between">
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
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-default border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-muted justify-center">
                            <label htmlFor="file-upload" className="relative cursor-pointer surface-card rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                <span>Selecione um arquivo</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                            </label>
                        </div>
                        {fileToUpload && <p className="text-xs text-muted">{fileToUpload.name}</p>}
                        {!fileToUpload && formData.arquivo_nome && <p className="text-xs text-muted">Arquivo atual: {formData.arquivo_nome}</p>}
                        {uploadError && <p className="text-xs text-red-500 flex items-center justify-center gap-1"><AlertCircle size={14}/> {uploadError}</p>}
                    </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t flex gap-3 justify-end">
              <button onClick={closeModal} className="px-4 py-2 border rounded-lg hover:bg-white/5">Cancelar</button>
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
