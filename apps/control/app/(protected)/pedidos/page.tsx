// app/admin/(protected)/pedidos/page.tsx
import { createServerSupabaseClient } from "@lib/supabase/server";
import { PedidosList } from "@/components/admin/pedidos/PedidosList";
import { Database } from "@types/supabase";
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Alias para o tipo de Pedido
export type Pedido = Database['public']['Tables']['pedidos']['Row'];

/**
 * Função de busca de pedidos no Supabase.
 * @returns Array de pedidos ou um array vazio em caso de erro.
 */
async function fetchPedidos(): Promise<Pedido[]> {
  const supabase = createServerSupabaseClient();

  // Busca os pedidos de forma simples por enquanto, ordenando pelo mais recente
  const { data, error } = await supabase
    .from('pedidos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar pedidos:', error);
    // Em um ambiente de produção, um tratamento de erro mais sofisticado seria ideal.
    return []; 
  }

  return data || [];
}

export default async function PedidosPage() {
  const pedidos = await fetchPedidos();

  return (
    <main className="flex-1 space-y-8 p-6 md:p-10">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Pedidos</h1>
        <div className="flex space-x-2">
          {/* Adicionar botão 'Novo Pedido' no futuro, se for possível criar um diretamente. */}
          {/* <Button>Novo Pedido</Button> */}
        </div>
      </header>
      
      <section className="bg-white p-6 rounded-xl shadow-lg">
        <Suspense fallback={<div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>}>
          <PedidosList pedidos={pedidos} />
        </Suspense>
      </section>
    </main>
  );
}