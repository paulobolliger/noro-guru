import { getPedidoById } from "../pedidos-actions";
import { notFound } from 'next/navigation';
import PedidoDetalhesCard from "@/components/admin/pedidos/PedidoDetalhesCard";
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { createDatabaseClient, visaInfoRepository } from '@noro/db';

interface PedidoDetalhesPageProps {
  params: {
    id: string;
  };
}

export default async function PedidoDetalhesPage({ params }: PedidoDetalhesPageProps) {
  const pedido = await getPedidoById(params.id);

  if (!pedido) {
    return notFound(); 
  }

  let visaRequirements = null;
  const destinos = (pedido as any).destinos as string[] | null;
  const searchQuery = (destinos && destinos.length > 0) ? destinos[0] : pedido.titulo;

  if (searchQuery) {
    const { db, close } = createDatabaseClient();
    try {
      visaRequirements = await visaInfoRepository.searchVisaInfo(db, searchQuery);
    } catch (err) {
      console.error('Erro ao buscar requisitos de vistos no CRM:', err);
    } finally {
      await close();
    }
  }

  return (
    <main className="flex-1 space-y-8">
      <header className="border-b border-gray-200 pb-4 mb-6">
        <Link href="/pedidos">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar à Lista
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 font-sans">
          Detalhes do Pedido #{pedido.id.slice(0, 8)}...
        </h1>
      </header>
      
      <PedidoDetalhesCard pedido={pedido as any} visaRequirements={visaRequirements} />
    </main>
  );
}