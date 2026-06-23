// app/admin/(protected)/pedidos/[id]/page.tsx
import { createDatabaseClient } from "@noro/db";
import { notFound } from 'next/navigation';
import PedidoDetalhesCard from "@/components/pedidos/PedidoDetalhesCard";
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@ui/button";

interface PedidoDetalhesPageProps {
  params: {
    id: string;
  };
}

async function fetchPedidoDetalhes(id: string): Promise<any | null> {
  const { client, close } = createDatabaseClient();
  try {
    const orders = await client`
      SELECT * FROM sales.orders WHERE id = ${id} LIMIT 1
    `;
    if (!orders || orders.length === 0) return null;
    const order = orders[0];

    const [items, clients, charges] = await Promise.all([
      client`SELECT * FROM sales.order_items WHERE pedido_id = ${id}`,
      client`SELECT * FROM crm.clients WHERE id = ${order.cliente_id} LIMIT 1`,
      order.orcamento_id ? client`SELECT * FROM noro.payment_charges WHERE proposal_id = ${order.orcamento_id}` : Promise.resolve([])
    ]);

    return {
      ...order,
      pedido_itens: items,
      clientes: clients[0] || null,
      cobrancas: charges || []
    };
  } catch (error) {
    console.error('Erro ao buscar detalhes do pedido:', error);
    return null;
  } finally {
    await close();
  }
}

export default async function PedidoDetalhesPage({ params }: PedidoDetalhesPageProps) {
  const pedido = await fetchPedidoDetalhes(params.id);

  if (!pedido) {
    return notFound(); 
  }

  return (
    <main className="flex-1 space-y-8 p-6 md:p-10">
      <header className="border-b border-default border-default border-default pb-4 mb-6">
        <Link href="/admin/pedidos">
            <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar à Lista
            </Button>
        </Link>
        <h1 className="text-3xl font-bold text-primary">
          Detalhes do Pedido #{pedido.id.slice(0, 8)}...
        </h1>
      </header>
      
      <PedidoDetalhesCard pedido={pedido} />
    </main>
  );
}
