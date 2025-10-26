'use client';

import { useState, useEffect } from 'react';
import { Plane, Plus, Edit2, Trash2, X, Save, AlertCircle } from 'lucide-react';
import { 
  getClienteMilhas, 
  createMilhas, 
  updateMilhas, 
  deleteMilhas 
} from "@/app/(protected)/clientes/[id]/actions";
import { useRouter } from 'next/navigation';

interface Milhas {
  id: string;
  companhia: string; // CORRIGIDO para 'companhia'
  numero_programa: string; // CORRIGIDO para 'numero_programa'
  categoria?: string;
  saldo_estimado?: number; // CORRIGIDO para 'saldo_estimado'
  data_validade?: string;
  observacoes?: string;
  created_at: string;
}

interface MilhasTabProps {
  clienteId: string;
}

export default function MilhasTab({ clienteId }: MilhasTabProps) {
  const router = useRouter();
  const [milhas, setMilhas] = useState<Milhas[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMilhas, setEditingMilhas] = useState<Milhas | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    companhia: '', // CORRIGIDO
    numero_programa: '', // CORRIGIDO
    categoria: '',
    saldo_estimado: '', // CORRIGIDO
    data_validade: '',
    observacoes: '',
  });

  useEffect(() => {
    loadMilhas();
  }, [clienteId]);

  async function loadMilhas() {
    setIsLoading(true);
    const result = await getClienteMilhas(clienteId);
    if (result.success && result.data) {
      setMilhas(result.data);
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
    if (!formData.companhia || !formData.numero_programa) { // CORRIGIDO: Checa os novos nomes
      alert('Companhia e número do programa são obrigatórios');
      return;
    }

    setIsSaving(true);

    const formDataToSend = new FormData();
    // Mapeia os campos do estado para os nomes esperados na Server Action
    formDataToSend.append('programa', formData.companhia); // Mapeia 'companhia' do estado para 'programa' do FormData
    formDataToSend.append('numero_cartao', formData.numero_programa); // Mapeia 'numero_programa' do estado para 'numero_cartao' do FormData
    formDataToSend.append('categoria', formData.categoria);
    formDataToSend.append('saldo', formData.saldo_estimado); // Mapeia 'saldo_estimado' do estado para 'saldo' do FormData
    formDataToSend.append('data_validade', formData.data_validade);
    formDataToSend.append('observacoes', formData.observacoes);


    let result;
    if (editingMilhas) {
      result = await updateMilhas(editingMilhas.id, formDataToSend, clienteId);
    } else {
      result = await createMilhas(clienteId, formDataToSend);
    }

    if (result.success) {
      setShowModal(false);
      setEditingMilhas(null);
      resetForm();
      await loadMilhas();
      router.refresh();
    } else {
      alert('Erro ao salvar: ' + result.error);
    }

    setIsSaving(false);
  }

  function handleEdit(milha: Milhas) {
    setEditingMilhas(milha);
    setFormData({
      companhia: milha.companhia || '', // CORRIGIDO
      numero_programa: milha.numero_programa || '', // CORRIGIDO
      categoria: milha.categoria || '',
      saldo_estimado: milha.saldo_estimado?.toString() || '', // CORRIGIDO
      data_validade: milha.data_validade || '',
      observacoes: milha.observacoes || '',
    });
    setShowModal(true);
  }

  async function handleDelete(milhaId: string) {
    if (!confirm('Deletar programa de milhas?')) return;

    const result = await deleteMilhas(milhaId, clienteId);
    if (result.success) {
      await loadMilhas();
      router.refresh();
    }
  }

  function resetForm() {
    setFormData({
      companhia: '', // CORRIGIDO
      numero_programa: '', // CORRIGIDO
      categoria: '',
      saldo_estimado: '', // CORRIGIDO
      data_validade: '',
      observacoes: '',
    });
  }

  function getCategoriaColor(categoria?: string) {
    const cores: Record<string, string> = {
      basico: 'bg-gray-100 text-gray-800',
      prata: 'bg-slate-100 text-slate-800',
      ouro: 'bg-yellow-100 text-yellow-800',
      platina: 'bg-purple-100 text-purple-800',
      diamante: 'bg-blue-100 text-blue-800',
    };
    return categoria ? cores[categoria] || 'bg-gray-100 text-gray-800' : 'bg-gray-100 text-gray-800';
  }

  function isVencendo(dataValidade?: string) {
    if (!dataValidade) return false;
    const hoje = new Date();
    const validade = new Date(dataValidade);
    const diffDias = Math.floor((validade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    return diffDias <= 90 && diffDias > 0;
  }

  function isVencido(dataValidade?: string) {
    if (!dataValidade) return false;
    const hoje = new Date();
    const validade = new Date(dataValidade);
    return validade < hoje;
  }

  function formatarSaldo(saldo?: number) {
    if (!saldo) return '-';
    return new Intl.NumberFormat('pt-BR').format(saldo);
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Plane className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Programas de Milhas</h2>
            <p className="text-sm text-gray-600">{milhas.length} programa(s)</p>
          </div>
        </div>
        
        <button
          onClick={() => {
            setEditingMilhas(null);
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
        >
          <Plus className="w-4 h-4" />
          Adicionar
        </button>
      </div>

      {/* Alertas */}
      {milhas.some(m => isVencido(m.data_validade)) && (
        <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900">Milhas Vencidas</p>
            <p className="text-sm text-red-700 mt-1">
              Existem milhas vencidas neste programa.
            </p>
          </div>
        </div>
      )}

      {milhas.some(m => isVencendo(m.data_validade)) && (
        <div className="mx-6 mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-900">Milhas Vencendo</p>
            <p className="text-sm text-yellow-700 mt-1">
              Existem milhas que vencem nos próximos 90 dias.
            </p>
          </div>
        </div>
      )}

      <div className="p-6">
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">Carregando...</div>
        ) : milhas.length === 0 ? (
          <div className="text-center py-12">
            <Plane className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">Nenhum programa cadastrado</p>
            <button
              onClick={() => setShowModal(true)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Adicionar primeiro programa
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {milhas.map((milha) => (
              <div
                key={milha.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Plane className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">{milha.companhia}</h3>
                    </div>
                    {milha.companhia && (
                      <p className="text-sm text-gray-600">{milha.companhia}</p>
                    )}
                  </div>
                  {milha.categoria && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoriaColor(milha.categoria)}`}>
                      {milha.categoria.toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Cartão:</span> {milha.numero_programa}
                  </p>

                  {milha.saldo_estimado !== null && milha.saldo_estimado !== undefined && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Saldo:</span>{' '}
                      <span className="text-lg font-semibold text-blue-600">
                        {formatarSaldo(milha.saldo_estimado)} milhas
                      </span>
                    </p>
                  )}

                  {milha.data_validade && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Validade:</span>{' '}
                      <span className={
                        isVencido(milha.data_validade) ? 'text-red-600 font-medium' :
                        isVencendo(milha.data_validade) ? 'text-yellow-600 font-medium' :
                        ''
                      }>
                        {new Date(milha.data_validade).toLocaleDateString('pt-BR')}
                      </span>
                    </p>
                  )}

                  {milha.observacoes && (
                    <p className="text-sm text-gray-500 mt-2">{milha.observacoes}</p>
                  )}
                </div>

                <div className="flex gap-2 pt-3 border-t">
                  <button
                    onClick={() => handleEdit(milha)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(milha.id)}
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
          <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">
                  {editingMilhas ? 'Editar' : 'Adicionar'} Programa
                </h3>
                <button onClick={() => {
                  setShowModal(false);
                  setEditingMilhas(null);
                  resetForm();
                }}>
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Companhia Aérea / Programa *</label>
                <select 
                  name="companhia" // CORRIGIDO: Nome do campo
                  value={formData.companhia} // CORRIGIDO: Nome do campo
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">Selecione...</option>
                  <option value="LATAM Pass">LATAM Pass</option>
                  <option value="Smiles">Smiles (Gol)</option>
                  <option value="TudoAzul">TudoAzul (Azul)</option>
                  <option value="Miles&Go">Miles&Go (Copa)</option>
                  <option value="SkyMiles">SkyMiles (Delta)</option>
                  <option value="MileagePlus">MileagePlus (United)</option>
                  <option value="Flying Blue">Flying Blue (Air France/KLM)</option>
                  <option value="Avios">Avios (British Airways)</option>
                  <option value="Miles & More">Miles & More (Lufthansa)</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              {/* O campo de Companhia Aérea separada foi removido para simplificar com o campo acima, 
              evitando o erro de not-null na action. */}

              <div>
                <label className="block text-sm font-medium mb-2">Número do Programa *</label>
                <input 
                  type="text" 
                  name="numero_programa" // CORRIGIDO: Nome do campo
                  value={formData.numero_programa} // CORRIGIDO: Nome do campo
                  onChange={handleChange}
                  placeholder="000000000"
                  className="w-full px-4 py-2 border rounded-lg" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Categoria</label>
                <select 
                  name="categoria" 
                  value={formData.categoria} 
                  onChange={handleChange} 
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="">Selecione...</option>
                  <option value="basico">Básico</option>
                  <option value="prata">Prata</option>
                  <option value="ouro">Ouro</option>
                  <option value="platina">Platina</option>
                  <option value="diamante">Diamante</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Saldo (milhas)</label>
                <input 
                  type="number" 
                  name="saldo_estimado" // CORRIGIDO: Nome do campo
                  value={formData.saldo_estimado} // CORRIGIDO: Nome do campo
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full px-4 py-2 border rounded-lg" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Data de Validade</label>
                <input 
                  type="date" 
                  name="data_validade" 
                  value={formData.data_validade} 
                  onChange={handleChange}
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
                  setEditingMilhas(null);
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