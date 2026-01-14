// app/admin/(protected)/pedidos/[id]/page.tsx
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import PedidoDetalhesCard from '@/components/admin/pedidos/PedidoDetalhesCard'; 
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PedidoComRelacionamentos } from '@/types/admin'; // CORRIGIDO: Importa do ficheiro de tipos

interface PedidoDetalhesPageProps {
  params: {
    id: string;
  };
}

async function fetchPedidoDetalhes(id: string): Promise<PedidoComRelacionamentos | null> {
  const supabase = createServerSupabaseClient();

  const { data: pedido, error } = await supabase
    .from('noro_pedidos')
    .select(
      `
        *,
        noro_clientes(*)
      `
    )
    .eq('id', id)
    .single();

  if (error || !pedido) {
    console.error('Erro ao buscar detalhes do pedido:', error);
    return null;
  }

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
      
      <PedidoDetalhesCard pedido={pedido} />
    </main>
  );
}