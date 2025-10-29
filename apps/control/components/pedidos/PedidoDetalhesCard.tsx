// components/admin/pedidos/PedidoDetalhesCard.tsx
'use client'; 

import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { currencyFormat } from '@/utils/currency-format';
import { PedidoComRelacionamentos } from "@/app/(protected)/pedidos/[id]/page";
import { Badge } from "@ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { NButton } from '@/components/ui';
import PedidoItemManager from './PedidoItemManager';
import EmitirCobrancaForm from "@/components/pagamentos/EmitirCobrancaForm";
import PedidoCobrancasList from "@/components/pedidos/PedidoCobrancasList";
import { AlertTriangle } from 'lucide-react';

interface PedidoDetalhesCardProps {
  pedido: PedidoComRelacionamentos;
}

const statusMap: Record<string, string> = {
  'EM_PROCESSAMENTO': 'bg-yellow-100 text-yellow-800',
  'AGUARDANDO_PAGAMENTO': 'bg-red-100 text-red-800 font-bold',
  'CONCLUIDO': 'bg-green-100 text-green-800',
  'CANCELADO': 'bg-white/10 text-gray-800',
  'CONVERTIDO': 'bg-indigo-100 text-indigo-800',
};

export default function PedidoDetalhesCard({ pedido }: PedidoDetalhesCardProps) {
  const cliente = pedido.clientes;
  
  // Condição para exibir o formulário de emissão de cobrança
  const showCobrancaForm = pedido.status !== 'CONCLUIDO' && pedido.status !== 'CANCELADO';
    
  // Verifica se o pedido já está pago/cancelado para desabilitar a edição de itens
  const isFinalizado = pedido.status === 'CONCLUIDO' || pedido.status === 'CANCELADO';
  
  return (
    <div className="space-y-6">
      {/* Detalhes Principais e Cliente */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Detalhes do Pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-sm font-medium text-muted">ID:</div>
              <div className="text-sm font-semibold">{pedido.id}</div>

              <div className="text-sm font-medium text-muted">Valor Total:</div>
              <div className="text-xl font-bold text-green-600">
                {currencyFormat(pedido.valor_total || 0)}
              </div>
              
              <div className="text-sm font-medium text-muted">Status:</div>
              <Badge className={statusMap[pedido.status] || 'bg-white/10 text-gray-800'}>
                  {pedido.status.replace(/_/g, ' ')}
              </Badge>
              
              <div className="text-sm font-medium text-muted">Ações:</div>
              <Link href={`/admin/pedidos/${pedido.id}/editar`}>
                  <NButton variant="secondary" size="sm" disabled={isFinalizado}>
                      Editar Dados Principais
                  </NButton>
              </Link>
              
              {pedido.orcamento_id && (
                  <>
                      <div className="text-sm font-medium text-muted">Vindo do Orçamento:</div>
                      <Link href={`/admin/orcamentos/${pedido.orcamento_id}`} className="text-sm text-indigo-600 hover:underline">
                          #{pedido.orcamento_id.slice(0, 8)}...
                      </Link>
                  </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Informações do Cliente */}
        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {cliente ? (
              <>
                <p className="font-semibold">{cliente.nome || 'Cliente sem nome'}</p>
                <p className="text-sm text-muted">{cliente.email}</p>
                <p className="text-sm text-muted">{cliente.telefone}</p>
              </>
            ) : (
              <p className="text-sm text-red-500">Cliente não encontrado ou ID inválido.</p>
            )}
            <Link href={`/admin/clientes/${pedido.cliente_id}`} className="block mt-4 text-sm text-indigo-600 hover:underline">
                Ver Perfil
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* ================================================================
        Seção de Faturamento (Cobranças)
        ================================================================
      */}
      {showCobrancaForm ? (
          <EmitirCobrancaForm 
            pedidoId={pedido.id} 
            valorTotal={pedido.valor_total || 0} 
            cobrancasExistentes={pedido.cobrancas || []}
          />
      ) : (
        <div className="p-4 bg-white/10 text-center text-muted rounded-lg">
          O faturamento está desabilitado para pedidos com status {pedido.status.replace(/_/g, ' ')}.
        </div>
      )}
      
      {/* Histórico de Cobranças */}
      <PedidoCobrancasList cobrancas={pedido.cobrancas || []} />

      {/* ================================================================
        Gerenciamento de Itens (Desabilitado se finalizado)
        ================================================================
      */}
      <div className={isFinalizado ? 'opacity-60 pointer-events-none' : ''}>
          <PedidoItemManager 
            initialItems={pedido.pedido_itens || []} 
            pedidoId={pedido.id} 
          />
          {isFinalizado && (
            <div className="p-4 bg-white/10 text-center text-muted rounded-lg mt-4">
                A edição de itens está desabilitada para pedidos finalizados ou cancelados.
            </div>
          )}
      </div>
      
    </div>
  );
}
