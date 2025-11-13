'use client';

import { useState, useEffect } from 'react';
import { X, Mail, Phone, Calendar, Users, MapPin, MessageSquare, DollarSign, Percent, Clock, Tag, ExternalLink, FileText } from 'lucide-react';
import type { Database } from '@/types/supabase';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useRouter } from 'next/navigation';

type Lead = Database['public']['Tables']['noro_leads']['Row'] & {
  nomade_roteiros?: {
    id: string;
    titulo: string;
    slug: string;
    duracao_dias: number | null;
    preco_base: number | null;
    imagem_url: string | null;
  } | null;
};

interface LeadDetailModalProps {
  leadId: string;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

const STATUS_OPTIONS = [
  { value: 'novo', label: 'Novo', color: 'bg-blue-500' },
  { value: 'contato_inicial', label: 'Contato Inicial', color: 'bg-cyan-500' },
  { value: 'qualificado', label: 'Qualificado', color: 'bg-teal-500' },
  { value: 'proposta_enviada', label: 'Proposta Enviada', color: 'bg-purple-500' },
  { value: 'negociacao', label: 'Negociação', color: 'bg-orange-500' },
  { value: 'ganho', label: 'Ganho', color: 'bg-green-500' },
  { value: 'perdido', label: 'Perdido', color: 'bg-red-500' },
];

export default function LeadDetailModal({ leadId, isOpen, onClose, onUpdate }: LeadDetailModalProps) {
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [gerandoOrcamento, setGerandoOrcamento] = useState(false);

  // Estados para edição
  const [editedStatus, setEditedStatus] = useState('');
  const [editedNotas, setEditedNotas] = useState('');
  const [editedValor, setEditedValor] = useState('');
  const [editedProbabilidade, setEditedProbabilidade] = useState('');

  useEffect(() => {
    if (isOpen && leadId) {
      fetchLead();
    }
  }, [isOpen, leadId]);

  const fetchLead = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/leads/${leadId}`);
      const data = await response.json();

      if (data.lead) {
        setLead(data.lead);
        setEditedStatus(data.lead.status || 'novo');
        setEditedNotas(data.lead.notas || '');
        setEditedValor(data.lead.valor_estimado?.toString() || '');
        setEditedProbabilidade(data.lead.probabilidade_fechamento?.toString() || '');
      }
    } catch (error) {
      console.error('Erro ao buscar lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!lead) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editedStatus,
          notas: editedNotas,
          valor_estimado: editedValor ? parseFloat(editedValor) : null,
          probabilidade_fechamento: editedProbabilidade ? parseInt(editedProbabilidade) : null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setLead(data.lead);
        setEditMode(false);
        onUpdate?.();
      } else {
        alert('Erro ao salvar: ' + (data.error || 'Erro desconhecido'));
      }
    } catch (error) {
      console.error('Erro ao salvar lead:', error);
      alert('Erro ao salvar alterações');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">{lead?.nome || 'Carregando...'}</h2>
            <div className="flex items-center gap-4 text-sm opacity-90">
              <span className="flex items-center gap-1">
                <Mail size={14} />
                {lead?.email}
              </span>
              {lead?.telefone && (
                <span className="flex items-center gap-1">
                  <Phone size={14} />
                  {lead.telefone}
                  {lead.telefone_whatsapp && ' (WhatsApp)'}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">Carregando detalhes...</p>
            </div>
          ) : lead ? (
            <>
              {/* Status e Valores */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Status */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                  </label>
                  {editMode ? (
                    <select
                      value={editedStatus}
                      onChange={(e) => setEditedStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-3 h-3 rounded-full ${
                          STATUS_OPTIONS.find((s) => s.value === lead.status)?.color || 'bg-gray-400'
                        }`}
                      ></span>
                      <span className="font-medium">
                        {STATUS_OPTIONS.find((s) => s.value === lead.status)?.label || lead.status}
                      </span>
                    </div>
                  )}
                </div>

                {/* Valor Estimado */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                    <DollarSign size={16} />
                    Valor Estimado
                  </label>
                  {editMode ? (
                    <input
                      type="number"
                      value={editedValor}
                      onChange={(e) => setEditedValor(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-lg font-semibold text-gray-900">
                      {lead.valor_estimado
                        ? `€ ${lead.valor_estimado.toLocaleString('pt-PT')}`
                        : 'Não definido'}
                    </p>
                  )}
                </div>

                {/* Probabilidade */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                    <Percent size={16} />
                    Probabilidade
                  </label>
                  {editMode ? (
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={editedProbabilidade}
                      onChange={(e) => setEditedProbabilidade(e.target.value)}
                      placeholder="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-lg font-semibold text-gray-900">
                      {lead.probabilidade_fechamento ? `${lead.probabilidade_fechamento}%` : 'Não definido'}
                    </p>
                  )}
                </div>
              </div>

              {/* Informações do Roteiro */}
              {lead.nomade_roteiros && (
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <MapPin size={18} className="text-purple-600" />
                    Roteiro de Interesse
                  </h3>
                  <div className="flex gap-4">
                    {lead.nomade_roteiros.imagem_url && (
                      <img
                        src={lead.nomade_roteiros.imagem_url}
                        alt={lead.nomade_roteiros.titulo}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-lg text-gray-900">
                        {lead.nomade_roteiros.titulo}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        {lead.nomade_roteiros.duracao_dias && (
                          <span>{lead.nomade_roteiros.duracao_dias} dias</span>
                        )}
                        {lead.nomade_roteiros.preco_base && (
                          <span>€ {lead.nomade_roteiros.preco_base.toLocaleString('pt-PT')}</span>
                        )}
                      </div>
                      <a
                        href={`/destinos/${lead.nomade_roteiros.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
                      >
                        Ver roteiro <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Detalhes da Viagem */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Período */}
                {(lead.periodo_inicio || lead.periodo_flexivel) && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Calendar size={16} />
                      Período
                    </h4>
                    <p className="text-gray-900">
                      {lead.periodo_inicio && lead.periodo_fim
                        ? `${format(new Date(lead.periodo_inicio), 'dd/MM/yyyy', { locale: ptBR })} - ${format(new Date(lead.periodo_fim), 'dd/MM/yyyy', { locale: ptBR })}`
                        : lead.periodo_flexivel || 'Não especificado'}
                    </p>
                  </div>
                )}

                {/* Viajantes */}
                {(lead.num_adultos || lead.num_criancas) && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Users size={16} />
                      Viajantes
                    </h4>
                    <p className="text-gray-900">
                      {lead.num_adultos} adultos
                      {lead.num_criancas ? ` + ${lead.num_criancas} crianças` : ''}
                      <span className="text-sm text-gray-500 ml-2">
                        ({(lead.num_adultos || 0) + (lead.num_criancas || 0)} total)
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Serviços Desejados */}
              {lead.servicos_desejados && lead.servicos_desejados.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Tag size={16} />
                    Serviços Desejados
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {lead.servicos_desejados.map((servico, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {servico}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Mensagem do Lead */}
              {lead.mensagem && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <MessageSquare size={16} />
                    Mensagem
                  </h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{lead.mensagem}</p>
                </div>
              )}

              {/* Notas Internas */}
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <MessageSquare size={16} className="text-yellow-600" />
                  Notas Internas
                </h4>
                {editMode ? (
                  <textarea
                    value={editedNotas}
                    onChange={(e) => setEditedNotas(e.target.value)}
                    placeholder="Adicione notas sobre este lead..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {lead.notas || 'Nenhuma nota adicionada ainda.'}
                  </p>
                )}
              </div>

              {/* Metadados */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                <div>
                  <p className="font-semibold text-gray-700">Tipo</p>
                  <p className="capitalize">{lead.tipo?.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Origem</p>
                  <p className="capitalize">{lead.origem?.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">Criado em</p>
                  <p>{format(new Date(lead.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</p>
                </div>
                {lead.ultimo_contato && (
                  <div>
                    <p className="font-semibold text-gray-700">Último contato</p>
                    <p>{format(new Date(lead.ultimo_contato), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Erro ao carregar detalhes do lead
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-200">
          <div className="text-sm text-gray-600">
            {lead && (
              <span className="flex items-center gap-1">
                <Clock size={14} />
                Atualizado {lead.updated_at ? format(new Date(lead.updated_at), 'dd/MM/yyyy HH:mm', { locale: ptBR }) : 'nunca'}
              </span>
            )}
          </div>
          <div className="flex gap-3">
            {editMode ? (
              <>
                <button
                  onClick={() => {
                    setEditMode(false);
                    // Reset para valores originais
                    if (lead) {
                      setEditedStatus(lead.status || 'novo');
                      setEditedNotas(lead.notas || '');
                      setEditedValor(lead.valor_estimado?.toString() || '');
                      setEditedProbabilidade(lead.probabilidade_fechamento?.toString() || '');
                    }
                  }}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow disabled:opacity-50"
                >
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Fechar
                </button>
                <button
                  onClick={async () => {
                    if (!lead) return;

                    // Validações
                    if (lead.status === 'perdido') {
                      alert('❌ Não é possível gerar orçamento para um lead perdido.');
                      return;
                    }

                    if (lead.status === 'ganho') {
                      alert('✅ Este lead já foi convertido em cliente!\n\nCrie um novo orçamento diretamente na área de clientes.');
                      return;
                    }

                    if (!confirm(`Gerar orçamento para ${lead.nome}?\n\nIsso criará um orçamento em rascunho e mudará o status do lead para "Proposta Enviada".`)) {
                      return;
                    }

                    setGerandoOrcamento(true);
                    try {
                      const response = await fetch(`/api/admin/leads/${leadId}/criar-orcamento`, {
                        method: 'POST',
                      });

                      const data = await response.json();

                      if (!response.ok) {
                        throw new Error(data.error || 'Erro ao criar orçamento');
                      }

                      alert(`✅ Orçamento ${data.numero_orcamento} criado com sucesso!\n\nRedirecionando para edição...`);

                      // Redirecionar para página de orçamentos
                      router.push(`/admin/orcamentos?highlight=${data.orcamento_id}`);
                      onClose();
                    } catch (error: any) {
                      console.error('Erro ao gerar orçamento:', error);
                      alert('❌ ' + error.message);
                    } finally {
                      setGerandoOrcamento(false);
                    }
                  }}
                  disabled={gerandoOrcamento}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow disabled:opacity-50 flex items-center gap-2"
                >
                  <FileText size={18} />
                  {gerandoOrcamento ? 'Gerando...' : 'Gerar Orçamento'}
                </button>
                <button
                  onClick={() => setEditMode(true)}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
                >
                  ✏️ Editar Lead
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
