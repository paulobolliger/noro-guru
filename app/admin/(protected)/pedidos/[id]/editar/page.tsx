import { createServerClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import { Database } from '@/types/supabase';
import { PedidoComRelacionamentos } from '@/app/admin/(protected)/pedidos/[id]/page'; // Reutilizando a tipagem
import EditPedidoForm from '@/components/admin/pedidos/EditPedidoForm';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface PedidoEditarPageProps {
  params: {
    id: string;
  };
}

/**
 * Função para buscar um Pedido com seus itens e dados do cliente.
 * É a mesma função usada na página de detalhes, mas mantida aqui 
 * para clareza da página de edição e reutilização.
 * @param id O ID do pedido.
 * @returns Um Pedido completo ou null se não encontrado.
 */
async function fetchPedidoDetalhesParaEdicao(id: string): Promise<PedidoComRelacionamentos | null> {
  const supabase = createServerClient();

  // Garante que todos os dados necessários para o formulário sejam buscados
  const { data: pedido, error } = await supabase
    .from('pedidos')
    .select(
      `
        *,
        pedido_itens(*),
        clientes(*)
      `
    )
    .eq('id', id)
    .single();

  if (error || !pedido) {
    console.error('Erro ao buscar detalhes do pedido para edição:', error);
    return null;
  }
  
  return pedido as PedidoComRelacionamentos; 
}

export default async function PedidoEditarPage({ params }: PedidoEditarPageProps) {
  const pedido = await fetchPedidoDetalhesParaEdicao(params.id);

  if (!pedido) {
    return notFound(); 
  }

  return (
    <main className="flex-1 space-y-8 p-6 md:p-10">
      <header className="border-b pb-4 mb-6">
        <Link href={`/admin/pedidos/${pedido.id}`}>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Pedido
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">
          Editar Pedido #{pedido.id.slice(0, 8)}...
        </h1>
        <p className="text-gray-600">
            Cliente: {pedido.clientes?.nome_completo || 'Cliente Desconhecido'}
        </p>
      </header>
      
      <section className="max-w-4xl">
        <EditPedidoForm initialPedido={pedido} />
      </section>

    </main>
  );
}