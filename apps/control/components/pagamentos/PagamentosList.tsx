// components/admin/pagamentos/PagamentosList.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { currencyFormat } from '@/utils/currency-format';
import { PedidoParaPagamento } from "@/app/(protected)/pagamentos/page";
import { Badge } from "@ui/badge";
import { cobrancaStatusText } from "@ui/status";
import { NButton } from "@/components/ui";
import { CreditCard, Eye } from 'lucide-react';

interface PagamentosListProps {
  pedidos: PedidoParaPagamento[];
}

// Mapeamento de status para cores de Badge (adaptado para a lista de pagamentos)
const statusMap: Record<string, string> = new Proxy({}, {
  get: (_t, key: string) => (cobrancaStatusText as any)[key] ? `border border-white/10 bg-white/5 ${(cobrancaStatusText as any)[key]}` : 'border border-white/10 bg-white/5 text-slate-300'
}) as any;

/**
 * Componente de lista de pedidos para a tela de Pagamentos.
 */
export function PagamentosList({ pedidos }: PagamentosListProps) {
  if (pedidos.length === 0) {
    return (
      <div className="p-10 text-center text-muted">
        <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium">Parabéns! Nenhuma cobrança pendente.</p>
        <p>Todos os pedidos foram pagos ou estão em processamento inicial.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-white/5">
        <thead className="bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent border-b border-default border-white/10 backdrop-blur supports-[backdrop-filter]:bg-black/20">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Pedido ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Cliente</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-muted uppercase tracking-wider">Valor a Receber</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Data do Pedido</th>
            <th className="px-6 py-3">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-[#0B1220] divide-y divide-white/5">
          {pedidos.map((pedido) => (
            <tr key={pedido.id} className="hover:bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent border-b border-default border-white/10 backdrop-blur supports-[backdrop-filter]:bg-black/20 transition duration-150 ease-in-out">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                <Link href={`/admin/pedidos/${pedido.id}`} className="hover:underline">
                  {pedido.id.slice(0, 8)}...
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-primary">
                {pedido.clientes?.nome || `ID: ${pedido.cliente_id.slice(0, 8)}...`}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-emerald-400">
                {currencyFormat(pedido.valor_total || 0)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <Badge className={statusMap[pedido.status] || 'bg-white/10 text-gray-800'}>
                  {pedido.status.replace('_', ' ')}
                </Badge>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                {format(new Date(pedido.created_at), 'dd/MM/yyyy')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link href={`/admin/pedidos/${pedido.id}`}>
                    <NButton variant="secondary" size="sm" leftIcon={<Eye className="h-4 w-4" />}>Ver Pedido</NButton>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
