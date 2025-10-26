import { createServerClient } from '@/utils/supabase/server';
import { Database } from "@types/supabase";
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react'; 
import { PagamentosList } from "@/components/pagamentos/PagamentosList"; // Novo componente de lista
import { PedidoComRelacionamentos } from "@/app/(protected)/pedidos/[id]/page"; // Reutilizando a tipagem

// Tipo de Pedido simplificado para esta listagem, mas usando o tipo completo para a busca
export type PedidoParaPagamento = Pick<PedidoComRelacionamentos, 
  'id' | 'valor_total' | 'status' | 'created_at' | 'cliente_id' | 'clientes'
>;

/**
 * Função de busca de Pedidos elegíveis para processamento de Pagamento.
 * @returns Array de pedidos com status AGUARDANDO_PAGAMENTO.
 */
async function fetchPedidosParaPagamento(): Promise<PedidoParaPagamento[]> {
  const supabase = createServerClient();
  
  // Status que indicam que o pedido está pronto para ser cobrado/faturado
  const statusesAguardandoCobranca = ['AGUARDANDO_PAGAMENTO', 'EM_PROCESSAMENTO'];

  const { data: pedidos, error } = await supabase
    .from('pedidos')
    .select(
      `
        id,
        valor_total,
        status,
        created_at,
        cliente_id,
        clientes(nome_completo, email) // Buscamos apenas nome e email do cliente
      `
    )
    .in('status', statusesAguardandoCobranca) // Filtra pelos status relevantes
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar pedidos para Pagamento:', error);
    return []; 
  }

  // O casting é necessário pois o Supabase Select com joins retorna o tipo base
  return (pedidos || []) as PedidoParaPagamento[];
}

export default async function PagamentosPage() {
  const pedidos = await fetchPedidosParaPagamento();

  return (
    <main className="flex-1 space-y-8 p-6 md:p-10">
      <header className="flex items-center justify-between border-b pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Processamento de Pagamentos</h1>
        {/* Botão para Ações futuras: Nova Cobrança Manual, Gerar Relatório, etc. */}
      </header>
      
      <section className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Pedidos Aguardando Ação Financeira</h2>
        
        <Suspense fallback={<div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>}>
          <PagamentosList pedidos={pedidos} />
        </Suspense>
      </section>
    </main>
  );
}