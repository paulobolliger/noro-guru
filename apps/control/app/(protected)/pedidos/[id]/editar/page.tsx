// app/admin/(protected)/pedidos/[id]/editar/page.tsx
import { createDatabaseClient } from "@noro/db";
import { notFound } from 'next/navigation';
import EditPedidoForm from "@/components/pedidos/EditPedidoForm";
import { Button } from "@ui/button";
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
async function fetchPedidoDetalhesParaEdicao(id: string): Promise<any | null> {
  const { client, close } = createDatabaseClient();
  try {
    const orders = await client`
      SELECT * FROM sales.orders WHERE id = ${id} LIMIT 1
    `;
    if (!orders || orders.length === 0) return null;
    const order = orders[0];

    const [items, clients] = await Promise.all([
      client`SELECT * FROM sales.order_items WHERE pedido_id = ${id}`,
      client`SELECT * FROM crm.clients WHERE id = ${order.cliente_id} LIMIT 1`
    ]);

    return {
      ...order,
      pedido_itens: items,
      clientes: clients[0] || null
    };
  } catch (error) {
    console.error('Erro ao buscar detalhes do pedido para edição:', error);
    return null;
  } finally {
    await close();
  }
}

export default async function PedidoEditarPage({ params }: PedidoEditarPageProps) {
  const pedido = await fetchPedidoDetalhesParaEdicao(params.id);

  if (!pedido) {
    return notFound(); 
  }

  return (
    <main className="flex-1 space-y-8 p-6 md:p-10">
      <header className="border-b border-default border-default pb-4 mb-6">
        <Link href={`/admin/pedidos/${pedido.id}`}>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Pedido
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-primary">
          Editar Pedido #{pedido.id.slice(0, 8)}...
        </h1>
        <p className="text-muted">
            Cliente: {pedido.clientes?.nome || 'Cliente Desconhecido'}
        </p>
      </header>
      
      <section className="max-w-4xl">
        <EditPedidoForm initialPedido={pedido} />
      </section>

    </main>
  );
}
