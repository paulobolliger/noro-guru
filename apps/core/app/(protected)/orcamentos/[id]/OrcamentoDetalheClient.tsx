'use client';

import { useState, useRef } from 'react';
import {
  uploadDocumentAction,
  deleteDocumentAction,
  addItineraryItemAction,
  deleteItineraryItemAction,
  sendAgentMessageAction,
  addEmergencyContactAction,
  deleteEmergencyContactAction,
} from './actions';

// ---------------------------------------------------------------------------
// Tipos locais (inferidos do servidor)
// ---------------------------------------------------------------------------

type Proposal = {
  id: string;
  numero: string;
  titulo: string;
  status: string;
  destinoPrincipal: string | null;
  dataViagemInicio: string | null;
  dataViagemFim: string | null;
  numPax: number | null;
  totalCents: number | null;
  descricao: string | null;
  items: Array<{ id: string; nome: string; precoVendaCents: number; categoria: string | null }>;
};

type Document = {
  id: string;
  name: string;
  tipo: string;
  fileUrl: string;
  mimeType: string | null;
  sizeBytes: number | null;
  visibleToClient: boolean;
  createdAt: Date;
};

type ItineraryItem = {
  id: string;
  data: string | null;
  horaInicio: string | null;
  horaFim: string | null;
  tipo: string;
  local: string | null;
  titulo: string;
  descricao: string | null;
  endereco: string | null;
};

type Message = {
  id: string;
  senderType: string;
  content: string;
  createdAt: Date;
  readAt: Date | null;
};

type EmergencyContact = {
  id: string;
  tipo: string;
  nome: string;
  telefone: string | null;
  whatsapp: string | null;
  email: string | null;
  observacoes: string | null;
  ativo: boolean;
};

