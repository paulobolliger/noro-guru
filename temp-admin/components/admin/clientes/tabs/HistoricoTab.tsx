'use client';

import { useEffect, useState } from 'react';
import { FileText, Package, DollarSign, Calendar, Eye, ExternalLink } from 'lucide-react';
import { getClienteHistorico } from '@/app/admin/(protected)/clientes/[id]/historico-actions';
import { useRouter } from 'next/navigation';

interface HistoricoTabProps {
  clienteId: string;
}

export default function HistoricoTab({ clienteId }: HistoricoTabProps) {
  const router = useRouter();
  const [filtro, setFiltro] = useState<'todos' | 'orcamentos' | 'pedidos' | 'transacoes'>('todos');
  const [loading, setLoading] = useState(true);
  const [orcamentos, setOrcamentos] = useState<any[]>([]);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [transacoes, setTransacoes] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const result = await getClienteHistorico(clienteId);
      if (mounted && result.success) {
        setOrcamentos(result.data?.orcamentos || []);
        setPedidos(result.data?.pedidos || []);
        setTransacoes(result.data?.transacoes || []);
      }
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [clienteId]);

  function getStatusColor(status: string) {
    const cores: Record<string, string> = {
      aprovado: 'bg-green-100 text-green-800',
      enviado: 'bg-blue-100 text-blue-800',
      pendente: 'bg-yellow-100 text-yellow-800',
      rejeitado: 'bg-red-100 text-red-800',
      confirmado: 'bg-green-100 text-green-800',
      cancelado: 'bg-red-100 text-red-800',
      pago: 'bg-green-100 text-green-800',
      atrasado: 'bg-red-100 text-red-800',
      aguardando_pagamento: 'bg-yellow-100 text-yellow-800'
    };
    return cores[status] || 'bg-gray-100 text-gray-800';
  }

  function formatarValor(valor: number) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  }

  function formatarData(data: string) {
    return new Date(data).toLocaleDateString('pt-BR');
  }

  const mostrarOrcamentos = filtro === 'todos' || filtro === 'orcamentos';
  const mostrarPedidos = filtro === 'todos' || filtro === 'pedidos';
  const mostrarTransacoes = filtro === 'todos' || filtro === 'transacoes';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Histórico Completo</h2>
            <p className="text-sm text-gray-600">Orçamentos, pedidos e cobranças do cliente</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFiltro('todos')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filtro === 'todos'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFiltro('orcamentos')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filtro === 'orcamentos'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Orçamentos ({orcamentos.length})
          </button>
          <button
            onClick={() => setFiltro('pedidos')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filtro === 'pedidos'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pedidos ({pedidos.length})
          </button>
          <button
            onClick={() => setFiltro('transacoes')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filtro === 'transacoes'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Cobranças ({transacoes.length})
          </button>
        </div>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="text-gray-500">Carregando histórico...</div>
        ) : (
        <div className="space-y-6">

          {/* ORÇAMENTOS */}
          {mostrarOrcamentos && orcamentos.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Orçamentos</h3>
              </div>
              <div className="space-y-3">
                {orcamentos.map((orc) => (
                  <div
                    key={orc.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold text-gray-900">{orc.titulo || orc.id}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(orc.status)}`}>
                            {String(orc.status).toUpperCase()}
                          </span>
                        </div>

                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatarData(orc.created_at)}</span>
                          </div>
                          {typeof orc.valor_total === 'number' && (
                            <p className="text-lg font-semibold text-blue-600">
                              {formatarValor(orc.valor_total)}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push(`/admin/orcamentos/${orc.id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Visualizar"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <a
                          href={`/admin/orcamentos/${orc.id}`}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Abrir em nova aba"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PEDIDOS */}
          {mostrarPedidos && pedidos.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-gray-900">Pedidos</h3>
              </div>
              <div className="space-y-3">
                {pedidos.map((ped) => (
                  <div
                    key={ped.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold text-gray-900">{ped.id}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ped.status)}`}>
                            {String(ped.status).toUpperCase()}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatarData(ped.created_at)}</span>
                          </div>
                          {typeof ped.valor_total === 'number' && (
                            <p className="text-lg font-semibold text-green-600">
                              {formatarValor(ped.valor_total)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push(`/admin/pedidos/${ped.id}`)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Visualizar"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <a
                          href={`/admin/pedidos/${ped.id}`}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Abrir em nova aba"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* COBRANÇAS */}
          {mostrarTransacoes && transacoes.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <h3 className="font-semibold text-gray-900">Cobranças</h3>
              </div>
              <div className="space-y-3">
                {transacoes.map((t) => (
                  <div
                    key={t.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold text-gray-900">{t.id}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(t.status)}`}>
                            {String(t.status).toUpperCase()}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatarData(t.created_at)}</span>
                          </div>
                          {typeof t.valor === 'number' && (
                            <p className="text-lg font-semibold text-emerald-600">
                              {formatarValor(t.valor)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
        )}
      </div>
    </div>
  );
}
