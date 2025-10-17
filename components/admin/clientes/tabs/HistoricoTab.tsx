'use client';

import { useState } from 'react';
import { FileText, Package, DollarSign, Calendar, Eye, ExternalLink } from 'lucide-react';

interface HistoricoTabProps {
  clienteId: string;
}

export default function HistoricoTab({ clienteId }: HistoricoTabProps) {
  const [filtro, setFiltro] = useState<'todos' | 'orcamentos' | 'pedidos' | 'transacoes'>('todos');

  // TODO: Implementar busca real no banco quando módulos de orçamentos/pedidos estiverem prontos
  const orcamentos = [
    {
      id: '1',
      numero: 'ORC-2025-001',
      data: '2025-01-15',
      destino: 'Paris, França',
      valor: 15000,
      status: 'aprovado',
    },
    {
      id: '2',
      numero: 'ORC-2025-002',
      data: '2025-02-10',
      destino: 'Roma, Itália',
      valor: 12000,
      status: 'enviado',
    },
  ];

  const pedidos = [
    {
      id: '1',
      numero: 'PED-2025-001',
      data: '2025-01-20',
      destino: 'Paris, França',
      valor: 15000,
      status: 'confirmado',
    },
  ];

  const transacoes = [
    {
      id: '1',
      data: '2025-01-22',
      descricao: 'Pagamento entrada - Paris',
      tipo: 'recebimento',
      valor: 7500,
      status: 'pago',
    },
    {
      id: '2',
      data: '2025-02-22',
      descricao: 'Saldo final - Paris',
      tipo: 'recebimento',
      valor: 7500,
      status: 'pendente',
    },
  ];

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
            <p className="text-sm text-gray-600">
              Orçamentos, pedidos e transações do cliente
            </p>
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
            Transações ({transacoes.length})
          </button>
        </div>
      </div>

      <div className="p-6">
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
                          <span className="font-semibold text-gray-900">{orc.numero}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(orc.status)}`}>
                            {orc.status.toUpperCase()}
                          </span>
                        </div>

                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatarData(orc.data)}</span>
                          </div>
                          <p className="font-medium text-gray-900">{orc.destino}</p>
                          <p className="text-lg font-semibold text-blue-600">
                            {formatarValor(orc.valor)}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => alert('Visualizar orçamento (em breve)')}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Visualizar"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => alert('Abrir orçamento (em breve)')}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Abrir"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
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
                <h3 className="font-semibold text-gray-900">Pedidos / Reservas</h3>
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
                          <span className="font-semibold text-gray-900">{ped.numero}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ped.status)}`}>
                            {ped.status.toUpperCase()}
                          </span>
                        </div>

                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatarData(ped.data)}</span>
                          </div>
                          <p className="font-medium text-gray-900">{ped.destino}</p>
                          <p className="text-lg font-semibold text-green-600">
                            {formatarValor(ped.valor)}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => alert('Visualizar pedido (em breve)')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Visualizar"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => alert('Abrir pedido (em breve)')}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Abrir"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TRANSAÇÕES */}
          {mostrarTransacoes && transacoes.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Transações Financeiras</h3>
              </div>
              <div className="space-y-3">
                {transacoes.map((trans) => (
                  <div
                    key={trans.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trans.status)}`}>
                            {trans.status.toUpperCase()}
                          </span>
                        </div>

                        <div className="space-y-1 text-sm">
                          <p className="font-medium text-gray-900">{trans.descricao}</p>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{formatarData(trans.data)}</span>
                          </div>
                          <p className={`text-lg font-semibold ${
                            trans.tipo === 'recebimento' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {trans.tipo === 'recebimento' ? '+' : '-'} {formatarValor(trans.valor)}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => alert('Ver detalhes (em breve)')}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Visualizar"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vazio */}
          {((mostrarOrcamentos && orcamentos.length === 0) ||
            (mostrarPedidos && pedidos.length === 0) ||
            (mostrarTransacoes && transacoes.length === 0)) && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum registro encontrado</p>
              <p className="text-sm text-gray-400 mt-1">
                {filtro === 'orcamentos' && 'Crie um orçamento para aparecer aqui'}
                {filtro === 'pedidos' && 'Converta um orçamento em pedido'}
                {filtro === 'transacoes' && 'Registre transações financeiras'}
                {filtro === 'todos' && 'Ainda não há histórico para este cliente'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Nota de desenvolvimento */}
      <div className="mx-6 mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <strong>📝 Nota:</strong> Esta aba está mostrando dados de exemplo. 
          Será integrada com os módulos de Orçamentos e Pedidos quando estiverem prontos.
        </p>
      </div>
    </div>
  );
}