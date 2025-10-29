'use client';

import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { currencyFormat } from '@/utils/currency-format';
import { Pedido } from "@/app/(protected)/pedidos/page";
import { NBadge, NButton } from "@/components/ui";

interface PedidosListProps {
  pedidos: Pedido[];
}

// Mapeamento de status para cores de Badge (Tailwind CSS)
const statusMap: Record<string, string> = {
  'EM_PROCESSAMENTO': 'bg-yellow-100 text-yellow-800',
  'AGUARDANDO_PAGAMENTO': 'bg-red-100 text-red-800 font-bold',
  'CONCLUIDO': 'bg-green-100 text-green-800',
  'CANCELADO': 'bg-red-100 text-red-800',
};

/**
 * Componente de lista de pedidos.
 */
export function PedidosList({ pedidos }: PedidosListProps) {
  if (pedidos.length === 0) {
    return (
      <div className="p-10 text-center text-muted">
        <p className="text-lg font-medium">Nenhum pedido encontrado.</p>
        <p>Pedidos convertidos de orçamentos aparecerão aqui.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-white/5">
        <thead className="bg-white/5">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Cliente</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Valor Total</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Data</th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody className="surface-card divide-y divide-white/5">
          {pedidos.map((pedido) => (
            <tr key={pedido.id} className="hover:bg-white/5 transition duration-150 ease-in-out">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                <Link href={`/admin/pedidos/${pedido.id}`} className="hover:underline">
                  {pedido.id.slice(0, 8)}...
                </Link>
              </td>
              {/* O nome do cliente viria de um JOIN, mas por enquanto, usamos o ID */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                Cliente ID: {pedido.cliente_id.slice(0, 8)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                {currencyFormat(pedido.valor_total || 0)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <NBadge variant={pedido.status === 'CONCLUIDO' ? 'success' : pedido.status === 'AGUARDANDO_PAGAMENTO' ? 'warning' : pedido.status === 'CANCELADO' ? 'error' : 'info'}>
                  {pedido.status.replace(/_/g, ' ')}
                </NBadge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                {format(new Date(pedido.created_at), 'dd/MM/yyyy')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link href={`/admin/pedidos/${pedido.id}`}>
                  <NButton variant="tertiary" size="sm">Ver Detalhes</NButton>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
