'use client';

import { useState } from 'react';
import { Clock, MessageSquare, Mail, Phone, FileText, Package, DollarSign, Plus, Save, X } from 'lucide-react';

interface TimelineEvent {
  id: string;
  tipo: 'email' | 'whatsapp' | 'ligacao' | 'nota' | 'orcamento' | 'pedido' | 'pagamento';
  titulo: string;
  descricao?: string;
  data: string;
  usuario?: string;
}

interface TimelineTabProps {
  clienteId: string;
}

export default function TimelineTab({ clienteId }: TimelineTabProps) {
  const [showAddNota, setShowAddNota] = useState(false);
  const [novaNota, setNovaNota] = useState('');
  const [filtro, setFiltro] = useState<string>('todos');

  // TODO: Implementar busca real no banco quando módulo de interações estiver pronto
  const eventos: TimelineEvent[] = [
    {
      id: '1',
      tipo: 'orcamento',
      titulo: 'Orçamento enviado',
      descricao: 'Orçamento ORC-2025-001 para Paris enviado por email',
      data: '2025-01-15T10:30:00',
      usuario: 'João Silva',
    },
    {
      id: '2',
      tipo: 'whatsapp',
      titulo: 'Mensagem WhatsApp',
      descricao: 'Cliente perguntou sobre opções de hotel',
      data: '2025-01-16T14:20:00',
      usuario: 'Maria Santos',
    },
    {
      id: '3',
      tipo: 'email',
      titulo: 'Email recebido',
      descricao: 'Cliente aprovou o orçamento',
      data: '2025-01-18T09:15:00',
    },
    {
      id: '4',
      tipo: 'pedido',
      titulo: 'Pedido criado',
      descricao: 'Pedido PED-2025-001 confirmado',
      data: '2025-01-20T11:00:00',
      usuario: 'João Silva',
    },
    {
      id: '5',
      tipo: 'pagamento',
      titulo: 'Pagamento recebido',
      descricao: 'Entrada de R$ 7.500,00 confirmada',
      data: '2025-01-22T15:45:00',
      usuario: 'Financeiro',
    },
    {
      id: '6',
      tipo: 'nota',
      titulo: 'Nota interna',
      descricao: 'Cliente muito satisfeito com o atendimento. Pediu desconto de 5% para próxima viagem.',
      data: '2025-01-25T16:30:00',
      usuario: 'Maria Santos',
    },
    {
      id: '7',
      tipo: 'ligacao',
      titulo: 'Ligação telefônica',
      descricao: 'Follow-up sobre documentação necessária',
      data: '2025-02-01T10:00:00',
      usuario: 'João Silva',
    },
  ];

  function getIconAndColor(tipo: string) {
    const configs: Record<string, { icon: any; color: string; bgColor: string }> = {
      email: { icon: Mail, color: 'text-blue-600', bgColor: 'bg-blue-100' },
      whatsapp: { icon: MessageSquare, color: 'text-green-600', bgColor: 'bg-green-100' },
      ligacao: { icon: Phone, color: 'text-purple-600', bgColor: 'bg-purple-100' },
      nota: { icon: FileText, color: 'text-gray-600', bgColor: 'bg-gray-100' },
      orcamento: { icon: FileText, color: 'text-orange-600', bgColor: 'bg-orange-100' },
      pedido: { icon: Package, color: 'text-green-600', bgColor: 'bg-green-100' },
      pagamento: { icon: DollarSign, color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
    };
    return configs[tipo] || configs.nota;
  }

  function formatarData(data: string) {
    const date = new Date(data);
    const hoje = new Date();
    const ontem = new Date(hoje);
    ontem.setDate(ontem.getDate() - 1);

    const dataStr = date.toLocaleDateString('pt-BR');
    const horaStr = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    if (date.toDateString() === hoje.toDateString()) {
      return `Hoje às ${horaStr}`;
    } else if (date.toDateString() === ontem.toDateString()) {
      return `Ontem às ${horaStr}`;
    } else {
      return `${dataStr} às ${horaStr}`;
    }
  }

  function handleAddNota() {
    if (!novaNota.trim()) {
      alert('Digite uma nota');
      return;
    }

    // TODO: Implementar salvamento real
    alert('Nota adicionada com sucesso!\n(Implementação do salvamento virá com módulo de Interações)');
    setNovaNota('');
    setShowAddNota(false);
  }

  const eventosFiltrados = filtro === 'todos' 
    ? eventos 
    : eventos.filter(e => e.tipo === filtro);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-purple-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Timeline</h2>
              <p className="text-sm text-gray-600">
                Todas as interações e eventos do cliente
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddNota(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
          >
            <Plus className="w-4 h-4" />
            Adicionar Nota
          </button>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFiltro('todos')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filtro === 'todos'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFiltro('email')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filtro === 'email'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Email
          </button>
          <button
            onClick={() => setFiltro('whatsapp')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filtro === 'whatsapp'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            WhatsApp
          </button>
          <button
            onClick={() => setFiltro('ligacao')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filtro === 'ligacao'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Ligações
          </button>
          <button
            onClick={() => setFiltro('nota')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filtro === 'nota'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Notas
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Timeline */}
        <div className="relative">
          {/* Linha vertical */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

          {/* Eventos */}
          <div className="space-y-6">
            {eventosFiltrados.map((evento, index) => {
              const config = getIconAndColor(evento.tipo);
              const Icon = config.icon;

              return (
                <div key={evento.id} className="relative pl-14">
                  {/* Ícone */}
                  <div className={`absolute left-0 w-12 h-12 ${config.bgColor} rounded-full flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${config.color}`} />
                  </div>

                  {/* Conteúdo */}
                  <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{evento.titulo}</h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                        {formatarData(evento.data)}
                      </span>
                    </div>

                    {evento.descricao && (
                      <p className="text-sm text-gray-700 mb-2">{evento.descricao}</p>
                    )}

                    {evento.usuario && (
                      <p className="text-xs text-gray-500">
                        por <span className="font-medium">{evento.usuario}</span>
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Fim da timeline */}
          {eventosFiltrados.length > 0 && (
            <div className="relative pl-14 mt-6">
              <div className="absolute left-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-gray-400 rounded-full" />
              </div>
              <p className="text-sm text-gray-500 italic">Início do relacionamento</p>
            </div>
          )}

          {/* Vazio */}
          {eventosFiltrados.length === 0 && (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum evento encontrado</p>
              <p className="text-sm text-gray-400 mt-1">
                {filtro === 'todos' 
                  ? 'Ainda não há histórico para este cliente'
                  : `Nenhum evento do tipo "${filtro}" encontrado`
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Adicionar Nota */}
      {showAddNota && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-lg">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Adicionar Nota</h3>
                <button onClick={() => {
                  setShowAddNota(false);
                  setNovaNota('');
                }}>
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <label className="block text-sm font-medium mb-2">Nota</label>
              <textarea
                value={novaNota}
                onChange={(e) => setNovaNota(e.target.value)}
                rows={5}
                placeholder="Digite sua nota aqui..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-2">
                Esta nota será visível apenas para a equipe interna.
              </p>
            </div>

            <div className="p-6 border-t flex gap-3">
              <button
                onClick={() => {
                  setShowAddNota(false);
                  setNovaNota('');
                }}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddNota}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Salvar Nota
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nota de desenvolvimento */}
      <div className="mx-6 mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <p className="text-sm text-purple-900">
          <strong>📝 Nota:</strong> Esta timeline está mostrando dados de exemplo. 
          Será integrada com o módulo de Interações (noro_interacoes) quando estiver pronto.
        </p>
      </div>
    </div>
  );
}