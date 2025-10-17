import { createServerClient } from '@/utils/supabase/server';
import { Database } from '@/types/supabase'; // Assumindo este import
import { notFound } from 'next/navigation';
import PedidoDetalhesCard from '@/components/admin/pedidos/PedidoDetalhesCard'; 
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Corrigindo a possível falta de import

// Tipagem completa para o Pedido e seus relacionamentos, incluindo Cobranças
export type PedidoComRelacionamentos = Database['public']['Tables']['pedidos']['Row'] & {
  pedido_itens: Database['public']['Tables']['pedido_itens']['Row'][];
  clientes: Database['public']['Tables']['clientes']['Row'] | null; 
  cobrancas: Database['public']['Tables']['cobrancas']['Row'][]; // NOVO: Adicionado Cobranças
};

interface PedidoDetalhesPageProps {
  params: {
    id: string;
  };
}

/**
 * Função para buscar um Pedido com seus itens, dados do cliente E COBRANÇAS.
 */
async function fetchPedidoDetalhes(id: string): Promise<PedidoComRelacionamentos | null> {
  const supabase = createServerClient();

  const { data: pedido, error } = await supabase
    .from('pedidos')
    .select(
      `
        *,
        pedido_itens(*),
        clientes(*),
        cobrancas(*) // NOVO: Buscando cobranças relacionadas
      `
    )
    .eq('id', id)
    .single();

  if (error || !pedido) {
    console.error('Erro ao buscar detalhes do pedido:', error);
    return null;
  }

  // O Supabase retorna um array vazio se não houverem itens/cobranças, o que é seguro.
  return pedido as PedidoComRelacionamentos; 
}

export default async function PedidoDetalhesPage({ params }: PedidoDetalhesPageProps) {
  const pedido = await fetchPedidoDetalhes(params.id);

  if (!pedido) {
    return notFound(); 
  }

  return (
    <main className="flex-1 space-y-8 p-6 md:p-10">
      <header className="border-b pb-4 mb-6">
        <Link href="/admin/pedidos">
            <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar à Lista
            </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">
          Detalhes do Pedido #{pedido.id.slice(0, 8)}...
        </h1>
      </header>
      
      {/* Componente de apresentação de detalhes, agora com cobranças */}
      <PedidoDetalhesCard pedido={pedido} />

    </main>
  );
}