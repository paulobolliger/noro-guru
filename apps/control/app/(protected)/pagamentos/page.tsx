import { createDatabaseClient } from '@noro/db';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react'; 
import { PagamentosList } from "@/components/pagamentos/PagamentosList"; // Novo componente de lista
import type { PedidoComRelacionamentos } from "@noro/types/admin";

// Tipo de Pedido simplificado para esta listagem
export type PedidoParaPagamento = any;

/**
 * Função de busca de Pedidos elegíveis para processamento de Pagamento.
 * @returns Array de pedidos com status AGUARDANDO_PAGAMENTO.
 */
async function fetchPedidosParaPagamento(): Promise<PedidoParaPagamento[]> {
  const { client, close } = createDatabaseClient();
  try {
    const statusesAguardandoCobranca = ['AGUARDANDO_PAGAMENTO', 'EM_PROCESSAMENTO'];

    const rows = await client`
      SELECT 
        o.id,
        o.valor_total,
        o.status,
        o.created_at,
        o.cliente_id,
        c.nome as cliente_nome,
        c.email as cliente_email
      FROM sales.orders o
      LEFT JOIN crm.clients c ON c.id = o.cliente_id
      WHERE o.status = ANY(${statusesAguardandoCobranca})
      ORDER BY o.created_at DESC
    `;

    return rows.map((r: any) => ({
      id: r.id,
      valor_total: r.valor_total,
      status: r.status,
      created_at: r.created_at,
      cliente_id: r.cliente_id,
      clientes: r.cliente_id ? {
        nome_completo: r.cliente_nome || 'Cliente Desconhecido',
        email: r.cliente_email
      } : null
    }));
  } catch (error) {
    console.error('Erro ao buscar pedidos para Pagamento:', error);
    return []; 
  } finally {
    await close();
  }
}

export default async function PagamentosPage() {
  const pedidos = await fetchPedidosParaPagamento();

  return (
    <main className="flex-1 space-y-8 p-6 md:p-10">
      <header className="flex items-center justify-between border-b border-default border-default border-default pb-4 mb-6">
        <h1 className="text-3xl font-bold text-primary">Processamento de Pagamentos</h1>
        {/* Botão para Ações futuras: Nova Cobrança Manual, Gerar Relatório, etc. */}
      </header>
      
      <section className="surface-card p-6 rounded-xl border border-default shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-primary">Pedidos Aguardando Ação Financeira</h2>
        
        <Suspense fallback={<div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>}>
          <PagamentosList pedidos={pedidos} />
        </Suspense>
      </section>
    </main>
  );
}
