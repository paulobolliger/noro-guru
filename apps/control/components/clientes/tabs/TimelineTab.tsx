'use client';

import { useEffect, useState } from 'react';
import { Clock, MessageSquare, Mail, Phone, FileText, Package, DollarSign, Plus, Save, X } from 'lucide-react';
import { getClienteTimeline } from "@/app/(protected)/clientes/[id]/historico-actions";
import { useRouter } from 'next/navigation';

interface TimelineEvent {
  id: string;
  tipo: 'email' | 'whatsapp' | 'ligacao' | 'nota' | 'orcamento' | 'pedido' | 'pagamento';
  titulo: string;
  descricao?: string;
  data: string;
  usuario?: string;
  pedidoId?: string;
}

interface TimelineTabProps {
  clienteId: string;
}

export default function TimelineTab({ clienteId }: TimelineTabProps) {
  const router = useRouter();
  const [showAddNota, setShowAddNota] = useState(false);
  const [novaNota, setNovaNota] = useState('');
  const [filtro, setFiltro] = useState<string>('todos');
  const [loading, setLoading] = useState(true);
  const [eventos, setEventos] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const result = await getClienteTimeline(clienteId);
      if (mounted && result.success) {
        setEventos(result.data || []);
      }
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [clienteId]);

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

  function formatarDataAmigavel(data: string) {
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
    // TODO: Implementar salvamento real de notas em noro_interacoes
    alert('Nota adicionada (mock). Integração real virá com noro_interacoes.');
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
              <p className="text-sm text-gray-600">Todas as interações e eventos do cliente</p>
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
          <button onClick={() => setFiltro('email')} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${filtro==='email'?'bg-blue-600 text-white':'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Email</button>
          <button onClick={() => setFiltro('whatsapp')} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${filtro==='whatsapp'?'bg-blue-600 text-white':'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>WhatsApp</button>
          <button onClick={() => setFiltro('ligacao')} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${filtro==='ligacao'?'bg-blue-600 text-white':'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Ligações</button>
          <button onClick={() => setFiltro('nota')} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${filtro==='nota'?'bg-blue-600 text-white':'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Notas</button>
          <button onClick={() => setFiltro('orcamento')} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${filtro==='orcamento'?'bg-blue-600 text-white':'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Orçamentos</button>
          <button onClick={() => setFiltro('pedido')} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${filtro==='pedido'?'bg-blue-600 text-white':'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Pedidos</button>
          <button onClick={() => setFiltro('pagamento')} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${filtro==='pagamento'?'bg-blue-600 text-white':'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Pagamentos</button>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="text-gray-500">Carregando timeline...</div>
        ) : (
        <div className="space-y-6">
          {eventosFiltrados.map((ev) => {
            const Conf = getIconAndColor(ev.tipo);
            const Icon = Conf.icon;
            const link = (() => {
              if (ev.tipo === 'orcamento' && ev.id.startsWith('orc-')) return `/admin/orcamentos/${ev.id.slice(4)}`;
              if (ev.tipo === 'pedido' && ev.id.startsWith('ped-')) return `/admin/pedidos/${ev.id.slice(4)}`;
              if (ev.tipo === 'pagamento' && ev.pedidoId) return `/admin/pedidos/${ev.pedidoId}`;
              return null;
            })();
            return (
              <div key={ev.id} className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${Conf.bgColor}`}>
                  <Icon className={`w-5 h-5 ${Conf.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900">{ev.titulo}</h4>
                    <span className="text-xs text-gray-500">{formatarDataAmigavel(ev.data)}</span>
                  </div>
                  {ev.descricao && (
                    <p className="text-gray-700 text-sm mt-1">{ev.descricao}</p>
                  )}
                  {link && (
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => router.push(link)}
                        className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                        title="Abrir detalhes"
                      >
                        Abrir
                      </button>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 text-sm rounded-lg bg-white border hover:bg-gray-50 text-gray-700"
                        title="Abrir em nova aba"
                      >
                        Nova aba
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>

      {/* Modal de Nova Nota (mock) */}
      {showAddNota && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">Adicionar Nota</h3>
              <button onClick={() => setShowAddNota(false)}><X className="w-5 h-5"/></button>
            </div>
            <div className="p-4 space-y-3">
              <textarea value={novaNota} onChange={(e)=>setNovaNota(e.target.value)} className="w-full border rounded-lg p-2" rows={5} placeholder="Escreva uma anotação..."/>
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <button onClick={() => setShowAddNota(false)} className="px-4 py-2 border rounded-lg">Cancelar</button>
              <button onClick={handleAddNota} className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"><Save className="w-4 h-4"/>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
