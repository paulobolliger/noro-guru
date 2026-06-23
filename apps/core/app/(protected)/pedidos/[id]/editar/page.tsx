import { getPedidoById } from "../../pedidos-actions";
import { notFound } from 'next/navigation';
import EditPedidoForm from "@/components/admin/pedidos/EditPedidoForm";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface PedidoEditarPageProps {
  params: {
    id: string;
  };
}

export default async function PedidoEditarPage({ params }: PedidoEditarPageProps) {
  const pedido = await getPedidoById(params.id);

  if (!pedido) {
    return notFound(); 
  }

  return (
    <main className="flex-1 space-y-8">
      <header className="border-b border-gray-200 pb-4 mb-6">
        <Link href={`/pedidos/${pedido.id}`}>
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Pedido
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 font-sans">
          Editar Pedido #{pedido.id.slice(0, 8)}...
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Cliente: {pedido.clientes?.nome || 'Cliente Desconhecido'}
        </p>
      </header>
      
      <section className="max-w-4xl">
        <EditPedidoForm initialPedido={pedido as any} />
      </section>
    </main>
  );
}