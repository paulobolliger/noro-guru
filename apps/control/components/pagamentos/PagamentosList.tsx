// components/admin/pagamentos/PagamentosList.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { currencyFormat } from '@/utils/currency-format';
import { PedidoParaPagamento } from "@/app/(protected)/pagamentos/page";
import { Badge } from "@ui/badge";
import { Button } from "@ui/button";
import { CreditCard, Eye } from 'lucide-react';

interface PagamentosListProps {
  pedidos: PedidoParaPagamento[];
}

// Mapeamento de status para cores de Badge (adaptado para a lista de pagamentos)
const statusMap: Record<string, string> = {
  'AGUARDANDO_PAGAMENTO': 'bg-red-100 text-red-800 font-bold',
  'EM_PROCESSAMENTO': 'bg-yellow-100 text-yellow-800',
  'CONCLUIDO': 'bg-green-100 text-green-800',
};

/**
 * Componente de lista de pedidos para a tela de Pagamentos.
 */
export function PagamentosList({ pedidos }: PagamentosListProps) {
  if (pedidos.length === 0) {
    return (
      <div className="p-10 text-center text-gray-500">
        <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium">Parabéns! Nenhuma cobrança pendente.</p>
        <p>Todos os pedidos foram pagos ou estão em processamento inicial.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pedido ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Valor a Receber</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data do Pedido</th>
            <th className="px-6 py-3">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {pedidos.map((pedido) => (
            <tr key={pedido.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                <Link href={`/admin/pedidos/${pedido.id}`} className="hover:underline">
                  {pedido.id.slice(0, 8)}...
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {pedido.clientes?.nome || `ID: ${pedido.cliente_id.slice(0, 8)}...`}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-green-600">
                {currencyFormat(pedido.valor_total || 0)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <Badge className={statusMap[pedido.status] || 'bg-gray-100 text-gray-800'}>
                  {pedido.status.replace('_', ' ')}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(pedido.created_at), 'dd/MM/yyyy')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link href={`/admin/pedidos/${pedido.id}`}>
                    <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Pedido
                    </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}