type Props = {
  proposal: Proposal;
  documents: Document[];
  itinerary: ItineraryItem[];
  messages: Message[];
  emergencyContacts: EmergencyContact[];
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatBRL(cents: number | null) {
  if (cents == null) return '—';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
}

function formatBytes(bytes: number | null) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const STATUS_COLOR: Record<string, string> = {
  rascunho: 'bg-gray-100 text-gray-600',
  enviada: 'bg-blue-100 text-blue-700',
  visualizada: 'bg-purple-100 text-purple-700',
  aceita: 'bg-green-100 text-green-700',
  recusada: 'bg-red-100 text-red-700',
  expirada: 'bg-orange-100 text-orange-700',
  cancelada: 'bg-gray-100 text-gray-500',
};

const TIPO_ICON: Record<string, string> = {
  transporte: '✈️',
  hospedagem: '🏨',
  passeio: '🗺️',
  refeicao: '🍽️',
  livre: '☀️',
  outro: '📌',
};

const DOC_TIPO_LABEL: Record<string, string> = {
  voucher: 'Voucher',
  bilhete: 'Bilhete',
  visto: 'Visto',
  seguro: 'Seguro',
  contrato: 'Contrato',
  recibo: 'Recibo',
  outro: 'Outro',
};

const EC_TIPO_LABEL: Record<string, string> = {
  agencia: 'Agência',
  seguradora: 'Seguradora',
  consulado: 'Consulado',
  hospital: 'Hospital',
  outro: 'Outro',
};

// ---------------------------------------------------------------------------
// Abas
// ---------------------------------------------------------------------------

const TABS = ['Detalhes', 'Documentos', 'Itinerário', 'Mensagens', 'Emergência'] as const;
type Tab = (typeof TABS)[number];

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export default function OrcamentoDetalheClient({
  proposal,
  documents,
  itinerary,
  messages,
  emergencyContacts,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('Detalhes');

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-sm text-gray-400">#{proposal.numero}</span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR[proposal.status] ?? 'bg-gray-100 text-gray-600'}`}>
            {proposal.status}
          </span>
        </div>
        <h1 className="text-xl font-bold text-gray-900">{proposal.titulo}</h1>
        {proposal.destinoPrincipal && (
          <p className="text-sm text-gray-500 mt-1">
            {proposal.destinoPrincipal}
            {proposal.dataViagemInicio ? ` · ${proposal.dataViagemInicio}` : ''}
            {proposal.dataViagemFim ? ` → ${proposal.dataViagemFim}` : ''}
            {proposal.numPax ? ` · ${proposal.numPax} pax` : ''}
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-t transition-colors ${
              activeTab === tab
                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
            {tab === 'Mensagens' && messages.some((m) => m.senderType === 'client' && !m.readAt) && (
              <span className="ml-1.5 inline-block w-2 h-2 rounded-full bg-red-500" />
            )}
          </button>
        ))}
      </div>

      {/* Conteúdo das abas */}
      {activeTab === 'Detalhes' && <DetalhesTab proposal={proposal} />}
      {activeTab === 'Documentos' && (
        <DocumentosTab proposalId={proposal.id} documents={documents} />
      )}
      {activeTab === 'Itinerário' && (
        <ItinerarioTab proposalId={proposal.id} itinerary={itinerary} />
      )}
      {activeTab === 'Mensagens' && (
        <MensagensTab proposalId={proposal.id} messages={messages} />
      )}
      {activeTab === 'Emergência' && (
        <EmergenciaTab proposalId={proposal.id} contacts={emergencyContacts} />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Aba Detalhes
// ---------------------------------------------------------------------------

function DetalhesTab({ proposal }: { proposal: Proposal }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Valor total</p>
          <p className="text-2xl font-bold text-gray-900">{formatBRL(proposal.totalCents)}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-1">Passageiros</p>
          <p className="text-2xl font-bold text-gray-900">{proposal.numPax ?? '—'}</p>
        </div>
      </div>

      {proposal.descricao && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Descrição</p>
          <p className="text-sm text-gray-700 whitespace-pre-line">{proposal.descricao}</p>
        </div>
      )}

      {proposal.items.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Itens</p>
          <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
            {proposal.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-800">{item.nome}</p>
                  {item.categoria && (
                    <p className="text-xs text-gray-400">{item.categoria}</p>
                  )}
                </div>
                <p className="text-sm font-semibold text-gray-700">{formatBRL(item.precoVendaCents)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Aba Documentos
// ---------------------------------------------------------------------------

function DocumentosTab({ proposalId, documents }: { proposalId: string; documents: Document[] }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setUploading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const result = await uploadDocumentAction(proposalId, formData);
    setUploading(false);
    if (result.success) {
      formRef.current?.reset();
    } else {
      setError(result.error ?? 'Erro desconhecido.');
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload form */}
      <div className="border border-dashed border-gray-300 rounded-xl p-5 bg-gray-50">
        <p className="text-sm font-semibold text-gray-700 mb-4">Adicionar documento</p>
        <form ref={formRef} onSubmit={handleUpload} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Arquivo</label>
              <input type="file" name="file" required className="w-full text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Nome</label>
              <input
                type="text"
                name="name"
                required
                placeholder="Nome do documento"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Tipo</label>
              <select name="tipo" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                {Object.entries(DOC_TIPO_LABEL).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 mt-5">
              <input type="checkbox" name="visibleToClient" value="true" id="visible" defaultChecked />
              <label htmlFor="visible" className="text-sm text-gray-600">Visível ao cliente</label>
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={uploading}
            className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {uploading ? 'Enviando…' : 'Fazer upload'}
          </button>
        </form>
      </div>

      {/* Lista de documentos */}
      {documents.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">Nenhum documento ainda.</p>
      ) : (
        <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="text-lg">📄</span>
                <div>
                  <p className="text-sm font-medium text-gray-800">{doc.name}</p>
                  <p className="text-xs text-gray-400">
                    {DOC_TIPO_LABEL[doc.tipo] ?? doc.tipo}
                    {doc.sizeBytes ? ` · ${formatBytes(doc.sizeBytes)}` : ''}
                    {!doc.visibleToClient && ' · 🔒 oculto ao cliente'}
                  </p>
                </div>
              </div>
              <button
                onClick={async () => {
                  if (confirm('Remover documento?')) {
                    await deleteDocumentAction(proposalId, doc.id);
                  }
                }}
                className="text-xs text-red-500 hover:text-red-700 font-medium"
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

// ---------------------------------------------------------------------------
// Aba Itinerário
// ---------------------------------------------------------------------------

function ItinerarioTab({
  proposalId,
  itinerary,
}: {
  proposalId: string;
  itinerary: ItineraryItem[];
}) {
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    const result = await addItineraryItemAction(proposalId, formData);
    setSaving(false);
    if (result.success) {
      setAdding(false);
      formRef.current?.reset();
    } else {
      setError(result.error ?? 'Erro.');
    }
  }

  // Agrupa por data
  const grouped = itinerary.reduce<Record<string, ItineraryItem[]>>((acc, item) => {
    const key = item.data ?? 'sem-data';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setAdding(!adding)}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          {adding ? 'Cancelar' : '+ Adicionar item'}
        </button>
      </div>

      {adding && (
        <form ref={formRef} onSubmit={handleAdd} className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Data</label>
              <input type="date" name="data" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Hora início</label>
              <input type="time" name="horaInicio" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Hora fim</label>
              <input type="time" name="horaFim" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Tipo</label>
              <select name="tipo" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
                <option value="transporte">✈️ Transporte</option>
                <option value="hospedagem">🏨 Hospedagem</option>
                <option value="passeio">🗺️ Passeio</option>
                <option value="refeicao">🍽️ Refeição</option>
                <option value="livre">☀️ Tempo livre</option>
                <option value="outro">📌 Outro</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Local</label>
              <input type="text" name="local" placeholder="Ex: Aeroporto GRU" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Título *</label>
            <input type="text" name="titulo" required placeholder="Ex: Embarque para Lisboa" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Descrição</label>
            <textarea name="descricao" rows={2} placeholder="Detalhes adicionais…" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Endereço (para mapa futuro)</label>
            <input type="text" name="endereco" placeholder="Rua, número, cidade" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? 'Salvando…' : 'Salvar item'}
          </button>
        </form>
      )}

      {Object.keys(grouped).length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">Nenhum item no itinerário ainda.</p>
      ) : (
        Object.entries(grouped).map(([date, items]) => (
          <div key={date}>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
              {date === 'sem-data' ? 'Sem data definida' : new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex items-start gap-3 border border-gray-100 rounded-xl p-3 bg-white">
                  <span className="text-lg mt-0.5">{TIPO_ICON[item.tipo] ?? '📌'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {item.horaInicio && (
                        <span className="text-xs font-mono text-gray-400">
                          {item.horaInicio}{item.horaFim ? `→${item.horaFim}` : ''}
                        </span>
                      )}
                      <p className="text-sm font-semibold text-gray-800">{item.titulo}</p>
                    </div>
                    {item.local && <p className="text-xs text-gray-400">{item.local}</p>}
                    {item.descricao && <p className="text-xs text-gray-600 mt-1">{item.descricao}</p>}
                    {item.endereco && <p className="text-xs text-gray-400 mt-0.5">📍 {item.endereco}</p>}
                  </div>
                  <button
                    onClick={async () => {
                      if (confirm('Remover item?')) {
                        await deleteItineraryItemAction(proposalId, item.id);
                      }
                    }}
                    className="text-xs text-red-400 hover:text-red-600 shrink-0"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Aba Mensagens
// ---------------------------------------------------------------------------

function MensagensTab({
  proposalId,
  messages,
}: {
  proposalId: string;
  messages: Message[];
}) {
  const [sending, setSending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    const formData = new FormData(e.currentTarget);
    await sendAgentMessageAction(proposalId, formData);
    setSending(false);
    formRef.current?.reset();
  }

  return (
    <div className="space-y-4">
      {messages.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">Nenhuma mensagem ainda.</p>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.senderType === 'agent' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl text-sm ${
                  msg.senderType === 'agent'
                    ? 'bg-indigo-600 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}
              >
                <p>{msg.content}</p>
                <p className={`text-xs mt-1 ${msg.senderType === 'agent' ? 'text-indigo-200' : 'text-gray-400'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  {msg.senderType === 'agent' && msg.readAt && ' · lida'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <form ref={formRef} onSubmit={handleSend} className="flex gap-2 pt-2 border-t border-gray-100">
        <input
          type="text"
          name="content"
          required
          placeholder="Responder ao cliente…"
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={sending}
          className="bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-indigo-700 disabled:opacity-50"
        >
          {sending ? '…' : 'Enviar'}
        </button>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Aba Emergência (por proposta)
// ---------------------------------------------------------------------------

function EmergenciaTab({
  proposalId,
  contacts,
}: {
  proposalId: string;
  contacts: EmergencyContact[];
}) {
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    const result = await addEmergencyContactAction(proposalId, formData);
    setSaving(false);
    if (result.success) {
      setAdding(false);
      formRef.current?.reset();
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500">
        Contatos específicos desta viagem. Os contatos globais da agência ficam em{' '}
        <a href="/configuracoes/emergencia" className="text-indigo-600 underline">Configurações → Emergência</a>.
      </p>

      <div className="flex justify-end">
        <button
          onClick={() => setAdding(!adding)}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          {adding ? 'Cancelar' : '+ Adicionar contato'}
        </button>
      </div>

      {adding && (
        <form ref={formRef} onSubmit={handleAdd} className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-3">
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
        <p className="text-sm text-gray-400 text-center py-6">Nenhum contato específico desta viagem.</p>
      ) : (
        <div className="space-y-2">
          {contacts.map((c) => (
            <div key={c.id} className="flex items-start justify-between border border-gray-100 rounded-xl p-3 bg-white">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-semibold text-gray-500 uppercase">{EC_TIPO_LABEL[c.tipo] ?? c.tipo}</span>
                  {!c.ativo && <span className="text-xs text-gray-400">(inativo)</span>}
                </div>
                <p className="text-sm font-semibold text-gray-800">{c.nome}</p>
                <div className="flex gap-3 mt-1 text-xs text-gray-500">
                  {c.telefone && <span>☎ {c.telefone}</span>}
                  {c.whatsapp && <span>💬 {c.whatsapp}</span>}
                  {c.email && <span>✉ {c.email}</span>}
                </div>
                {c.observacoes && <p className="text-xs text-gray-400 mt-1">{c.observacoes}</p>}
              </div>
              <button
                onClick={async () => {
                  if (confirm('Remover contato?')) {
                    await deleteEmergencyContactAction(proposalId, c.id);
                  }
                }}
                className="text-xs text-red-400 hover:text-red-600 shrink-0 ml-2"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
