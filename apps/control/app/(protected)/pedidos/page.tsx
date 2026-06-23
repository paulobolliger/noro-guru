// app/admin/(protected)/pedidos/page.tsx
import { createDatabaseClient } from "@noro/db";
import { PedidosList } from "@/components/pedidos/PedidosList";
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Alias para o tipo de Pedido
export type Pedido = any;

/**
 * Função de busca de pedidos no Postgres VPS.
 * @returns Array de pedidos ou um array vazio em caso de erro.
 */
async function fetchPedidos(): Promise<Pedido[]> {
  const { client, close } = createDatabaseClient();
  try {
    const rows = await client`
      SELECT * 
      FROM sales.orders
      ORDER BY created_at DESC
    `;
    return rows;
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    return []; 
  } finally {
    await close();
  }
}

export default async function PedidosPage() {
  const pedidos = await fetchPedidos();

  return (
    <main className="flex-1 space-y-8 p-6 md:p-10">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Gerenciamento de Pedidos</h1>
        <div className="flex space-x-2">
          {/* Adicionar botão 'Novo Pedido' no futuro, se for possível criar um diretamente. */}
          {/* <Button>Novo Pedido</Button> */}
        </div>
      </header>
      
      <section className="surface-card p-6 rounded-xl border border-default shadow-lg">
        <Suspense fallback={<div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>}>
          <PedidosList pedidos={pedidos} />
        </Suspense>
      </section>
    </main>
  );
}
